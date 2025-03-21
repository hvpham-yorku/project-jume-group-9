
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA extensions; -- UUIDs (set unique identifiers for each row)
CREATE EXTENSION IF NOT EXISTS "pg_cron" SCHEMA extensions; -- cron jobs (scheduled tasks)
CREATE EXTENSION IF NOT EXISTS "moddatetime" SCHEMA extensions; -- updated_at (set timestamp for when the row was last updated)



/* -------------------------------------------------------------------------- */
/*                              CUSTOM SCHEMAS                                */
/* -------------------------------------------------------------------------- */
CREATE SCHEMA IF NOT EXISTS policy; -- Policy schema for RLS (Row Level Security)
CREATE SCHEMA IF NOT EXISTS util;   -- Utility schema for helper functions (helps you make helper functions)


-- Create role enum
CREATE TYPE org_role AS ENUM ('admin', 'manager', 'staff');
CREATE TYPE fulfillment_status AS ENUM ('pending', 'fulfilled', 'cancelled');
CREATE TYPE product_status AS ENUM ('active', 'draft', 'archived');

/* -------------------------------------------------------------------------- */
/*                                util funcions                               */
/* -------------------------------------------------------------------------- */

/* ⚒️ ---------------- function: prevent modifying columns ---------------- ⚒️ */
CREATE OR REPLACE FUNCTION util.prevent_modifying_columns(record_data record, restricted_columns TEXT[])
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    json_data jsonb;
    restricted_column TEXT;
BEGIN
    -- Handle NULL inputs
    IF record_data IS NULL OR restricted_columns IS NULL THEN
        RETURN TRUE;
    END IF;

    -- Convert record to JSONB
    json_data := to_jsonb(record_data);
    
    -- Check if any restricted column exists in the record
    FOREACH restricted_column IN ARRAY restricted_columns
    LOOP
        -- Check if the column exists and its value is being changed
        IF json_data ? restricted_column AND json_data->>restricted_column IS NOT NULL THEN
            RAISE EXCEPTION 'Column "%" cannot be modified as it is restricted.', restricted_column
                USING HINT = 'This column is protected from modifications.';
        END IF;
    END LOOP;

    RETURN TRUE;
END;
$$;

/* -------------------------------------------------------------------------- */
/*                                    users                                   */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

/* ⚡️ ---------------------- moddatetime:updated_at ---------------------- ⚡️ */
CREATE TRIGGER users_handle_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE moddatetime(updated_at);






/* ⚒️⚡️ -------------- function: sync auth.users to users -------------- ⚒️⚡️ */
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.users (
        id,
        email,
        full_name,
        avatar_url
    )
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$;

/* ⚡️ ---------------- trigger: sync auth.users to users ----------------- ⚡️ */
-- auth.users is the table that contains the users from Supabase Auth
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();




/* 🔒 --------------------------- RLS:Enabled ---------------------------- ✅ */
ALTER TABLE users ENABLE ROW LEVEL SECURITY;


/* ⚒️🔒 ---------------------- RLS function:SELECT ----------------------- 👀2nd */
CREATE OR REPLACE FUNCTION policy.users_select(user_id_param UUID)
RETURNS BOOLEAN 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF auth.uid() = user_id_param THEN -- auth.uid() is the current user's ID
        RETURN TRUE;
    ELSE
        RAISE EXCEPTION 'Error: You can only view your own data';
    END IF;
END;
$$;

/* 🔒 ------------------------- RLS policy:SELECT ------------------------ 👀1st */
CREATE POLICY "Users can view their own data" 
ON users 
FOR SELECT 
TO authenticated 
USING (policy.users_select(users.id));





/* ⚒️🔒 ----------------------- RLS function:UPDATE ---------------------- 🧬2nd */
CREATE OR REPLACE FUNCTION policy.users_update(user_id_param UUID)
RETURNS BOOLEAN 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF auth.uid() = user_id_param THEN -- [*]
        RETURN TRUE;
    ELSE
        RAISE EXCEPTION 'Error: You can only update your own data';
    END IF;
