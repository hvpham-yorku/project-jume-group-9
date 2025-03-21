INSERT INTO "public"."orgs" ("id", "created_at", "updated_at", "name", "description", "email", "phone", "address_line1", "address_line2", "city", "region", "region_code", "postal_code", "company", "country", "country_code", "currency_code") VALUES ('5773b1bc-81e2-4dc0-887b-2e938b28e2d2', '2025-03-21 00:37:59.164209+00', '2025-03-21 00:37:59.164209+00', 'Globex Industries', 'Technology innovators', 'contact@globex.com', '555-8765-4321', '456 Tech Blvd', 'Floor 12', 'Seattle', 'Washington', 'WA', '98101', 'Globex Inc', 'United States', 'US', 'USD'), ('937b2d87-2035-4b5b-a405-1d27ae7f1d3d', '2025-03-21 00:37:59.164209+00', '2025-03-21 00:37:59.164209+00', 'Acme Corporation', 'A global conglomerate', 'info@acme.com', '555-1234-5678', '123 Main Street', 'Suite 100', 'San Francisco', 'California', 'CA', '94105', 'Acme Corp', 'United States', 'US', 'USD');

-- Add customers for Globex Industries and Acme Corporation
INSERT INTO "public"."customers" (
  "id", "org_id", "name", "email", "phone", 
  "address", "city", "region", "region_code", "postal_code",
  "created_at", "updated_at"
) VALUES 
(
  '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 
  '5773b1bc-81e2-4dc0-887b-2e938b28e2d2', -- Globex Industries
  'Adidas',
  'wholesale@adidas.com',
  '555-123-4567',
  '5055 N Greeley Ave',
  'Portland',
  'Oregon',
  'OR',
  '97217',
  '2025-03-21 01:30:00.000000+00', 
  '2025-03-21 01:30:00.000000+00'
),
(
  '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e', 
  '5773b1bc-81e2-4dc0-887b-2e938b28e2d2', -- Globex Industries
  'Nike',
  'wholesale@nike.com',
  '555-987-6543',
  'One Bowerman Drive',
  'Beaverton',
  'Oregon',
  'OR',
  '97005',
  '2025-03-21 01:31:00.000000+00', 
  '2025-03-21 01:31:00.000000+00'
),
(
  '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f', 
  '937b2d87-2035-4b5b-a405-1d27ae7f1d3d', -- Acme Corporation
  'Reebok',
  'wholesale@reebok.com',
  '555-567-8901',
  '25 Drydock Ave',
  'Boston',
  'Massachusetts',
  'MA',
  '02210',
  '2025-03-21 01:32:00.000000+00', 
  '2025-03-21 01:32:00.000000+00'
);



-- Add products (some with low inventory to trigger restock notifications)
INSERT INTO "public"."products" (
  "id", "org_id", "customer_id", "name", "description", "price", 
  "inventory_quantity", "images", "category", "sku", 
  "restock_threshold", "product_status",
  "created_at", "updated_at"
) VALUES 
(
  'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  '5773b1bc-81e2-4dc0-887b-2e938b28e2d2', -- Globex Industries
  '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', -- Adidas
  'Ultraboost 22',
  'Premium running shoes with responsive Boost midsole',
  189.99,
  50,
  ARRAY['https://example.com/adidas-ultraboost.jpg'],
  'Running Shoes',
  'AD-UB22-001',
  20,
  'active',
  '2025-03-21 01:40:00.000000+00', 
  '2025-03-21 01:40:00.000000+00'
),
(
  'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
  '5773b1bc-81e2-4dc0-887b-2e938b28e2d2', -- Globex Industries
  '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', -- Adidas
  'Tiro Track Pants',
  'Classic track pants with iconic 3-stripes',
  49.99,
  5, -- Below restock threshold to trigger notification
  ARRAY['https://example.com/adidas-tiro.jpg'],
  'Apparel',
  'AD-TTP-002',
  10,
  'active',
  '2025-03-21 01:41:00.000000+00', 
  '2025-03-21 01:41:00.000000+00'
),
(
  'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
  '5773b1bc-81e2-4dc0-887b-2e938b28e2d2', -- Globex Industries
  '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e', -- Nike
  'Air Jordan 1',
  'Legendary basketball shoes with Air cushioning',
  179.99,
  3, -- Below restock threshold to trigger notification
  ARRAY['https://example.com/nike-jordan1.jpg'],
  'Basketball Shoes',
  'NK-AJ1-001',
  15,
  'active',
  '2025-03-21 01:42:00.000000+00', 
  '2025-03-21 01:42:00.000000+00'
),
(
  'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a',
  '937b2d87-2035-4b5b-a405-1d27ae7f1d3d', -- Acme Corporation
  '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f', -- Reebok
  'Nano X3 Training Shoes',
  'Versatile cross-training shoes for various workouts',
  149.99,
  25,
  ARRAY['https://example.com/reebok-nano.jpg'],
  'Training Shoes',
  'RB-NX3-001',
  10,
  'active',
  '2025-03-21 01:43:00.000000+00', 
  '2025-03-21 01:43:00.000000+00'
);

