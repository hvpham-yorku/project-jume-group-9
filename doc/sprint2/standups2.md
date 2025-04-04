# 📌 Standup Meetings - Sprint 2

## **Thursday [21/03/2025] - Sprint #2 Standup #1**

_**1. What did you work on since the last standup?**_  
- Established database schema and seeded data for two distinct warehouses.
- Completed authentication flow with Supabase including multi-role redirects (Admin, Manager, Employee).
- UI skeletons for Home and Sidebar components initialized and reviewed.

_**2. What do you commit to next?**_  
- Begin integrating real-time Supabase data into the Home dashboard widgets.
- Continue polishing the sidebar and profile routing logic.

_**3. When do you think you'll be done?**_  
- Initial integration with Supabase and functional UI routing by March 23.

_**4. Do you have any blockers?**_  
- Awaiting finalized Supabase structure for accurate field mappings.

---

## **Sunday [24/03/2025] - Sprint #2 Standup #2**

_**1. What did you work on since the last standup?**_  
- Supabase field conventions were finalized and shared with the team.
- Home Page dashboard now displaying real-time data for orders and products.
- Created and tested the Recent Activity system with Supabase triggers.

_**2. What do you commit to next?**_  
- Proceed with Orders CRUD logic including creation, status update, and notification toggle.
- Scaffold Product Management UI with preliminary data fetching and filtering logic.

_**3. When do you think you'll be done?**_  
- Orders and base Product features to be functional by March 26.

_**4. Do you have any blockers?**_  
- Activity log for update actions not displaying as expected—undergoing further testing.

---

## **Tuesday [25/03/2025] - Sprint #2 Standup #3**

_**1. What did you work on since the last standup?**_  
- Orders module now supports full CRUD, including state transitions and customer notification handling.
- Product module implemented with real-time data sync, column filtering, and permission-based visibility.
- Fixed inconsistencies in Recent Activity log behavior and improved timestamp formatting.

_**2. What do you commit to next?**_  
- Build the Customer Table interface and connect backend endpoints.
- Enable update/delete functionality within the customer record view.

_**3. When do you think you'll be done?**_  
- Customer features complete and styled by March 28.

_**4. Do you have any blockers?**_  
- Minor issues in Supabase cascade deletions (being mitigated with explicit delete handlers).

---

## **Wednesday [26/03/2025] - Sprint #2 Standup #4 (Backend Issue!!)**

_**1. What did you work on since the last standup?**_  
- Worked and learned how to use Supabase and the new local Docker migration database system.
The team found out that 
- Finalized integration of feature logic across Products, Orders, Customers, and Profile.
- Fixed bugs related to multi-tenancy filtering and UI state mismatches.
- Team-wide debugging and testing support across all implemented features.


_**2. What do you commit to next?**_  
- **Max** will take of the backend and supabase infrastructure, such as:
Finalize PostgreSQL schema, seeding the data for debugging the tables
Enabling multi-tenancy and Sadman Table infrastructure.
- **Erfan** and **Jay** will continue development on backend-independent components while waiting for Max deliveries, such as:
  - UI structure for create/edit modals using ShadCN
  - Progress on Profile Form and Sidebar polish
#### *since Max is well familiar with ShadCN and the tables infrastructure, he might help us with the implementations here and there* ####
- **Usman** will start working on the much needed report on the Activities Dashboard
- Ensure all Trello stories are linked to working features and branches.
- **Max** will sync with each feature group individually to ensure database alignment per feature requirement.

_**3. When do you think you'll be done?**_  
- All final documentation and demo recording will be completed by April 3 (Sprint deadline)

_**4. Reason for change of pace?**_
**<br>Problem:<br>** 
The initial plan was to distribute workload based on major feature sets, such as the Customers section, Products and Orders section, with each team member responsible for a separate feature. However, all these features required deep integration with table.sadmn components, which in turn depend heavily on backend functionalities, including data fetching, triggers, and security logic.
Given our tech stack uses Supabase, the backend implementation requires careful database design, PostgreSQL migrations, and setting up RLS policies and triggers. Since Max has the most experience in these areas, especially with PostgreSQL and Supabase-specific configurations, it made sense to pivot our approach.
**<br>Solution:<br>**
Max is now fully focused on building and refining the database and backend logic to ensure a solid foundation for the app. In the meantime, the rest of the team will continue development based on the most recent stable backend version from the previous sprint.
Team members are focusing on backend-independent tasks, such as:
- UI logic and layouts for **Create/Update Orders**, **Create/Update Products**, and **Create/Update Customers pages** using the ShadCN UI library.
- Implementing parts of the **Analytics**, **Homepage**, **Sidebar UI**, and **User Profile Editor** sections. Since the majority of the database related tasks for profile and UI and sidebar was done from Sprint 1.


_**5. Do you have any blockers?**_  
- The main blocker is that several key features (Customers, Products, Orders, Notifications) rely on a stable and fully set-up backend, including Supabase schemas, triggers, and RLS policies. Currently, backend development is being refactored by Max, so the rest of the team is temporarily blocked from integrating and testing full end-to-end functionality for these features. Until the backend is finalized, we're focusing on backend-independent tasks like UI layout, ShadCn component integration, and logic scaffolding for create/edit flows.
---

## **Wednesday [02/04/2025] - Sprint #2 Standup #5 (Backend Sync + Sprint Wrap-Up)**

_**1. What did you work on since the last standup?**_
- Attended several full-team sync hosted by Max covering backend infrastructure. He also helped many of the team members with their blocks or understandings of his awesome back-end. He also gave us the _data index file that worked basically was the Supabase schema, and Sadman Table logic.
- Walked through role-based access control and database architecture.
- Finalized integration of feature logic across Products, Orders, Customers, and Profile.
- Fixed bugs related to multi-tenancy filtering and UI state mismatches.
- Team-wide debugging and testing support across all implemented features.


_**2. What do you commit to next?**_  
- Final documentation polish (README, Planning).
- Sprint demo preparation and video recording.
- Ensure all Trello stories are linked to working features and branches and are checked off.


_**3. When do you think you'll be done?**_  
- All final documentation and demo recording will be completed by April 3 (Sprint deadline).

_**4. Do you have any blockers?**_  
- No blockers. Backend is stable, and all features are aligned with expected schema and logic.
