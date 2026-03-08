# Barber Appointment Management System

Full-stack appointment scheduling system for a local barbershop, featuring user authentication, conflict-free booking, and an administrative dashboard. Built with a focus on backend API design, database modeling, and real-world scheduling logic.

## Overview

This project is a full-stack but primarily back-end focused appointment management system that allows customers to book, cancel and reschedule appointments while enabling the barber to manage availability and view appointments.

The system is designed to prevent-double booking, enforce fixed 45-minute time slots, enable users seamless authorization and authentication through JWT enforced logins, and provide a clean API surface.

## Key Features

- User registration and authentication (JWT-based)
- Role-based access (customer and admin)
- Fixed 45-minute appointment booking
- Conflict-free booking enforced at the database level
- Barber-defined availability windows
- RESTful API design

## Tech Stack

### Backend
- Node.js
- Express
- PostgreSQL
- JWT Authentication

### Frontend
- React

### Testing
- Postman
- Jest
- Supertest

## High-Level Architecture

Layered Architecture:

Client -> API Routes -> Controllers -> Services -> Repositories -> Database

- Routes define the API surface
- Controllers handle HTTP request/response logic
- Services contain business rules (scheduling and conflict detection)
- Repositories manage database access

## Quick Start

### Prerequisites
Node.js 18+, PostgreSQL 14+, Postman

### Setup
```bash
# Clone and install
git clone https://github.com/YOUR-USERNAME/barber-appointment-fullstack.git
cd barber-appointment-fullstack
npm install

# Setup environment
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# Create database and run migrations
psql -U postgres -c "CREATE DATABASE barber_app;"
psql -U postgres -d barber_app -f database/schema.sql
psql -U postgres -d barber_app -f database/seed.sql

# Start server
npm start
```

Server runs at `http://localhost:5000`

### Test API
1. Import `postman/Barber-API-PoC.postman_collection.json` into Postman
2. See `postman/README.md` for testing guide
3. Health check: `GET http://localhost:5000/health`


## API Endpoints

**Authentication:**
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Get JWT token
- `GET /api/auth/me` - Get current user (protected)

**Appointments:**
- `GET /api/appointments/available` - Query time slots
- `POST /api/appointments/book` - Book appointment
- `DELETE /api/appointments/:id/cancel` - Cancel appointment

**Availability:**
- `POST /api/availability/set` - Set barber hours (admin)
- `GET /api/availability/:barberId` - Get schedule

**Health:**
- `GET /health`, `GET /api`, `GET /api/test-db`

**Quick Reference API Documentation** `docs/api-quick-reference.md`
**Full API Documentation:** `docs/api.md`


## Documentation

- **API Reference:** `docs/api.md` - Complete endpoint documentation
- **Quick Reference:** `docs/api-quick-reference.md` - One-page lookup
- **Testing Guide:** `postman/README.md` - Postman setup and workflow
- **Database Schema:** `database/README.md` - Tables and relationships

## Key Design Decisions

**Conflict Detection:** SQL query prevents overlapping appointments  
**Security:** bcrypt password hashing + JWT (24h expiry) + parameterized queries  
**Timezone:** UTC storage (TIMESTAMPTZ), ISO 8601 API format  
**Duration:** Fixed 45-minute appointmentss

## Next Steps
- Initializing React frontend
- Ensuring protected routes based on role of user
- Customer booking interface
- Admin Dashboard
- Deployment


## Author

Kamali McKenzie
CISC.4900 - Spring 2026