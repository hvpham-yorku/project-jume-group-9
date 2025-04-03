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

## **Tuesday [26/03/2025] - Sprint #2 Standup #3**

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

## **Thursday [28/03/2025] - Sprint #2 Standup #4**

_**1. What did you work on since the last standup?**_  
- Customers Table finalized with sorting, filtering, and region-based grouping.
- Edit and delete capabilities added for customer records, along with validations.
- Tested access control enforcement based on role permissions across modules.

_**2. What do you commit to next?**_  
- Begin documentation refinement (README, system design, retrospective).
- Implement global error handling components and confirm accessibility baseline.

_**3. When do you think you'll be done?**_  
- All functional components locked by March 30, docs and polishing to follow.

_**4. Do you have any blockers?**_  
- None. Project is tracking well with remaining deliverables scheduled.

---

## **Friday [29/03/2025] - Sprint #2 Standup #5**

_**1. What did you work on since the last standup?**_  
- Final styling pass applied across Home, Orders, Products, and Customers.
- Documentation artifacts initiated and assigned (README, burndown, retrospective).
- Sidebar profile photo logic enhanced to support placeholder fallback.

_**2. What do you commit to next?**_  
- Wrap up documentation and confirm PR linkage to all Trello stories.
- Conduct dry-run of sprint demo and finalize video script.

_**3. When do you think you'll be done?**_  
- Docs, final test pass, and demo prep by April 2.

_**4. Do you have any blockers?**_  
- None. Final tasks are procedural and on track.
