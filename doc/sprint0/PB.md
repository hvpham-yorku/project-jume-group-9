# 📦 Product Backlog - Inventory Management System

## **1️⃣ User Authentication & Role Management**
1. **User Login & Authentication**  
   - **User Story:** As a user, I want to log in securely so that I can access my permitted features based on my role. 
   - **Criteria of Satisfaction:**  
     - Users can sign-in and sign-up using OAuth and sign-out.
     - Role-based access must be enforced (Admin, Manager, Employee) on each warehouse dashboard. 

2. **Role-Based Access Control**  
   - **User Story:** As an **admin**, I want to **assign roles (Admin, Manager, Employee)** so that **users have the correct permissions**.  
   - **Criteria of Satisfaction:**  
     - Admin can assign roles (only three types: Admin, Manager, Employee).
     - Employees can view inventory but cannot modify it at all.

---

## **2️⃣ Product & Inventory Management**
3. **View Inventory List**
   - **User Story:** As an **employee**, I want to view a list of products so that I can check stock availability.
   - **Criteria of Satisfaction:**  
     - Displays a list of products (Name, SKU, Stock Level, Category).
     - Employees cannot modify products (View-Only).

4. **Search Products**  
   - **User Story:** As an **employee**, I want to view a list of products so that I can check stock availability.  
   - **Criteria of Satisfaction:**  
     - Displays the searched products (Name, SKU, Stock Level, Category).
     - Full detail of the named products but be pulled up. 

5. **Add New Product**  
   - **User Story:** As a admin/manager, I want to add new products so that inventory is accurate.
   - **Criteria of Satisfaction:**  
     - Admin/managers can add new products (Name, SKU, Stock Count).

6. **Edit Product Details**  
   - **User Story:** As a admin/manager, I want to edit product details so that the inventory stays updated.
   - **Criteria of Satisfaction:**  
     - Admin/managers can edit product details (Stock count, Name, Category).
       
7. **Delete Products**
   - **User Story:** As a admin/manager, I want to delete discontinued products so that the system only shows relevant inventory.
   - **Criteria of Satisfaction:**
     - Products marked as deleted must be removed from the active list.
     - Only managers and admins can perform this action.
    

---

## **3️⃣ Stock Alerts & Notifications**
8. **Low-Stock Alerts**  
   - **User Story:** As a admin/manager/employee, I want to receive low-stock alerts so that I (admin/manager) can restock products before they run out.
   - **Criteria of Satisfaction:**  
     - System triggers an alert when stock falls below a set threshold.  
     - Alert appears on the dashboard.  

9. **Manually Update Stock Levels**
   - **User Story:** As an admin/manager, I want to update stock levels manually so that I can keep inventory accurate. 
   - **Criteria of Satisfaction:**  
     - Admin/managers can increase or decrease stock counts as products are received or moved. 

---

## **4️⃣ Customer Management**
10. **View Customer List**  
   - **User Story:** As a admin/manager, I want to view a list of customer so that I can track where inventory comes from.
   - **Criteria of Satisfaction:**  
     - A list of customers with Name and Contact Information is displayed.

11. **Add New Customer**  
   - **User Story:** As an admin/manager, I want to add new customer so that I can manage business relationships.
   - **Criteria of Satisfaction:**  
     - Admin/manager can add customer details (Name, Contact Info).

12. **Edit Customer Information**  
   - **User Story:** As a admin/manager, I want to edit customer details so that I can keep information updated.  
   - **Criteria of Satisfaction:**  
     - Admin/managers can update customer contact information.

---

## **5️⃣ Inventory Tracking Reports**
13. **Generate Inventory Report**  
   - **User Story:** As an admin, I want to generate inventory movement reports so that I can track product flow in the warehouse.
   - **Criteria of Satisfaction:**  
     - Report includes total current inventory.

14. **Search Product**  
   - **User Story:** As an **admin/manager/employee**, I want to **search and filter for a product in the warehouse** so that **I can quickly retrieve it**.  
   - **Criteria of Satisfaction:**  
     - Search must return the product or products mentioned.

15. **Export Inventory Data**
    - **User Story:** As an admin/manager, I want to export inventory data so that I can store records offline.
    - **Criteria of Satisfaction:**
      - It is is available on every orders/products/customers activity other than reading.

---

## **6️⃣ User Dashboard & UI Enhancements**
16. **Dashboard Overview**  
   - **User Story:** As an admin/manager, I want to view a dashboard with key inventory stats so that I can quickly assess stock levels and order activity.  
   - **Criteria of Satisfaction:**  
     - The dashboard displays total stock, low-stock alerts, and recent updates.

17. **Dark Mode**  
   - **User Story:** As a user, I want to switch to dark mode so that I can reduce eye strain while using the system.
   - **Criteria of Satisfaction:**  
     - A toggle button enables dark mode. 

18. **Different UI look and access**  
   - **User Story:** As **Users** we'd like to only see what we are allowed to see as per our authorization level allows.
   - **Criteria of Satisfaction:**  
     - Some features are turned off and does not function for certain users
    
19. **Navigation Enhancements**
   - **User Story:** As a user, I want a clear and easy navigation system so that I can quickly move between features.
   - **Criteria of Satisfaction:**
     - Navigation sidebar is structured logically with key sections.
    
     
## **7️⃣ UX**
20. **Switch From One Warehouse to an Entire different Warehouse (Multi-tenancy)**  
   - **User Story:** As a user, I can be from multiple warehouses and should be able to quickly swtich between warehouses and see the same dashboard for that warehouse inventory.
   - **Criteria of Satisfaction:**  
     - Users can successfully sign-out from their current warehouse and change from one warehouse to another with every features available across all of them.
    

## **8️⃣ Seeding and Testing**     
21. **Staging data for 2 different inventories**  
   - **User Story:** As a user, I can playaround and see the usage of my entire dashboard using fake data to test its capabilities.
   - **Criteria of Satisfaction:**  
     - Users can successfully play around with ordering, products, analytics and notification features with these databases.
     - Orders must have orderno, product id, fullfillment status, quantity
     - Products must have images, name, some quantity for testing
     - Customers must have name, address, email, phone no, and location
     - At least 2 Organizations (meaning 2 warehouses)