END;
$$;

/* 🔒 ------------------------- RLS policy:UPDATE ------------------------ 🧬 */
CREATE POLICY "Users can update their own data" 
ON users 
FOR UPDATE 
TO authenticated                
USING (policy.users_update(users.id)) 
WITH CHECK (                    
    policy.users_update(users.id) 
    AND util.prevent_modifying_columns(  
        users,                         -- Use the table name instead of NEW
        ARRAY[
            'id',                      
            'created_at',  
            'updated_at' 
        ]
    )
);







/* ⚒️🔒 ---------------------- RLS function:DELETE ----------------------- ❌ */
CREATE OR REPLACE FUNCTION policy.users_delete(user_id_param UUID)
RETURNS BOOLEAN 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF auth.uid() = user_id_param THEN
        RETURN TRUE;
    ELSE
        RAISE EXCEPTION 'Error: You can only delete your own data';
    END IF;
END;
$$;

/* 🔒 ------------------------ RLS policy:DELETE ------------------------- ❌ */
CREATE POLICY "Users can delete their own data" 
ON users 
FOR DELETE 
TO authenticated 
USING (policy.users_delete(users.id));


/* 🔍 ------------------------------ indexes ----------------------------- 🔍 */
CREATE INDEX idx_users_email ON users(email);

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/*                                    users                                   */
/* -------------------------------------------------------------------------- */




/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/*                                    orgs                                    */
/* -------------------------------------------------------------------------- */
CREATE TABLE orgs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    name TEXT NOT NULL,
    description TEXT,
    

    -- owner UUID NOT NULL REFERENCES org_members(id),
    email TEXT NOT NULL,
    phone TEXT,
    
    -- Address Information
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city TEXT NOT NULL,
    region TEXT NOT NULL,                    -- State/Province/Prefecture/etc.
    region_code TEXT NOT NULL,               -- Administrative area code (e.g., CA, ON)
    postal_code TEXT NOT NULL,               -- More international than 'zip'
    company TEXT NOT NULL,
    country TEXT NOT NULL,
    country_code TEXT NOT NULL,              -- ISO 3166-1 alpha-2 code

    
    -- Organization Financial Information
    currency_code TEXT NOT NULL DEFAULT 'USD'
);



/* ⚡️ ---------------------- moddatetime:updated_at ---------------------- ⚡️ */
CREATE TRIGGER orgs_handle_updated_at BEFORE UPDATE ON orgs FOR EACH ROW EXECUTE PROCEDURE moddatetime(updated_at);



/* 🔒 --------------------------- RLS:Enabled ---------------------------- ✅ */
ALTER TABLE orgs ENABLE ROW LEVEL SECURITY;



/* ⚒️🔒 ---------------------- RLS function:SELECT ----------------------- 👀 */
CREATE OR REPLACE FUNCTION policy.orgs_select(org_id_param UUID)
RETURNS BOOLEAN 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM org_members                   -- is the at least 1 org_id in my table?
        WHERE org_members.org_id = org_id_param     -- hey (current org_id) that you just inputted, are you the same in my table?
        AND org_members.user_id = auth.uid()        -- hey current person, are you the same person?
    ) THEN -- if yes, then return true ( you are an actual member of this org and you can view it)
        RETURN TRUE;
    ELSE -- if no, then raise an exception
        RAISE EXCEPTION 'Error: You must be a member of this org to view it';
    END IF;
END;
$$;

/* 🔒 ------------------------- RLS policy:SELECT ------------------------ 👀 */
CREATE POLICY "Members can view orgs they are members of" 
ON orgs 
FOR SELECT 
TO authenticated 
USING (policy.orgs_select(orgs.id));



/* ⚒️🔒 ----------------------- RLS function:UPDATE ---------------------- 🧬 */
CREATE OR REPLACE FUNCTION policy.orgs_update(org_id_param UUID)
RETURNS BOOLEAN 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM org_members
        WHERE org_members.org_id = org_id_param
        AND org_members.user_id = auth.uid()
        AND org_members.role IN ('admin', 'manager')  -- check if role is admin or manager
    ) THEN
        RETURN TRUE;
    ELSE
        RAISE EXCEPTION 'Error: You must be admin or manager to update this org';
    END IF;
