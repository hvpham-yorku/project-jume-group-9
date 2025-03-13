# 📦 Product Backlog - Inventory Management System

## **1️⃣ User Authentication & Role Management**
1. **User Login & Authentication**  
   - **User Story:** As a user, I want to log in securely so that I can access my assigned features based on my role. 
   - **Criteria of Satisfaction:**  
     - Users must authenticate with Employee ID & Password.  
     - Role-based access must be enforced (Admin, Manager, Employee). 

2. **Role-Based Access Control**  
   - **User Story:** As an **admin**, I want to **assign roles (Admin, Manager, Employee)** so that **users have the correct permissions**.  
   - **Criteria of Satisfaction:**  
     - Admin can assign roles (only three types: Admin, Manager, Employee).
     - Employees can view inventory but cannot modify it.

3. **Password Reset**  
   - **User Story:** As a **user**, I want to **reset my password** so that **I can regain access if I forget it**.  
   - **Criteria of Satisfaction:**  
     - A "Forgot Password" feature must be available.  
     - Users receive reset instructions via email.  

---

## **2️⃣ Product & Inventory Management**
4. **View Inventory List**
   - **User Story:** As an **employee**, I want to view a list of products so that I can check stock availability.
   - **Criteria of Satisfaction:**  
     - Displays a list of products (Name, SKU, Stock Level, Category).
     - Employees cannot modify products (View-Only).

5. **Search Products**  
   - **User Story:** As an **employee**, I want to view a list of products so that I can check stock availability.  
   - **Criteria of Satisfaction:**  
     - Displays the searched products (Name, SKU, Stock Level, Category).
     - Full detail of the named products but be pulled up. 

6. **Add New Product**  
   - **User Story:** As a manager, I want to add new products so that inventory is accurate.
   - **Criteria of Satisfaction:**  
     - Managers can add new products (Name, SKU, Stock Count).

7. **Edit Product Details**  
   - **User Story:** As a manager, I want to edit product details so that the inventory stays updated.
   - **Criteria of Satisfaction:**  
     - Managers can edit product details (Stock count, Name, Category).
8. **Delete Products**
   - **User Story:** As a manager, I want to delete discontinued products so that the system only shows relevant inventory.
   - **Criteria of Satisfaction:**
     - Products marked as deleted must be removed from the active list.
     - Only managers and admins can perform this action.

---

## **3️⃣ Stock Alerts & Notifications**
9. **Low-Stock Alerts**  
   - **User Story:** As a manager, I want to receive low-stock alerts so that I can restock products before they run out.
   - **Criteria of Satisfaction:**  
     - System triggers an alert when stock falls below a set threshold.  
     - Alert appears on the dashboard.  

10. **Manually Update Stock Levels**
   - **User Story:** As an employee, I want to update stock levels manually so that I can keep inventory accurate. 
   - **Criteria of Satisfaction:**  
     - Employees can increase or decrease stock counts as products are received or moved. 

---

## **4️⃣ Supplier Management**
11. **View Supplier List**  
   - **User Story:** As a manager, I want to view a list of suppliers so that I can track where inventory comes from.
   - **Criteria of Satisfaction:**  
     - A list of suppliers with Name and Contact Information is displayed.

12. **Add New Supplier**  
   - **User Story:** As an admin, I want to add new suppliers so that I can manage business relationships.
   - **Criteria of Satisfaction:**  
     - Admins can add supplier details (Name, Contact Info).

13. **Edit Supplier Information**  
   - **User Story:**  As a manager, I want to edit supplier details so that I can keep information updated.  
   - **Criteria of Satisfaction:**  
     - Managers can update supplier contact information.

---

## **5️⃣ Inventory Tracking Reports**
14. **Generate Inventory Reports**  
   - **User Story:** As an admin, I want to generate inventory movement reports so that I can track product flow in the warehouse.
   - **Criteria of Satisfaction:**  
     - Report includes stock added, stock removed, and total current inventory.
     - Can be exported as CSV/PDF. 

15. **Search Product Location**  
   - **User Story:** As an **employee**, I want to **search for a product's location in the warehouse** so that **I can quickly retrieve it**.  
   - **Criteria of Satisfaction:**  
     - Search must return the aisle and shelf location.

16. **Export Inventory Data**
    - **User Story:** As an admin, I want to export inventory data so that I can store records offline.
    - **Criteria of Satisfaction:**
      - Export feature is available on the reports page.

---

## **6️⃣ User Dashboard & UI Enhancements**
17. **Dashboard Overview**  
   - **User Story:** As an admin, I want to view a dashboard with key inventory stats so that I can quickly assess stock levels and order activity.  
   - **Criteria of Satisfaction:**  
     - The dashboard displays total stock, low-stock alerts, and recent updates.

18. **Dark Mode**  
   - **User Story:** As a user, I want to switch to dark mode so that I can reduce eye strain while using the system.
   - **Criteria of Satisfaction:**  
     - A toggle button enables dark mode. 

19. **Different UI look and access**  
   - **User Story:** As **Users** we'd like to only see what we are allowed to see as per our authorization level allows.
   - **Criteria of Satisfaction:**  
     - Some features are turned off and does not function for certain users
    
20. **Navigation Enhancements**
   - **User Story:** As a user, I want a clear and easy navigation system so that I can quickly move between features.
   - **Criteria of Satisfaction:**
     - Navigation sidebar is structured logically with key sections.

