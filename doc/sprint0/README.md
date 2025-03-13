# SmartStock - Inventory Management System

## **Project Overview**
**SmartStock** is a **warehouse and inventory management system** designed to help businesses efficiently track, optimize, and manage their stock. The system is equipped with role-based access control, real-time stock updates, supplier management, order tracking, and more to streamline inventory and warehouse processes.

---
## Motivation
The **Inventory Management System** (IMS) was developed to help businesses efficiently manage and track their inventory, monitor stock levels, and automate reordering processes. Small and medium-sized businesses face challenges in managing their inventory manually, leading to errors, overstocking, and stockouts. This project aims to provide an easy-to-use, web-based solution that simplifies inventory management, increases operational efficiency, and reduces human error.

Our goal is to create a system that:
- Automates inventory tracking and management.
- Provides real-time alerts for low stock levels.
- Allows for user-friendly interactions for both admins and staff.
- Ensures data accuracy with a simple user interface.

The system can be integrated with external APIs to enable features like **inventory syncing** across multiple locations or sales channels.

---

## **Product Backlog**

### **1️⃣ User Authentication & Role Management**
1. **User Login & Authentication**  
   - **User Story:** As a **user**, I want to **log in securely** so that **I can access my assigned features based on my role**.  
   - **Criteria of Satisfaction:**  
     - Users must authenticate with employee ID & password.  
     - Role-based access must be enforced (Admin, Manager, Employee).

2. **Role-Based Access Control**  
   - **User Story:** As an **admin**, I want to **assign roles (Admin, Manager, Employee)** so that **users have the correct permissions**.  
   - **Criteria of Satisfaction:**  
     - Admin can create new users and assign roles.  
     - Role-specific permissions are enforced at the API level.

3. **Password Reset**  
   - **User Story:** As a **user**, I want to **reset my password** so that **I can regain access if I forget it**.  
   - **Criteria of Satisfaction:**  
     - A "Forgot Password" feature must be available.  
     - Users receive reset instructions via email.

---

### **2️⃣ Product & Inventory Management**
4. **Add New Product**  
   - **User Story:** As a **manager**, I want to **add new products with details (name, category, SKU, stock quantity, supplier)** so that **I can track inventory accurately**.  
   - **Criteria of Satisfaction:**  
     - Product form must have required fields.  
     - Successful addition updates the inventory database.

5. **Edit Product Details**  
   - **User Story:** As an **employee**, I want to **edit product details** so that **I can update stock levels when needed**.  
   - **Criteria of Satisfaction:**  
     - Product data can be modified only by authorized roles.  
     - The update is reflected in real-time.

6. **Delete Product**  
   - **User Story:** As a **manager**, I want to **delete discontinued products** so that **the system only shows relevant inventory**.  
   - **Criteria of Satisfaction:**  
     - Products marked as deleted must be removed from the active list.  
     - Only managers and admins can perform this action.

7. **Search & Filter Products**  
   - **User Story:** As an **employee**, I want to **search for a product by name, SKU, or category** so that **I can quickly find items**.  
   - **Criteria of Satisfaction:**  
     - Search must return results dynamically.  
     - Filter options must include category, stock levels, and supplier.

---

### **3️⃣ Stock Alerts & Notifications**
8. **Low-Stock Alerts**  
   - **User Story:** As a **manager**, I want to **receive low-stock alerts** so that **I can restock products before they run out**.  
   - **Criteria of Satisfaction:**  
     - System triggers an alert when stock falls below a set threshold.  
     - Alert appears on the dashboard and via email.

9. **Real-Time Stock Updates**  
   - **User Story:** As an **employee**, I want to **see live stock updates** so that **I know when to restock or adjust sales**.  
   - **Criteria of Satisfaction:**  
     - Stock changes must reflect instantly in the UI.  
     - No manual page refresh required.

---

### **4️⃣ Supplier & Purchase Order Management**
10. **Manage Suppliers**  
   - **User Story:** As an **admin**, I want to **add and manage suppliers** so that **I can track where inventory is sourced from**.  
   - **Criteria of Satisfaction:**  
     - Supplier details must be stored in the system.  
     - Each product must be linked to a supplier.

11. **Generate Purchase Orders**  
   - **User Story:** As a **manager**, I want to **generate and send purchase orders** so that **suppliers receive restock requests**.  
   - **Criteria of Satisfaction:**  
     - Purchase order must include product details and quantity.  
     - Orders can be marked as pending, completed, or canceled.