END;
$$;

/* 🔒 ------------------------- RLS policy:UPDATE ------------------------ 🧬 */
CREATE POLICY "Admins and managers can update their orgs" 
ON orgs 
FOR UPDATE 
TO authenticated 
USING (policy.orgs_update(orgs.id))
WITH CHECK (
    policy.orgs_update(orgs.id)
    AND util.prevent_modifying_columns(
        orgs, 
        ARRAY[
            'id',
            'created_at',
            'updated_at'
        ]
    )
);
/* ⚒️🔒 ---------------------- RLS function:DELETE ----------------------- ❌ */
CREATE OR REPLACE FUNCTION policy.orgs_delete(org_id_param UUID)
RETURNS BOOLEAN 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM org_members
        WHERE org_members.org_id = org_id_param
        AND org_members.user_id = auth.uid()
        AND org_members.role = 'admin'  -- check if role is admin
    ) THEN
        RETURN TRUE;
    ELSE
        RAISE EXCEPTION 'Error: You must be admin to delete this org';
    END IF;
END;
$$;

/* 🔒 ------------------------ RLS policy:DELETE ------------------------- ❌ */
CREATE POLICY "Admins can delete their orgs" 
ON orgs 
FOR DELETE 
TO authenticated 
USING (policy.orgs_delete(orgs.id));

/* -------------------------------------------------------------------------- */
/*                                    orgs                                    */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */






/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/*                                 org_members                                */
/* -------------------------------------------------------------------------- */
CREATE TABLE org_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,

    role org_role NOT NULL DEFAULT 'staff',

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(org_id, user_id)
);



/* ⚡️ ---------------------- moddatetime:updated_at ---------------------- ⚡️ */
CREATE TRIGGER org_members_handle_updated_at BEFORE UPDATE ON org_members FOR EACH ROW EXECUTE PROCEDURE moddatetime(updated_at);



/* 🔒 --------------------------- RLS:Enabled ---------------------------- ✅ */
ALTER TABLE org_members ENABLE ROW LEVEL SECURITY;



/* ⚒️🔒 ---------------------- RLS function:SELECT ----------------------- 👀 */
CREATE OR REPLACE FUNCTION policy.org_members_select(org_id_param UUID) -- this org_id is the from the record I want to view
RETURNS BOOLEAN 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM org_members  -- the point is that org_id and user_id are together coupled with org_members...
        WHERE org_members.org_id = org_id_param   -- ...so first If there exists a org_id in org_members AT ALL ...
        AND org_members.user_id = auth.uid() -- ...Since org_id comes with user_id --> Then if my user id (auth.uid()) is the same as the org_id in the record --> we good (thats my org_id).
    ) THEN
        RETURN TRUE;
    ELSE
        RAISE EXCEPTION 'Error: You must be a member of this org to view its members';
    END IF;
END;
$$;

/* 🔒 ------------------------- RLS policy:SELECT ------------------------ 👀 */
CREATE POLICY "Members can view members in their orgs" 
ON org_members 
FOR SELECT 
TO authenticated 
USING (policy.org_members_select(org_members.org_id));



/* ⚒️🔒 ----------------------- RLS function:INSERT ---------------------- 🔥 */
CREATE OR REPLACE FUNCTION policy.org_members_insert(org_id_param UUID)
RETURNS BOOLEAN 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM org_members
        WHERE org_members.org_id = org_id_param
        AND org_members.user_id = auth.uid()
        AND org_members.role = 'admin' -- check if role is admin
    ) THEN
        RETURN TRUE;
    ELSE
        RAISE EXCEPTION 'Error: You must be admin to add members.';
    END IF;
END;
$$;

