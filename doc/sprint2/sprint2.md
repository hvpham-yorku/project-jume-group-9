# Release Planning Meetings  
**Wednesday, March 26, 2025 @5:00 PM (In-person Lab)**

##### Product Owner: Erfan Razmand

---

## Release Goal  
The goal of Sprint 2 is to finish the remaining features for **SmartStock**, the inventory and order management system, and make sure everything connects properly to **Supabase**. This includes finalizing the main structure, adding multi-tenancy, role-based access, and improving the user interface with real-time data and analytics.

**Focus Areas:**

- **Orders Page**  
  - Create, update, and track customer orders in real-time.

- **Product Inventory**  
  - Manage product listings and stock levels, and set up restock alerts.

- **Home Page**  
  - Show current stock, orders, and recent activities.

- **Analytics Page**  
  - Display charts for order and stock performance over time.

---

## Scope of the Project: Epics and Key Features  

**1. Orders Management Epic**  
*Goal:* Allow admins to manage customer orders through an easy-to-use interface.

  **Key Features:**  
  - View orders in a table format.  
  - Create and update orders.  
  - Track order status (fulfilled, pending, etc.).  
  - Search for orders.

  **User Stories:**  
  - As an admin, I can view and manage all orders.  
  - As an admin, I can create and update orders.

---

**2. Product & Inventory Management Epic**  
*Goal:* Manage the products in the inventory, including adding, editing, and viewing products.

  **Key Features:**  
  - Add new products to the inventory.  
  - Edit product details.  
  - Search and filter products.

  **User Stories:**  
  - As an admin, I can add, edit, and view products.

---

**3. Home Page & Activity Epic**  
*Goal:* Show key stock data and recent activities in one place.

  **Key Features:**  
  - Display stock summary (orders, inventory levels).  
  - Show recent activities.  
  - Show a pie chart of pending vs. fulfilled orders.  

  **User Stories:**  
  - As a user, I can view stock levels and recent activities.

---

**4. Analytics Page Epic**  
*Goal:* Show data in charts to help with decision-making.

  **Key Features:**  
  - Display performance data for orders and stock over time.  
  - Use charts to show trends.

  **User Stories:**  
  - As a user, I can view performance data for orders and stock.

---

## Task Breakdown Assignments  

| Functional Area           | Team Members     | Description                                                    |
|--------------------------|------------------|----------------------------------------------------------------|
| Auth + Backend            | Max              | Set up authentication, multi-tenancy, and connect to database |
| Home Page + Analytics     | Max              | Build dashboard, show activity feed, display real-time data    |
| Orders Page + Products    | Max, Jay         | Manage orders and products, set up notifications, track fulfillment |
| Activity Log + Docs       | Max, Nams        | Track activity in the system, write documentation              |
| Customers + Profile Edit  | Max, Erfan       | Manage customer info and profile editing                       |

---

## Burndown Chart Info  

**March 26–30:** We focused on setting up the backend, authentication, and the table structure to make sure everything could work together smoothly.  

**Mid Sprint:** We worked on the Orders and Products pages, fixing issues with data syncing and notifications.  

**End Sprint:** We finished the dashboard, analytics, and activity logs. The profile editing and customer management tasks were completed last because they were lighter tasks.

---

## Team Participation  

- All team members — Max, Jay, Erfan, and Nams — were present for the planning session and helped with the decisions.  
- User stories were clear, with specific tasks to be completed.  
- Tasks were assigned based on what each person would work on.  
- We tracked progress on Trello, and everyone worked on their own Git branches.  
- We had daily check-ins to make sure we were on track.

---