-- Add orders
INSERT INTO "public"."orders" (
  "id", "order_number", "org_id", "customer_id", "product_id",
  "fulfillment_status", "items_count", "total", "notified",
  "created_at", "updated_at"
) VALUES 
(
  'e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b',
  1001,
  '5773b1bc-81e2-4dc0-887b-2e938b28e2d2', -- Globex Industries
  '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', -- Adidas
  'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', -- Ultraboost 22
  'fulfilled',
  2,
  379.98,
  true,
  '2025-03-21 02:00:00.000000+00', 
  '2025-03-21 02:00:00.000000+00'
),
(
  'f6a7b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c',
  1002,
  '5773b1bc-81e2-4dc0-887b-2e938b28e2d2', -- Globex Industries
  '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e', -- Nike
  'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', -- Air Jordan 1
  'pending',
  1,
  179.99,
  false,
  '2025-03-21 02:01:00.000000+00', 
  '2025-03-21 02:01:00.000000+00'
),
(
  'a7b8c9d0-e1f2-3a4b-5c6d-7e8f9a0b1c2d',
  1003,
  '937b2d87-2035-4b5b-a405-1d27ae7f1d3d', -- Acme Corporation
  '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f', -- Reebok
  'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', -- Nano X3 Training Shoes
  'pending',
  3,
  449.97,
  false,
  '2025-03-21 02:02:00.000000+00', 
  '2025-03-21 02:02:00.000000+00'
);



-- Add product restock notifications for items below threshold
INSERT INTO "public"."product_restock_notifications" (
  "id", "product_id", "org_id", "created_at", "updated_at"
) VALUES 
(
  '1f2e3d4c-5b6a-7980-8a7b-6c5d4e3f2a1b',
  'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', -- Tiro Track Pants (inventory: 5, threshold: 10)
  '5773b1bc-81e2-4dc0-887b-2e938b28e2d2', -- Globex Industries
  '2025-03-21 02:10:00.000000+00', 
  '2025-03-21 02:10:00.000000+00'
),
(
  '2f3e4d5c-6b7a-8910-9a8b-7c6d5e4f3a2b',
  'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', -- Air Jordan 1 (inventory: 3, threshold: 15)
  '5773b1bc-81e2-4dc0-887b-2e938b28e2d2', -- Globex Industries
  '2025-03-21 02:11:00.000000+00', 
  '2025-03-21 02:11:00.000000+00'
);




/* ------------------------ RUN THIS AFTER LOGGING IN ----------------------- */
-- INSERT INTO public.org_members (
--   id,                   -- Generate a new UUID for each org_member record
--   org_id,               -- Acme Corporation ID
--   user_id,              -- User's ID from public.users
--   role,                 -- Set as admin
--   created_at,           -- Current timestamp
--   updated_at            -- Current timestamp
-- )
-- SELECT 
--   uuid_generate_v4(),   -- Generate a unique ID for each org_member
--   '937b2d87-2035-4b5b-a405-1d27ae7f1d3d', -- Acme Corporation ID
--   id,                   -- User ID from public.users
--   'admin'::org_role,    -- Cast to org_role enum type
--   NOW(),                -- Current timestamp for created_at
--   NOW()                 -- Current timestamp for updated_at
-- FROM 
--   public.users
-- WHERE 
--   -- Avoid duplicate org_members entries
--   NOT EXISTS (
--     SELECT 1 FROM public.org_members 
--     WHERE 
--       user_id = public.users.id AND 
--       org_id = '937b2d87-2035-4b5b-a405-1d27ae7f1d3d'
--   );