/* 🔒 ------------------------- RLS policy:INSERT ------------------------ 🔥 */
CREATE POLICY "Admins can add members to this org" 
ON org_members 
FOR INSERT 
TO authenticated
WITH CHECK (
    policy.org_members_insert(org_members.org_id)
    AND util.prevent_modifying_columns(
        org_members,
        ARRAY[
            'id', 
            'created_at', 
            'updated_at'
        ]
    )
);



/* ⚒️🔒 ----------------------- RLS function:UPDATE ---------------------- 🧬 */
CREATE OR REPLACE FUNCTION policy.org_members_update(org_id_param UUID)
RETURNS BOOLEAN 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM org_members
        WHERE org_members.org_id = org_id_param
        AND org_members.user_id = auth.uid()
        AND org_members.role = 'admin'
    ) THEN
        RETURN TRUE;
    ELSE
        RAISE EXCEPTION 'Error: You must be admin to manage members.';
    END IF;
END;
$$;

/* 🔒 ------------------------- RLS policy:UPDATE ------------------------ 🧬 */
CREATE POLICY "Admins can update members" 
ON org_members 
FOR UPDATE 
TO authenticated 
USING (policy.org_members_update(org_members.org_id))
WITH CHECK (
    policy.org_members_update(org_members.org_id)
    AND util.prevent_modifying_columns(
        org_members,
        ARRAY[
            'id', 
            'created_at', 
            'updated_at'
        ]
    )
);



/* ⚒️🔒 ---------------------- RLS function:DELETE ----------------------- ❌ */
CREATE OR REPLACE FUNCTION policy.org_members_delete(org_id_param UUID)
RETURNS BOOLEAN 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM org_members
        WHERE org_members.org_id = org_id_param
        AND org_members.user_id = auth.uid()
        AND org_members.role = 'admin'
    ) THEN
        RETURN TRUE;
    ELSE
        RAISE EXCEPTION 'Error: You must be admin to delete members.';
    END IF; 
END;
$$;

/* 🔒 ------------------------ RLS policy:DELETE ------------------------- ❌ */
CREATE POLICY "Admins can delete members" 
ON org_members 
FOR DELETE 
TO authenticated 
USING (policy.org_members_delete(org_members.org_id));



/* 🔍 ------------------------------ indexes ----------------------------- 🔍 */
CREATE INDEX idx_org_members_org_id ON org_members(org_id);
CREATE INDEX idx_org_members_user_id ON org_members(user_id);
CREATE INDEX idx_org_members_role ON org_members(role);




/* -------------------------------------------------------------------------- */
/*                                 org_members                                */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */





/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/*                                   customers                                */
/* -------------------------------------------------------------------------- */

CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,

    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    city TEXT,
    region TEXT,
    region_code TEXT,
    postal_code TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);





/* ⚡️ ---------------------- moddatetime:updated_at ---------------------- ⚡️ */
CREATE TRIGGER customers_handle_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE PROCEDURE moddatetime(updated_at);




/* 🔒 --------------------------- RLS:Enabled ---------------------------- ✅ */
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;




/* ⚒️🔒 ---------------------- RLS function:SELECT ----------------------- 👀 */
CREATE OR REPLACE FUNCTION policy.customers_select(org_id_param UUID) -- this customers_org_id is from the Customer record I want to view
RETURNS BOOLEAN 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM org_members  -- the point is that org_id and user_id are together coupled with org_members...
        WHERE org_members.org_id = org_id_param   -- ...so first If there exists a org_id in org_members AT ALL ...
        AND org_members.user_id = auth.uid() -- ...Since org_id + user_id comes together --> Then if my user id (auth.uid()) is the same as the org_id in the record --> we good (thats my org_id).
        
    ) THEN
        RETURN TRUE;
    ELSE
        RAISE EXCEPTION 'Error: You must be a member of this org to view its members';
    END IF;
END;
$$;

/* 🔒 ------------------------- RLS policy:SELECT ------------------------ 👀 */
CREATE POLICY "Members can view customers in their orgs" 
ON customers 
FOR SELECT 
TO authenticated 
USING (policy.customers_select(customers.org_id));



