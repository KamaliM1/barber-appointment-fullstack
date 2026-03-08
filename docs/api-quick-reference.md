# API Quick Reference

## Endpoints

### Health & Status
- `GET /health` - Health check
- `GET /api` - API info
- `GET /api/test-db` - Database test

### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Authenticate user
- `GET /api/auth/me` - Get current user

### Appointments
- `GET /api/appointments/available?date=YYYY-MM-DD&barberId=1` - Get slots
- `POST /api/appointments/book` - Book appointment
- `DELETE /api/appointments/:id/cancel` - Cancel appointment

### Availability (Admin)
- `POST /api/availability/set` - Set working hours
- `GET /api/availability/:barberId` - Get schedule

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Valid token but insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource conflict |
| 422 | Unprocessable Entity - Violation of business rule |
| 500 | Server Error - Internal server error|

## Common Request Bodies

**Register User:**
```json
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "role": "customer"
}
```

**Login:**
```json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Set Availability:**
```json
{
  "barberId": 1,
  "startTime": "2026-03-17T09:00:00-05:00",
  "endTime": "2026-03-17T17:00:00-05:00"
}
```

**Book Appointment:**
```json
{
  "barberId": 1,
  "customerId": 2,
  "date": "2026-03-17",
  "startTime": "10:00"
}
```

## Quick Testing Sequence

### 1. Register a User

### 2. Login

### 3. Get Current User

### 4. Set Availability

### 5. Get Available Slots

### 6. Book Appointment