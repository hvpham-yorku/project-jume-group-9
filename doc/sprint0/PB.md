# 📦 Product Backlog - Inventory Management System



## **1️⃣ Home Page Overview**  
1. **Dynamic Home Dashboard Overview**  
- **User Story:** As a user, I can view an overview of my organization’s recent activity, stock updates, and order fulfillment trends directly from the home page for quick decision-making.  
- **Criteria of Satisfaction:**  
  - The home page should dynamically reflect the latest activity from the current organization.
  - Recent actions (e.g., new orders, low-stock alerts) are listed clearly in the **Activity Feed**.
  - An **Inventory Snapshot** section shows product statuses (in stock, low, out of stock).
  - A **Welcome message** appears on first login with organization context (name, location).
  - If the org has no data yet, the page displays helpful **empty states** instead of broken UI.
  - All displayed data must follow RLS and only show what's allowed for the logged-in user.
  - The home page loads instantly without requiring manual refresh or navigation.
 
## **2️⃣ Analytics**
2. **Inventory & Order Insights**
- **User Story:** As a user, I want quick visual insights into customer-held inventory, order statuses, and product lifecycle to make better decisions.
- **Criteria of Satisfaction:**
  - A table shows **inventory held by each customer** with total quantities.
  - A **pie chart** shows the distribution of order statuses (`fulfilled`, `pending`, `cancelled`).
  - A **chart** shows product status breakdown (`active`, `draft`, `archived`).
  - Data must be scoped to the current organization (RLS protected).
  - If no data exists, helpful empty states must be shown.
  - All charts load fast and reflect real-time data.


## **3️⃣ User Authentication & Role Management**
3. **User Login & Authentication**  
   - **User Story:** As a user, I want to log in securely so that I can access my permitted features based on my role. 
   - **Criteria of Satisfaction:**  
     - Users can sign-in and sign-up using OAuth and sign-out.
     - Role-based access must be enforced (Admin, Manager, Employee) on each warehouse dashboard. 

4. **Role-Based Access Control**  
   - **User Story:** As an **admin**, I want to **assign roles (Admin, Manager, Employee)** so that **users have the correct permissions**.  
   - **Criteria of Satisfaction:**  
     - Admin can assign roles (only three types: Admin, Manager, Employee).
     - Employees can view inventory but cannot modify it at all.

---

## **4️⃣ Product & Inventory Management**
5. **View Inventory List**
   - **User Story:** As an **employee**, I want to view a list of products so that I can check stock availability.
   - **Criteria of Satisfaction:**  
     - Displays a list of products (Name, SKU, Stock Level, Category).
     - Employees cannot modify products (View-Only).

6. **Search Products**  
   - **User Story:** As an **employee**, I want to view a list of products so that I can check stock availability.  
   - **Criteria of Satisfaction:**  
     - Displays the searched products (Name, SKU, Stock Level, Category).
     - Full detail of the named products but be pulled up. 

7. **Add New Product**  
   - **User Story:** As a admin/manager, I want to add new products so that inventory is accurate.
   - **Criteria of Satisfaction:**  
     - Admin/managers can add new products (Name, SKU, Stock Count).

8. **Edit Product Details**  
   - **User Story:** As a admin/manager, I want to edit product details so that the inventory stays updated.
   - **Criteria of Satisfaction:**  
     - Admin/managers can edit product details (Stock count, Name, Category).
       
9. **Delete Products**
   - **User Story:** As a admin/manager, I want to delete discontinued products so that the system only shows relevant inventory.
   - **Criteria of Satisfaction:**
     - Products marked as deleted must be removed from the active list.
     - Only managers and admins can perform this action.
    

---

## **5️⃣ Stock Alerts & Notifications**
10. **Low-Stock Alerts**  
   - **User Story:** As a admin/manager/employee, I want to receive low-stock alerts so that I (admin/manager) can restock products before they run out.
   - **Criteria of Satisfaction:**  
     - System triggers an alert when stock falls below a set threshold.  
     - Alert appears on the dashboard.  