/* ⚒️🔒 ----------------------- RLS function:INSERT ---------------------- 🔥 */
CREATE OR REPLACE FUNCTION policy.customers_insert(org_id_param UUID)
RETURNS BOOLEAN 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM org_members
        WHERE org_members.org_id = org_id_param
        AND org_members.user_id = auth.uid()
        AND org_members.role = 'admin'  -- check if role is admin
    ) THEN
        RETURN TRUE;
    ELSE
        RAISE EXCEPTION 'Error: You must be admin to add customers.';
    END IF;
END;
$$;


/* 🔒 ------------------------- RLS policy:INSERT ------------------------ 🔥 */
CREATE POLICY "Admins can add customers" 
ON customers 
FOR INSERT 
TO authenticated
WITH CHECK (
    policy.customers_insert(customers.org_id)
    AND util.prevent_modifying_columns(
        customers,
        ARRAY[
            'id', 
            'created_at', 
            'updated_at'
        ]
    )
);





/* ⚒️🔒 ----------------------- RLS function:UPDATE ---------------------- 🧬 */
CREATE OR REPLACE FUNCTION policy.customers_update(org_id_param UUID)
RETURNS BOOLEAN 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM org_members
        WHERE org_members.org_id = org_id_param
        AND org_members.user_id = auth.uid()
        AND org_members.role  = 'admin' 
    ) THEN
        RETURN TRUE;
    ELSE
        RAISE EXCEPTION 'Error: You must be admin to update customers.'; 
    END IF;
END;
$$;

/* 🔒 ------------------------- RLS policy:UPDATE ------------------------ 🧬 */
CREATE POLICY "Admins can update customers" 
ON customers 
FOR UPDATE 
TO authenticated 
USING (policy.customers_update(customers.org_id))
WITH CHECK (
    policy.customers_update(customers.org_id)
    AND util.prevent_modifying_columns(
        customers,
        ARRAY[
            'id', 
            'created_at', 
            'updated_at'
        ]
    )
);


/* ⚒️🔒 ---------------------- RLS function:DELETE ----------------------- ❌ */
CREATE OR REPLACE FUNCTION policy.customers_delete(org_id_param UUID)
RETURNS BOOLEAN 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM org_members
        WHERE org_members.org_id = org_id_param
        AND org_members.user_id = auth.uid()
        AND org_members.role  = 'admin'
    ) THEN
        RETURN TRUE;
    ELSE
        RAISE EXCEPTION 'Error: You must be admin to delete customers.';
    END IF; 
END;
$$;

/* 🔒 ------------------------ RLS policy:DELETE ------------------------- ❌ */
CREATE POLICY "Admins can delete customers" 
ON customers 
FOR DELETE 
TO authenticated 
USING (policy.customers_delete(customers.org_id));




/* 🔍 ------------------------------ indexes ----------------------------- 🔍 */
CREATE INDEX idx_customers_org_id ON customers(org_id);
CREATE INDEX idx_customers_email ON customers(email);


/* -------------------------------------------------------------------------- */
/*                                   customers                                */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */




/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/*                                   products                                 */
/* -------------------------------------------------------------------------- */


CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,

    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    inventory_quantity INTEGER NOT NULL,
    images TEXT[],
    category TEXT,
    sku TEXT,
    restock_threshold INTEGER NOT NULL,
    product_status product_status NOT NULL DEFAULT 'draft',


    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);





/* ⚡️ ---------------------- moddatetime:updated_at ---------------------- ⚡️ */
CREATE TRIGGER products_handle_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE moddatetime(updated_at);



/* -------------------------------------------------------------------------- */
/*                          THRESHOLD RESTOCK TRIGGER                         */
/* -------------------------------------------------------------------------- */
/* ⚒️⚡️ ----- function: check inventory and create restock notification ----- ⚒️⚡️ */
CREATE OR REPLACE FUNCTION public.handle_product_restock_notification()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if inventory has fallen below threshold
    IF NEW.inventory_quantity < NEW.restock_threshold THEN
        -- Check if a notification already exists for this product
        IF NOT EXISTS (
            SELECT 1 FROM product_restock_notifications 
            WHERE product_id = NEW.id
        ) THEN
            -- Create a new restock notification
            INSERT INTO product_restock_notifications (
                product_id,
                org_id
            ) VALUES (
                NEW.id,
                NEW.org_id
            );
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

