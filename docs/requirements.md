*Functional Requirements* 
(Ordered from most to least important)

Essential - 
1. Appointment Scheduling
    - Description: System will allow customers to view available appointment time slots and book appointments in available time slots. The system will also prevent double booking of the same time slot and allow customers to cancel and/or reschedule appointments to an available time slot.

2. Barber/Admin Management
    - Description: System will allow the barber to clearly define available working hours, view all scheduled appointments and also block off time slots/dates where they are unavailable.

3. User Authentication & Accounts
    - Description: System allows users to register an account using email and password, log in and out securely and authenticate users through the use of JSON Web Tokens (JWT).

4. User Roles & Authorization
    - Description: System supports two user roles: customer and admin(barber). It will also restrict administrative functions strictly to users with admin privileges.

5. Data Management
    - Description: System will stores users, appointments and availability data in a relational database (PostgreSQL). The system will also retrieve and update appointment data through RESTful API endpoints.


Non-Essential / Not Currently in Scope (Implementation TBD)
1. Payments
2. SMS or Email Notifications
3. Public Deployment
4. Support for Multiple-Barbers
5. Mobile Application

------------------------------------------------------------

*Non-Functional Requirements*

Essential - 
1. Security
    - Description: System will make passwords are securely hashed before storage and no sensitive data will be exposed.

2. Performance
    - Description: System will respond to API requests within a reasonable time and will efficiently handle time slot availability checks.

3. Reliability & Data Integrity:
    - Description: System will ensure consistency within appointment data when creating or modifying bookings and will also handle any unexpected errors.

4. Maintainability
    - Description: The systems backend must include clear documentation for system setup and API endpoints to ensure a quality modular architecture.

5. Usability:
    - Description: Frontend will have a simple and clear interface for both customer and admin experience. There will also be useful error messages to help troubleshoot and offset unexpected errors to grant users a helpful and seamless experience.

6. Deployment & Environment
    - Description: System will be runnable in a local development environment and will be deployable to a private environment if needed. Whether or not it will be publicly published is to be determined.

------------------------------------------------------------

*MVP Scope*

Core Problem: Allow customers to book appointments without double-booking and allow the barber to manage availability.

Required Capabilities:
1. User registration and login (JWT-based)
2. Customer and admin roles
3. Viewing available appointment slots
4. Ability to book, cancel and reschedule appointments
5. Conflict-free scheduling logic
6. PostgreSQL used for data persistence
7. RESTful API with error handling
8. Local or private deployment

Out of MVP Scope:
1. Payment processing
2. Notifications
3. Public production deployment
4. Multi-barber or multi-location support
5. Mobile application
6. Advanced analytics