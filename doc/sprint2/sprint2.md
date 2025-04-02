# 🗓️ Sprint 2 Planning Meetings  
**Date:** Wednesday, March 20, 2025 @5:00 PM (In-person Lab)  
**Team Name:** JUME  
**Participants:** Usman, Max, Jay, Erfan  

**Team Capacity:** Each member is contributing approximately 25–30 hours during Sprint 2.  

---

## 🎯 Sprint Goal  
The goal for Sprint 2 is to complete all key functional modules of SmartStock and ensure they are fully integrated with Supabase. This includes implementing Orders, Products, Customers, Recent Activity Logging, and Analytics features — all tied to real-time data updates.  

Additionally, we aim to polish the dashboard UI, improve user experience with role-based access, and prepare a testable demo setup with seeded data.

---

## 🧠 Identified Spikes

- **Supabase Real-Time Syncing** – Ensure order/product updates reflect instantly across pages.
- **Chart Integration** – Connect Recharts to Supabase for live analytics rendering.
- **Activity Logging** – Design a system to fetch and display recent changes (orders/products).
- **Seeding Strategy** – Enable dummy data for two different warehouses with separate inventories.
- **Role-based Access Filtering** – Display only permitted sections for Admins, Managers, and Employees.

---

## 📋 Sprint 2 User Stories & Tasks

### 🏠 Home Dashboard Enhancements  
- **User Story:** As an admin/manager, I want to view a dashboard with key stats so I can quickly assess stock and orders.  
- **Tasks:**
  - Display total stock, low stock, revenue, and recent updates
  - Connect Recharts PieChart to Supabase
  - Add Weather widget
  - Implement Recent Activity feed (linked to order/product changes)

**Assignee:** Erfan

---

### 📦 Orders Management  
- **User Story:** As a user, I can create and manage orders so that I can fulfill customer needs.  
- **User Story:** As a user, I can update fulfillment status and notify customers when their orders are shipped.  
- **Tasks:**
  - Display orders table with filtering/search
  - Create Order modal with form fields
  - Dropdown for fulfillment status + Notified checkbox
  - Trigger updates in Supabase and reflect in activity log

**Assignees:** Jay, Max

---

### 🧾 Product & Customer Management  
- **User Story:** As an employee, I want to view a list of products so I can check availability.  
- **User Story:** As an admin/manager, I want to add, edit, and delete products so the inventory stays accurate.  
- **User Story:** As an admin/manager, I want to manage customer information for better communication.  
- **Tasks:**
  - Design Product and Customer table UIs
  - Implement CRUD via Supabase
  - Add filters and search functionality
  - Role-based UI access (e.g., employee = read-only)

**Assignees:** Max, Usman

---

### 🔐 Authentication, Backend, Seeding  
- **User Story:** As a user, I want to log in securely and only see features based on my role.  
- **User Story:** As a user, I want to use demo data to test how the system works before real use.  
- **Tasks:**
  - Role-based access enforcement (Admin, Manager, Employee)
  - Seed database for 2 warehouse orgs with Products, Orders, Customers
  - Enable switching across warehouses (multi-tenancy)
  - Implement Sadman Table conventions for pagination + filtering

**Assignee:** Erfan

---

## ✅ Task Breakdown

| Area                 | Members        | Description                                      |
|----------------------|----------------|--------------------------------------------------|
| Home + Analytics     | Erfan, Max     | Dashboard cards, analytics, Recharts             |
| Orders               | Jay, Max       | Table, create order modal, fulfillment updates   |
| Products + Customers | Max, Usman      | CRUD UI + logic, filters, role restrictions      |
| Auth + Backend       | Erfan          | Roles, auth, seeding, Sadman filter conventions  |
| Activity Logging     | Erfan          | Log events from Orders/Products and display them |

---

## 👥 Team Participation  
- All members attended planning meeting.
- Tasks were broken down based on workload and area of responsibility.
- User stories were created from the **actual user’s perspective**, avoiding system-level language.
- Tasks were tracked in Trello with linked branches per feature.