/* ⚡️ ---------- trigger: monitor inventory for restock threshold ---------- ⚡️ */
CREATE TRIGGER on_product_inventory_updated 
AFTER UPDATE OF inventory_quantity ON products 
FOR EACH ROW 
WHEN (NEW.inventory_quantity < NEW.restock_threshold)
EXECUTE FUNCTION public.handle_product_restock_notification();




/* 🔒 --------------------------- RLS:Enabled ---------------------------- ✅ */
ALTER TABLE products ENABLE ROW LEVEL SECURITY;







/* ⚒️🔒 ---------------------- RLS function:SELECT ----------------------- 👀 */
CREATE OR REPLACE FUNCTION policy.products_select(org_id_param UUID) -- this products_org_id is from the Product record I want to view
RETURNS BOOLEAN 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM org_members  -- the point is that org_id and user_id are together coupled with org_members...
        WHERE org_members.org_id = org_id_param   -- ...so first If there exists a org_id in org_members AT ALL ...
        AND org_members.user_id = auth.uid() -- ...Since org_id + user_id comes together --> Then if my user id (auth.uid()) is the same as the org_id in the record --> we good (thats my org_id).
        
    ) THEN
        RETURN TRUE;
    ELSE
        RAISE EXCEPTION 'Error: You must be a member of this org to view its products';
    END IF;
END;
$$;

/* 🔒 ------------------------- RLS policy:SELECT ------------------------ 👀 */
CREATE POLICY "Members can view products in their orgs" 
ON products 
FOR SELECT 
TO authenticated 
USING (policy.products_select(products.org_id));




/* ⚒️🔒 ----------------------- RLS function:INSERT ---------------------- 🔥 */
CREATE OR REPLACE FUNCTION policy.products_insert(org_id_param UUID)
RETURNS BOOLEAN 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM org_members
        WHERE org_members.org_id = org_id_param
        AND org_members.user_id = auth.uid()
        AND org_members.role IN ('admin', 'manager')  -- check if role is admin or manager
    ) THEN
        RETURN TRUE;
    ELSE
        RAISE EXCEPTION 'Error: You must be admin or manager to add products.';
    END IF;
END;
$$;

/* 🔒 ------------------------- RLS policy:INSERT ------------------------ 🔥 */
CREATE POLICY "Admins and managers can add products" 
ON products 
FOR INSERT 
TO authenticated
WITH CHECK (
    policy.products_insert(products.org_id)
    AND util.prevent_modifying_columns(
        products,
        ARRAY[
            'id', 
            'created_at', 
            'updated_at'
        ]
    )
);





/* ⚒️🔒 ----------------------- RLS function:UPDATE ---------------------- 🧬 */
CREATE OR REPLACE FUNCTION policy.products_update(org_id_param UUID)
RETURNS BOOLEAN 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM org_members
        WHERE org_members.org_id = org_id_param
        AND org_members.user_id = auth.uid()
        AND org_members.role IN ('admin', 'manager')
    ) THEN
        RETURN TRUE;
    ELSE
        RAISE EXCEPTION 'Error: You must be admin or manager to update products.';
    END IF;
END;
$$;

/* 🔒 ------------------------- RLS policy:UPDATE ------------------------ 🧬 */
CREATE POLICY "Admins and managers can update products" 
ON products 
FOR UPDATE 
TO authenticated 
USING (policy.products_update(products.org_id))
WITH CHECK (
    policy.products_update(products.org_id)
    AND util.prevent_modifying_columns(
        products,
        ARRAY[
            'id', 
            'created_at', 
            'updated_at'
        ]
    )
);



