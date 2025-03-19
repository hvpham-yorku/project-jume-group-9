-- Seed data for users table
INSERT INTO users (email, password)
VALUES
  ('user1@example.com', 'password123'),
  ('user2@example.com', 'password123'),
  ('user3@example.com', 'password123'),
  ('user4@example.com', 'password123'),
  ('user5@example.com', 'password123');

-- Seed data for organizations table
INSERT INTO organizations (name)
VALUES
  ('Acme Corporation'),
  ('Globex Industries'),
  ('Stark Enterprises');

-- Seed data for test_table
INSERT INTO test_table (id, created_at, message)
VALUES
  (3, '2025-03-07 00:37:00.824322+00', 'Test message from SmartStock'),
  (9, '2025-03-07 15:19:30.395066+00', 'Test message from SmartStock'),
  (10, '2025-03-07 15:19:35.560549+00', 'Test message from SmartStock'),
  (11, '2025-03-14 23:37:56.954484+00', 'Test message from SmartStock'),
  (12, '2025-03-16 17:08:11.237412+00', 'Test message from SmartStock');

-- Seed data for orders table
INSERT INTO orders (id, order_number, date, customer, total, notified, fulfillment_status, items_count)
VALUES
  (2, 1, '2025-03-17 18:37:26.62021+00', 'Bill Gates', 5000, TRUE, 'On hold', 20),
  (5, 4, '2025-03-17 18:42:15.787034+00', 'Jeff Bezos', 100000, TRUE, 'Fulfilled', 500),
  (6, 5, '2025-03-17 18:46:34.418316+00', 'Bob Smith', 5, TRUE, 'Unfulfilled', 1),
  (23, 22, '2025-03-17 20:12:04.833087+00', 'John White', 5, TRUE, 'Unfulfilled', 1),
  (24, 23, '2025-03-17 23:43:55.333464+00', 'erfan', 2, FALSE, 'Unfulfilled', 2);