11. **Manually Update Stock Levels**
   - **User Story:** As an admin/manager, I want to update stock levels manually so that I can keep inventory accurate. 
   - **Criteria of Satisfaction:**  
     - Admin/managers can increase or decrease stock counts as products are received or moved. 

---

## **6️⃣ Customer Management**
12. **View Customer List**  
   - **User Story:** As a admin/manager, I want to view a list of customer so that I can track where inventory comes from.
   - **Criteria of Satisfaction:**  
     - A list of customers with Name and Contact Information is displayed.

13. **Add New Customer**  
   - **User Story:** As an admin/manager, I want to add new customer so that I can manage business relationships.
   - **Criteria of Satisfaction:**  
     - Admin/manager can add customer details (Name, Contact Info).

14. **Edit Customer Information**  
   - **User Story:** As a admin/manager, I want to edit customer details so that I can keep information updated.  
   - **Criteria of Satisfaction:**  
     - Admin/managers can update customer contact information.

---

## **7️⃣ Inventory Tracking Reports**
15. **Generate Inventory Report**  
   - **User Story:** As an admin, I want to generate inventory movement reports so that I can track product flow in the warehouse.
   - **Criteria of Satisfaction:**  
     - Report includes total current inventory.

16. **Search Product**  
   - **User Story:** As an **admin/manager/employee**, I want to **search and filter for a product in the warehouse** so that **I can quickly retrieve it**.  
   - **Criteria of Satisfaction:**  
     - Search must return the product or products mentioned.

17. **Export Inventory Data**
    - **User Story:** As an admin/manager, I want to export inventory data so that I can store records offline.
    - **Criteria of Satisfaction:**
      - It is is available on every orders/products/customers activity other than reading.

---

## **8️⃣ User Dashboard & UI Enhancements**
18. **Dashboard Overview**  
   - **User Story:** As an admin/manager, I want to view a dashboard with key inventory stats so that I can quickly assess stock levels and order activity.  
   - **Criteria of Satisfaction:**  
     - The dashboard displays total stock, low-stock alerts, and recent updates.

19. **Dark Mode**  
   - **User Story:** As a user, I want to switch to dark mode so that I can reduce eye strain while using the system.
   - **Criteria of Satisfaction:**  
     - A toggle button enables dark mode. 

20. **Different UI look and access**  
   - **User Story:** As **Users** we'd like to only see what we are allowed to see as per our authorization level allows.
   - **Criteria of Satisfaction:**  
     - Some features are turned off and does not function for certain users
    
21. **Navigation Enhancements**
   - **User Story:** As a user, I want a clear and easy navigation system so that I can quickly move between features.
   - **Criteria of Satisfaction:**
     - Navigation sidebar is structured logically with key sections.
22. **Home Screen Role-Based Visibility**
   - **User Story:** As a user, I want to see only the dashboard widgets and data that match my assigned role (Admin, Manager, or Employee), so that I don’t access unauthorized features.
   - **Criteria of Satisfaction:**
      - Admins and Managers can view full dashboard (stock summary, orders, revenue, recent activity, analytics).
      - Employees can only view stock summary and recent activity, with restricted access to other dashboard features.
      - Sidebar and navigation dynamically adjust based on user role.
	   - Unauthorized sections should be hidden or disabled completely for non-privileged users.
     
## **9️⃣ UX**
23. **Switch From One Warehouse to an Entire different Warehouse (Multi-tenancy)**  
   - **User Story:** As a user, I can be from multiple warehouses and should be able to quickly swtich between warehouses and see the same dashboard for that warehouse inventory.
   - **Criteria of Satisfaction:**  
     - Users can successfully sign-out from their current warehouse and change from one warehouse to another with every features available across all of them.
    

## **🔟 Seeding and Testing**     
24. **Staging data for 2 different inventories**  
   - **User Story:** As a user, I can playaround and see the usage of my entire dashboard using fake data to test its capabilities.
   - **Criteria of Satisfaction:**  
     - Users can successfully play around with ordering, products, analytics and notification features with these databases.
     - Orders must have orderno, product id, fullfillment status, quantity
     - Products must have images, name, some quantity for testing
     - Customers must have name, address, email, phone no, and location
     - At least 2 Organizations (meaning 2 warehouses)