/* ⚒️🔒 ---------------------- RLS function:DELETE ----------------------- ❌ */
CREATE OR REPLACE FUNCTION policy.products_delete(org_id_param UUID)
RETURNS BOOLEAN 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM org_members
        WHERE org_members.org_id = org_id_param
        AND org_members.user_id = auth.uid()
        AND org_members.role IN ('admin', 'manager')
    ) THEN
        RETURN TRUE;
    ELSE
        RAISE EXCEPTION 'Error: You must be admin or manager to delete products.';
    END IF; 
END;
$$;

/* 🔒 ------------------------ RLS policy:DELETE ------------------------- ❌ */
CREATE POLICY "Admins and managers can delete products" 
ON products 
FOR DELETE 
TO authenticated 
USING (policy.products_delete(products.org_id));



/* 🔍 ------------------------------ indexes ----------------------------- 🔍 */
CREATE INDEX idx_products_org_id ON products(org_id);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_customer_id ON products(customer_id);
CREATE INDEX idx_products_status ON products(product_status);






/* -------------------------------------------------------------------------- */
/*                                   products                                 */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */




/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/*                                   orders                                   */
/* -------------------------------------------------------------------------- */

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number INTEGER NOT NULL,
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,

    fulfillment_status fulfillment_status NOT NULL DEFAULT 'pending',
    items_count INTEGER NOT NULL,
    total NUMERIC NOT NULL,

    notified boolean default false,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);




/* ⚡️ ---------------------- moddatetime:updated_at ---------------------- ⚡️ */
CREATE TRIGGER orders_handle_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE moddatetime(updated_at);




/* 🔒 --------------------------- RLS:Enabled ---------------------------- ✅ */
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;



/* ⚒️🔒 ---------------------- RLS function:SELECT ----------------------- 👀 */
CREATE OR REPLACE FUNCTION policy.orders_select(org_id_param UUID) -- this orders_org_id is from the Order record I want to view
RETURNS BOOLEAN 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM org_members
        WHERE org_members.org_id = org_id_param
        AND org_members.user_id = auth.uid()
    ) THEN
        RETURN TRUE;
    ELSE
        RAISE EXCEPTION 'Error: You must be a member of this org to view its orders';
    END IF;
END;
$$;

/* 🔒 ------------------------- RLS policy:SELECT ------------------------ 👀 */
CREATE POLICY "Members can view orders in their orgs" 
ON orders 
FOR SELECT 
TO authenticated 
USING (policy.orders_select(orders.org_id));




/* ⚒️🔒 ----------------------- RLS function:INSERT ---------------------- 🔥 */
CREATE OR REPLACE FUNCTION policy.orders_insert(org_id_param UUID)
RETURNS BOOLEAN 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM org_members
        WHERE org_members.org_id = org_id_param
        AND org_members.user_id = auth.uid()
        AND org_members.role IN ('admin', 'manager')  -- check if role is admin or manager
    ) THEN
        RETURN TRUE;
    ELSE
        RAISE EXCEPTION 'Error: You must be admin or manager to add orders.';
    END IF;
END;
$$;

/* 🔒 ------------------------- RLS policy:INSERT ------------------------ 🔥 */
CREATE POLICY "Admins and managers can add orders" 
ON orders 
FOR INSERT 
TO authenticated
WITH CHECK (
    policy.orders_insert(orders.org_id)
    AND util.prevent_modifying_columns(
        orders,
        ARRAY[
            'id', 
            'created_at', 
            'updated_at'
        ]
    )
);




/* ⚒️🔒 ----------------------- RLS function:UPDATE ---------------------- 🧬 */
CREATE OR REPLACE FUNCTION policy.orders_update(org_id_param UUID)
RETURNS BOOLEAN 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM org_members
        WHERE org_members.org_id = org_id_param
        AND org_members.user_id = auth.uid()
        AND org_members.role IN ('admin', 'manager')
    ) THEN
        RETURN TRUE;
    ELSE
        RAISE EXCEPTION 'Error: You must be admin or manager to update orders.';
    END IF;
END;
$$;

