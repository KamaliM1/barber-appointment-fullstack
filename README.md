# Barber Appointment Management System

Full-stack appointment scheduling system for a local barbershop, featuring user authentication, conflict-free booking, and an administrative dashboard. Built with a focus on backend API design, database modeling, and real-world scheduling logic.

## Overview

This project is a primarily back-end focused appointment management system that allows customers to book, cancel and reschedule appointments while enabling the barber to manage availability and view appointments.

The system is designed to prevent-double booking, enforce fixed 45-minute time slots, enable users seamless authorization and authentication through JWT enforced logins, and provide a clean API surface.

## Features

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
- Jest
- Supertest

## High-Level Architecture

Layered Architecture:

Client -> API Routes -> Controllers -> Services -> Repositories -> Database

- Routes define the API surface
- Controllers handle HTTP request/response logic
- Services contain business rules (scheduling and conflict detection)
- Repositories manage database access