# 📅 Sprint 2 Planning Meetings

**Date:** Wednesday, March 20, 2025 @5:00 PM (In-person Lab)  
**Team Name:** JUME  
**Participants:** Usman Shahzad, Max Eskandari, Jay Patel, Erfan Razmand  

**Team Capacity:** Each team member has allocated approximately **25–30 hours** for Sprint 2.

---

## 🎯 Sprint Goal

The objective of Sprint 2 is to complete the core functionalities of the SmartStock Inventory Management System and ensure seamless real-time data interaction via Supabase. This includes full implementation of the **Orders, Products, Customers, Analytics**, and **Recent Activity Logging** modules.

Additional focus areas include:
- Enhancing dashboard visualizations
- Finalizing role-based UI filtering
- Enabling seeded demo data for multiple warehouses
- Delivering a smooth user experience across all authenticated roles

---

## 🔍 Identified Spikes

### 1. Supabase Real-Time Syncing  
> Implement real-time updates for Orders and Products across all pages.

### 2. Chart Integration (Recharts)  
> Dynamically render live analytics by connecting Recharts to Supabase data.

### 3. Activity Logging System  
> Design a log system to track and display changes made to orders and products.

### 4. Multi-Warehouse Seeding  
> Develop a strategy to seed demo data for two separate organizations with isolated inventories.

### 5. Role-Based Access Filtering  
> Enforce user-specific access control for Admins, Managers, and Employees.

---

## 📌 Decisions About User Stories

The following user stories have been selected for Sprint 2 based on our backlog priorities:

---

### 1. Home Dashboard Enhancements  
**User Story:**  
_As an admin or manager, I want to view real-time dashboard statistics so that I can monitor stock levels and order performance at a glance._

**Tasks:**  
- Display total stock, low stock alerts, total revenue, and recent system activity  
- Connect Recharts PieChart to Supabase  
- Add weather widget integration  
- Design and implement the Recent Activity feed (linked to Supabase updates)  

**Assignee:** Erfan

---

### 2. Orders Management  
**User Stories:**  
- _As a user, I want to create and manage orders so that I can fulfill customer requests._  
- _As a user, I want to update fulfillment statuses and notify customers when orders are shipped._

**Tasks:**  
- Create Orders table UI with filter/search functionality  
- Design a modal for creating new orders  
- Implement dropdown for fulfillment status and checkbox for customer notification  
- Ensure changes are updated in Supabase and logged in the activity feed  

**Assignee:** Jay

---

### 3. Product & Customer Management  
**User Stories:**  
- _As an employee, I want to view products to check availability._  
- _As an admin/manager, I want to add, edit, or delete products to maintain inventory accuracy._  
- _As an admin/manager, I want to manage customer records for smooth fulfillment and communication._

**Tasks:**  
- Create UI for Product and Customer views  
- Add CRUD functionality via Supabase integration  
- Implement role-based UI behavior (read-only for Employees)  
- Add filtering and search controls  

**Assignees:** Max, Usman

---

### 4. Authentication, Backend, Seeding  
**User Stories:**  
- _As a user, I want to securely log in and only access features appropriate for my role._  
- _As a user, I want to test the system with sample data to better understand its features._

**Tasks:**  
- Implement role-based UI filtering (Admin, Manager, Employee)  
- Seed Supabase with demo data for 2 warehouses (Products, Orders, Customers)  
- Build multi-tenancy switching logic  
- Apply Sadman Table conventions for pagination, filtering, and organization scoping  

**Assignee:** Max

---

## ✅ Task Breakdown Assignments

| Functional Area         | Team Members       | Description                                             |
|--------------------------|--------------------|---------------------------------------------------------|
| Home & Analytics         | Erfan              | Dashboard UI, statistics cards, Recharts integration    |
| Orders Page              | Jay                | Orders table, create modal, fulfillment updates         |
| Products & Customers     | Max, Usman         | CRUD UIs, access control, filtering                     |
| Authentication & Backend | Max                | Auth setup, org seeding, table setup             |
| Activity Logging         | Jay                | Track order/product changes and display recent updates  |

---

## 👥 Team Participation

- All four team members were present and actively contributed to the Sprint 2 planning meeting.
- User stories were written from the end-user’s perspective and follow clear acceptance criteria.
- Tasks were broken down into manageable subtasks and assigned based on individual expertise.
- All items were recorded in Trello, and each team member is responsible for working from a separate Git feature branch.
- Documentation, demo prep, and daily standups will be maintained throughout the sprint.