12. **Track Incoming Shipments**  
   - **User Story:** As a **warehouse manager**, I want to **track incoming shipments** so that **I can update inventory when products arrive**.  
   - **Criteria of Satisfaction:**  
     - Shipments must be linked to purchase orders.  
     - Managers can mark items as "Received" to update stock levels.

---

### **5️⃣ Warehouse Location & Tracking**
13. **Assign Warehouse Locations**  
   - **User Story:** As an **employee**, I want to **assign products to warehouse sections (aisle, shelf, bin)** so that **items can be found easily**.  
   - **Criteria of Satisfaction:**  
     - Products must have a designated location in the warehouse.  
     - Locations should be searchable and editable.

14. **Search Product Location**  
   - **User Story:** As an **employee**, I want to **search for a product's location in the warehouse** so that **I can quickly retrieve it**.  
   - **Criteria of Satisfaction:**  
     - Search must return the aisle and shelf location.  
     - Results update dynamically as stock moves.

---

### **6️⃣ Reports & Data Visualization**
15. **Generate Sales Reports**  
   - **User Story:** As an **admin**, I want to **generate sales reports** so that **I can analyze stock turnover trends**.  
   - **Criteria of Satisfaction:**  
     - Report includes sold products, revenue, and stock changes.  
     - Can be exported as **CSV/PDF**.

16. **View Inventory Trends**  
   - **User Story:** As a **manager**, I want to **view inventory trends** so that **I can see which products are frequently running out**.  
   - **Criteria of Satisfaction:**  
     - Dashboard displays top-selling products and slow-moving stock.  
     - Visualized using **Chart.js** or **D3.js**.

17. **Export Inventory Data**  
   - **User Story:** As a **store owner**, I want to **export inventory data as a CSV/PDF** so that **I can share it with stakeholders**.  
   - **Criteria of Satisfaction:**  
     - Export feature is available on the reports page.  
     - Users can filter what data to include in the report.

---

### **7️⃣ User Dashboard & UI Enhancements**
18. **Dashboard Overview**  
   - **User Story:** As an admin, I want to view a dashboard with key inventory stats so that I can quickly assess stock levels and order activity.  
   - **Criteria of Satisfaction:**  
     - The dashboard displays total stock, low-stock alerts, and pending orders.

19. **Multi-Warehouse Support**  
   - **User Story:** As an **admin**, I want to **support multiple warehouses** so that **I can track inventory across different locations**.  
   - **Criteria of Satisfaction:**  
     - Products must be assigned to a warehouse location.  
     - Admins can transfer stock between warehouses.

20. **Dark Mode & UI Customization**  
   - **User Story:** As a user, I want to switch to dark mode so that I can reduce eye strain while using the system.  
   - **Criteria of Satisfaction:**  
     - A toggle button enables dark mode.

---

## **Competition Analysis**

### **Existing Products**

1. **[Shopify POS](https://www.shopify.com/pos)**  
   Shopify POS is a point-of-sale solution designed for small businesses, particularly those running physical retail stores.

2. **[Odoo](https://www.odoo.com)**  
   An open-source business management tool for businesses of all sizes, often used by mid-sized and large businesses.

3. **[Zoho Inventory](https://www.zoho.com/inventory)**  
   A cloud-based inventory tool primarily for small and medium-sized businesses.
   

---

## **How Our Product Stands Out**

Our product focuses on simplicity and affordability for small businesses. While other tools cater to larger or growing businesses, SmartStock is designed to be user-friendly and provide essential features without the complexity or expense.

---

## **Definition of Done (DoD)**

The following checklist ensures that features meet the standards and criteria for being considered "done":

### **Feature Implementation:**
- Fully implemented with client flow and criteria.
- Integrates with RBAC and maintains data consistency.
- Code adheres to best practices.

### **Testing:**
- Unit and integration tests pass.
- Manual testing confirms business requirements and user expectations.

### **Review:**
- Code reviewed and approved by at least one team member.
- Performance and scalability evaluated.

### **Documentation:**
- Code is documented for maintainability.
- API and user guides updated.
- Database regulations and permissions are clear.

### **Client’s Criteria:**
- All criteria met.
- Feature approved and deployed successfully.

---

### **Getting Started**
To get started with the **SmartStock** system, clone the repository