/* 🔒 ------------------------- RLS policy:UPDATE ------------------------ 🧬 */
CREATE POLICY "Admins and managers can update orders" 
ON orders 
FOR UPDATE 
TO authenticated 
USING (policy.orders_update(orders.org_id))
WITH CHECK (
    policy.orders_update(orders.org_id)
    AND util.prevent_modifying_columns(
        orders,
        ARRAY[
            'id', 
            'created_at', 
            'updated_at'
        ]
    )
);



/* ⚒️🔒 ---------------------- RLS function:DELETE ----------------------- ❌ */
CREATE OR REPLACE FUNCTION policy.orders_delete(org_id_param UUID)
RETURNS BOOLEAN 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM org_members
        WHERE org_members.org_id = org_id_param
        AND org_members.user_id = auth.uid()
        AND org_members.role IN ('admin', 'manager')
    ) THEN
        RETURN TRUE;
    ELSE
        RAISE EXCEPTION 'Error: You must be admin or manager to delete orders.';
    END IF; 
END;
$$;

/* 🔒 ------------------------ RLS policy:DELETE ------------------------- ❌ */
CREATE POLICY "Admins and managers can delete orders" 
ON orders 
FOR DELETE 
TO authenticated 
USING (policy.orders_delete(orders.org_id));




/* 🔍 ------------------------------ indexes ----------------------------- 🔍 */
CREATE INDEX idx_orders_org_id ON orders(org_id);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_product_id ON orders(product_id);
CREATE INDEX idx_orders_fulfillment_status ON orders(fulfillment_status);











/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/*                          product_restock_notifications                     */
/* -------------------------------------------------------------------------- */


CREATE TABLE product_restock_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,


    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);





/* ⚡️ ---------------------- moddatetime:updated_at ---------------------- ⚡️ */
CREATE TRIGGER product_restock_notifications_handle_updated_at BEFORE UPDATE ON product_restock_notifications FOR EACH ROW EXECUTE PROCEDURE moddatetime(updated_at);




/* 🔒 --------------------------- RLS:Enabled ---------------------------- ✅ */
ALTER TABLE product_restock_notifications ENABLE ROW LEVEL SECURITY;







/* ⚒️🔒 ---------------------- RLS function:SELECT ----------------------- 👀 */
CREATE OR REPLACE FUNCTION policy.product_restock_notifications_select(org_id_param UUID) -- this product_restock_notifications_org_id is from the Product record I want to view
RETURNS BOOLEAN 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM org_members  -- the point is that org_id and user_id are together coupled with org_members...
        WHERE org_members.org_id = org_id_param   -- ...so first If there exists a org_id in org_members AT ALL ...
        AND org_members.user_id = auth.uid() -- ...Since org_id + user_id comes together --> Then if my user id (auth.uid()) is the same as the org_id in the record --> we good (thats my org_id).
        
    ) THEN
        RETURN TRUE;
    ELSE
        RAISE EXCEPTION 'Error: You must be a member of this org to view its product_restock_notifications';
    END IF;
END;
$$;

/* 🔒 ------------------------- RLS policy:SELECT ------------------------ 👀 */
CREATE POLICY "Members can view product_restock_notifications in their orgs" 
ON product_restock_notifications 
FOR SELECT 
TO authenticated 
USING (policy.product_restock_notifications_select(product_restock_notifications.org_id));




/* ⚒️🔒 ---------------------- RLS function:DELETE ----------------------- ❌ */
CREATE OR REPLACE FUNCTION policy.product_restock_notifications_delete(org_id_param UUID)
RETURNS BOOLEAN 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM org_members
        WHERE org_members.org_id = org_id_param
        AND org_members.user_id = auth.uid()
        AND org_members.role IN ('admin', 'manager')
    ) THEN
        RETURN TRUE;
    ELSE
        RAISE EXCEPTION 'Error: You must be admin or manager to delete product_restock_notifications.';
    END IF; 
END;
$$;

/* 🔒 ------------------------ RLS policy:DELETE ------------------------- ❌ */
CREATE POLICY "Admins and managers can delete product_restock_notifications" 
ON product_restock_notifications 
FOR DELETE 
TO authenticated 
USING (policy.product_restock_notifications_delete(product_restock_notifications.org_id));











