Create a Supabase database schema for a workforce management SaaS application with three tiers (Client Free, Solo $40/month, Business $70/month). The database should support:

**Core Tables:**

1. **Users/Employees** \- Store user profiles with fields for: name, email, password\_hash, role/title, tier level, contact info, certifications, availability, profile photos/videos/text posts, product links, custom branding settings, and account\_status  
2. **Businesses/Organizations** \- Store business profiles with: business\_name, tier (free/solo/business), employee\_count, employee\_limit, logo, app\_icon, color\_palette (primary/secondary), custom\_domain, font\_selection, SMTP\_settings, SMS\_settings, industry\_type, terms\_of\_service, whitelabel\_enabled, and public\_profile\_enabled  
3. **Schedules** \- Track shifts with: employee\_id, business\_id, start\_time, end\_time, status (approved/pending/denied), location/store\_id, shift\_type, created\_by, approved\_by, and notes  
4. **Appointment\_Requests** \- **NEW** For service professionals (hair stylists, real estate agents, lawyers, etc.) with: client\_id, service\_provider\_id, requested\_date, requested\_time, service\_type, status (pending/approved/denied), denial\_reason, priority\_level, notes, and auto\_reminder\_sent  
5. **Shift\_Swaps** \- Track employee shift trade requests with: requesting\_employee\_id, target\_employee\_id, shift\_id, status (pending/approved/denied), manager\_approval\_required, and approval\_timestamp  
6. **Clients/Customers** \- CRM data including: name, email, phone, customer\_lifetime\_value, service\_history, ratings, comments, testimonials with photos, tags/preferences, last\_contact\_date, and assigned\_to (employee\_id)  
7. **Services** \- Service catalog with: service\_name, description, price, duration, category, assigned\_specialists, SOP\_documentation, billing\_status, is\_active, and requires\_approval  
8. **Analytics\_Events** \- Track metrics with: business\_id, store\_id, event\_type (sale/service/clock\_in), metric\_value, revenue, labor\_cost, timestamp, and employee\_id for real-time dashboards  
9. **Certifications/Vault** \- Store employee certifications with: employee\_id, document\_type, custom\_label, document\_url, issue\_date, expiration\_date, verification\_status, issuing\_authority, and reminder\_sent  
10. **Ratings\_Reviews** \- Customer feedback with: client\_id, business\_id, employee\_id, rating\_score (1-5), comment, testimonial\_text, photo\_url, is\_public, and response\_from\_business  
11. **Bookings** \- Track service requests with: client\_id, service\_id, requested\_datetime, confirmed\_datetime, status (requested/confirmed/completed/cancelled), assigned\_employee\_id, payment\_status, and cancellation\_reason  
12. **Settings** \- Store customization preferences per business: notification\_preferences (email/sms/push), auto\_reminder\_intervals, branding\_colors, logo\_urls, feature\_toggles (services\_tab\_enabled, vault\_enabled, etc.), role\_permission\_mappings, and export\_preferences  
13. **Notifications** \- Track all system notifications: user\_id, notification\_type (shift\_reminder/appointment\_request/approval\_needed), message, read\_status, sent\_via (email/sms/push), and action\_url  
14. **Time\_Off\_Requests** \- Employee PTO tracking with: employee\_id, start\_date, end\_date, request\_type (vacation/sick/personal), status (pending/approved/denied), approved\_by, and denial\_reason  
15. **Locations/Stores** \- For multi-unit businesses: business\_id, store\_name, address, phone, manager\_id, operating\_hours, and is\_active  
16. **Product\_Links** \- For profile marketplace features: business\_id, product\_name, product\_url, description, image\_url, price, and is\_active  
17. **AI\_Analysis\_Log** \- Track AI-generated insights: business\_id, analysis\_type (CRM\_suggestion/efficiency\_report), analysis\_data (JSON), generated\_at, and viewed\_by

**Key Requirements:**

* Implement Row Level Security (RLS) policies based on user roles and tier levels  
* Support multi-location/multi-store data separation  
* Enable real-time subscriptions for live updates on schedules, analytics, and appointment requests  
* Create junction tables for many-to-many relationships (employees-services, employees-locations, employees-stores)  
* Include audit fields (created\_at, updated\_at, deleted\_at) on all tables for soft deletes  
* Set up foreign key relationships with proper cascading behavior  
* Add indexes on frequently queried fields (business\_id, employee\_id, status, timestamps)  
* Create database functions/triggers for: automatic reminder scheduling, approval workflows, and tier-based feature gating

**Approval Workflow Tables:**

* **Approval\_Queues** \- Central approval tracking: request\_type (appointment/shift\_swap/time\_off/schedule\_change), requester\_id, approver\_id, status, request\_data (JSON), priority, and due\_date

**Role-Based Access:**

* District Manager: full access across multiple stores  
* Store Manager: full access to their store, approval authority for appointments/schedules  
* Department Manager: limited to their department, can approve within scope  
* Associates: personal data only, can request appointments/shifts/time-off  
* Clients (Free Tier): browse profiles, request bookings, leave ratings

**Tier-Based Feature Access:**

* Free Tier: Client profile, browse businesses, ratings/reviews only  
* Solo Tier ($40): Up to 10 employees, schedule management, basic analytics, client CRM  
* Business Tier ($70): Up to 30 employees, Vault, AI analysis, full customization, whitelabel options

Make the schema scalable for businesses with 1-30 employees with future growth potential. Include proper constraints and validation rules.

