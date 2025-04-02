# 📌 Standup Meetings - Sprint 2

## **Thursday [21/03/2025] - Sprint #2 Standup #1**

_**1. What did you work on since the last standup?**_  
- Set up database seeding for two organizations with demo data.  
- Finalized authentication logic with Supabase and role-based redirects.  
- Built the structure of the Home Page, including placeholder dashboard cards.

_**2. What do you commit to next?**_  
- Begin live integration of order and product data into Home dashboard.  
- Complete sidebar profile section with routing to the profile page.

_**3. When do you think you'll be done?**_  
- Home Page live data and sidebar polish should be ready by March 23.

_**4. Do you have any blockers?**_  
- Noticed some mismatch in seeded data vs expected schema (resolved with team sync).

---

## **Sunday [24/03/2025] - Sprint #2 Standup #2**

_**1. What did you work on since the last standup?**_  
- Connected the dashboard UI to live Supabase data (orders, products).  
- Built Recent Activity logging system and integrated order event updates.  
- Implemented fulfillment status logic for Orders Page.

_**2. What do you commit to next?**_  
- Add create order modal and checkbox for “Notified” flag.  
- Start basic layout of Products Page with filtering capability.

_**3. When do you think you'll be done?**_  
- Orders full CRUD and basic product filtering by March 26.

_**4. Do you have any blockers?**_  
- Activity logs for “edit” actions not propagating correctly — will debug event hooks.

---

## **Tuesday [26/03/2025] - Sprint #2 Standup #3**

_**1. What did you work on since the last standup?**_  
- Finished Orders Page (create, edit, notify toggle, fulfillment dropdown).  
- Product table working with real data and client-side filtering.  
- Activity logs now capture insert + update events across both modules.

_**2. What do you commit to next?**_  
- Add analytics card with Pie Chart using Recharts and Supabase data.  
- Implement customer CRUD UI and connect to customers table.

_**3. When do you think you'll be done?**_  
- Analytics integration + customer logic by March 29.

_**4. Do you have any blockers?**_  
- Small issue formatting timestamps in activity feed (working on UI formatters).

---

## **Friday [29/03/2025] - Sprint #2 Standup #4**

_**1. What did you work on since the last standup?**_  
- Integrated analytics Pie Chart (pending vs fulfilled orders).  
- Added weather widget and applied final UI polish to Home Page.  
- Profile picture added to sidebar with placeholder for users without image.

_**2. What do you commit to next?**_  
- Finalize README, clean unused components, and prepare sprint demo video.  
- Cross-check Trello tickets with PRs and resolve final design inconsistencies.

_**3. When do you think you'll be done?**_  
- Docs + walkthrough prep by April 2.

_**4. Do you have any blockers?**_  
- None, all components are tested and rendering as expected.
