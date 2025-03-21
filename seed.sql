-- Clear any existing data to avoid conflicts
TRUNCATE product_restock_notifications CASCADE;
TRUNCATE orders CASCADE;
TRUNCATE products CASCADE;
TRUNCATE customers CASCADE;
TRUNCATE org_members CASCADE;
TRUNCATE orgs CASCADE;
TRUNCATE users CASCADE;

-- Seed data for auth.users (assuming this exists, insert won't happen via this method in real system)
-- In actual Supabase, users would be created via auth system
INSERT INTO auth.users (id, email, raw_user_meta_data)
VALUES
  ('d0c5340a-d147-4e23-8370-7f723a410c4c', 'admin@example.com', '{"full_name": "Admin User", "avatar_url": "https://i.pravatar.cc/150?u=admin"}'),
  ('f91c20c5-e872-4394-94a2-29ebe65c6c34', 'manager@example.com', '{"full_name": "Manager User", "avatar_url": "https://i.pravatar.cc/150?u=manager"}'),
  ('c82f24a5-b0bc-4f1e-a0cf-7b387e76c6e1', 'staff@example.com', '{"full_name": "Staff User", "avatar_url": "https://i.pravatar.cc/150?u=staff"}');

-- Seed data for users (these should automatically be created by trigger when auth.users are created)
-- But we're adding them manually for testing
INSERT INTO users (id, full_name, email, avatar_url)
VALUES
  ('d0c5340a-d147-4e23-8370-7f723a410c4c', 'Admin User', 'admin@example.com', 'https://i.pravatar.cc/150?u=admin'),
  ('f91c20c5-e872-4394-94a2-29ebe65c6c34', 'Manager User', 'manager@example.com', 'https://i.pravatar.cc/150?u=manager'),
  ('c82f24a5-b0bc-4f1e-a0cf-7b387e76c6e1', 'Staff User', 'staff@example.com', 'https://i.pravatar.cc/150?u=staff');

-- Seed data for orgs
INSERT INTO orgs (
  id, name, description, email, phone, 
  address_line1, address_line2, city, region, region_code, 
  postal_code, company, country, country_code, currency_code
)
VALUES
  (
    'f24d6330-9d5e-4423-8738-cb3bb8641f8e', 
    'Acme Corporation', 
    'A global conglomerate', 
    'info@acme.com', 
    '555-1234-5678',
    '123 Main Street', 
    'Suite 100', 
    'San Francisco', 
    'California', 
    'CA',
    '94105', 
    'Acme Corp', 
    'United States', 
    'US', 
    'USD'
  ),
  (
    'c52c6e0a-7a9c-4eb9-b5e7-23d9fc01c9ed', 
    'Globex Industries', 
    'Technology innovators', 
    'contact@globex.com', 
    '555-8765-4321',
    '456 Tech Blvd', 
    'Floor 12', 
    'Seattle', 
    'Washington', 
    'WA',
    '98101', 
    'Globex Inc', 
    'United States', 
    'US', 
    'USD'
  );

-- Seed data for org_members (associate users with orgs and roles)
INSERT INTO org_members (id, org_id, user_id, role)
VALUES
  ('a3d7e11c-d9b4-4712-8a16-813b8e7b6fcb', 'f24d6330-9d5e-4423-8738-cb3bb8641f8e', 'd0c5340a-d147-4e23-8370-7f723a410c4c', 'admin'),
  ('b76e6c3d-9f5a-4be2-8c09-d6a8de7e1fd2', 'f24d6330-9d5e-4423-8738-cb3bb8641f8e', 'f91c20c5-e872-4394-94a2-29ebe65c6c34', 'manager'),
  ('e58c8d4f-1a2b-4c3d-9e5f-0a1b2c3d4e5f', 'f24d6330-9d5e-4423-8738-cb3bb8641f8e', 'c82f24a5-b0bc-4f1e-a0cf-7b387e76c6e1', 'staff'),
  ('7d9c0e1a-2b3c-4d5e-6f7g-8h9i0j1k2l3m', 'c52c6e0a-7a9c-4eb9-b5e7-23d9fc01c9ed', 'd0c5340a-d147-4e23-8370-7f723a410c4c', 'admin');

-- Seed data for customers
INSERT INTO customers (
  id, org_id, name, email, phone, address, city, region, region_code, postal_code
)
VALUES
  (
    '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p', 
    'f24d6330-9d5e-4423-8738-cb3bb8641f8e',
    'John Doe',
    'john@example.com',
    '555-123-4567',
    '789 Customer St',
    'New York',
    'New York',
    'NY',
    '10001'
  ),
  (
    '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q', 
    'f24d6330-9d5e-4423-8738-cb3bb8641f8e',
    'Jane Smith',
    'jane@example.com',
    '555-987-6543',
    '456 Client Ave',
    'Los Angeles',
    'California',
    'CA',
    '90001'
  ),
  (
    '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r', 
    'c52c6e0a-7a9c-4eb9-b5e7-23d9fc01c9ed',
    'Bob Johnson',
    'bob@example.com',
    '555-567-8901',
    '123 Buyer Blvd',
    'Chicago',
    'Illinois',
    'IL',
    '60601'
  );

-- Seed data for products (note some products have inventory below restock_threshold to trigger notifications)
INSERT INTO products (
  id, org_id, customer_id, name, description, price, 
  inventory_quantity, images, category, sku, 
  restock_threshold, product_status
)
VALUES
  (
    'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
    'f24d6330-9d5e-4423-8738-cb3bb8641f8e',
    '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    'Premium Widget',
    'The best widget money can buy',
    99.99,
    50,
    ARRAY['https://example.com/widget.jpg'],
    'Widgets',
    'WID-PREM-001',
    20,
    'active'
  ),
  (
    'b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7',
    'f24d6330-9d5e-4423-8738-cb3bb8641f8e',
    '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    'Standard Widget',
    'A solid everyday widget',
    49.99,
    5, -- Below restock threshold to trigger notification
    ARRAY['https://example.com/widget-standard.jpg'],
    'Widgets',
    'WID-STD-002',
    10,
    'active'
  ),
  (
    'c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8',
    'f24d6330-9d5e-4423-8738-cb3bb8641f8e',
    '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
    'Basic Gadget',
    'Entry-level gadget for beginners',
    29.99,
    3, -- Below restock threshold to trigger notification
    ARRAY['https://example.com/gadget-basic.jpg'],
    'Gadgets',
    'GAD-BAS-001',
    15,
    'active'
  ),
  (
    'd4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s9',
    'c52c6e0a-7a9c-4eb9-b5e7-23d9fc01c9ed',
    '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r',
    'Advanced Gizmo',
    'Cutting-edge gizmo with smart features',
    149.99,
    25,
    ARRAY['https://example.com/gizmo-advanced.jpg'],
    'Gizmos',
    'GIZ-ADV-001',
    10,
    'active'
  );

-- Seed data for orders
INSERT INTO orders (
  id, order_number, org_id, customer_id, product_id,
  fulfillment_status, items_count, total, notified
)
VALUES
  (
    'e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0',
    1001,
    'f24d6330-9d5e-4423-8738-cb3bb8641f8e',
    '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
    'fulfilled',
    2,
    199.98,
    true
  ),
  (
    'f6g7h8i9-j0k1-l2m3-n4o5-p6q7r8s9t0u1',
    1002,
    'f24d6330-9d5e-4423-8738-cb3bb8641f8e',
    '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
    'b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7',
    'pending',
    1,
    49.99,
    false
  ),
  (
    'g7h8i9j0-k1l2-m3n4-o5p6-q7r8s9t0u1v2',
    1003,
    'c52c6e0a-7a9c-4eb9-b5e7-23d9fc01c9ed',
    '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r',
    'd4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s9',
    'pending',
    3,
    449.97,
    false
  );

-- The product_restock_notifications table should automatically be populated by the trigger
-- for products with inventory below the restock threshold
