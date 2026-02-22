# Database Schema - Barber Appointment Management System

## Overview
PostgreSQL database for managing barber appointments with conflict-free scheduling.

## Current Phase
Proof of Concept - Weeks 1 to 3.

## Tables

### users
Stores both customers and barbers (role-based).
- `id`: an auto-incrementing primary key
- `email`: unique identifier for login
- `password_hash`: bcrypt hashed password
- `role`: either 'customer' or 'admin' (barber)
- `created_at`, `updated_at`: audit trail timestamps

### availability_blocks
Defines time windows for barber availability.
- `id`: primary key
- `barber_id`: foreign key to users table
- `start_time`, `end_time`: availability windows that are timezone aware

### appointments 
Individual 45-minute appointment slots.
- `id`: primary key
- `barber_id`: foreign key to users (the barber)
- `customer_id`: foreign key to users (the customer)
- `start_time`, `end_time`: exact time slot for appointment
- `status`: 'booked', 'cancelled', 'completed', 'no_show'

## Setup Instructions

### Create Database
```bash
sudo -u postgres createdb barber_app
```

### Apply Schema
```bash
sudo -u postgres psql barber_app -f database/schema.sql
```

### Load Sample Data (this is optional)
```bash
sudo -u postgres psql barber_app -f database/seed.sql
```

## Design Decisions

### Why TIMESTAMPTZ
All timestamps use `TIMESTAMPZ` (timestamps with timezone) to properly handle users in different timezones if necessary.

### Why Single Users Table?
Both customers and barbers are users with different roles. This simplifies authentication and can allow for the addition of future features as well.

### Why 45-Minute Fixed Duration?
This is a business requirement. All haircuts will take this specific amount of time to simplify scheduling logic. This duration can change with time given the more research I do on the average length each haircut will take.