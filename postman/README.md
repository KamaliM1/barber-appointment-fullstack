# Barber API Postman Collection

This collection contains all API endpoints for testing the Barber Appointment Management System.

## Import Instructions

1. Open Postman Desktop or Postman Web
2. Click "Import" button (top left)
3. Select `Barber-API-PoC.postman_collection.json`
4. Collection appears in sidebar under "Collections"

## Collection Structure
```
Barber API - PoC (11 requests)
  Health & Status (3)
    ├─ Health Check
    ├─ API Info
    └─ Test Database Connection
  
  Authentication (3)
    ├─ Register User
    ├─ Login User
    └─ Get Current User (Protected)
  
  Availability (2)
    ├─ Set Availability
    └─ Get Barber Availability
  
  Appointments (3)
    ├─ Get Available Slots
    ├─ Book Appointment
    └─ Cancel Appointment
```

## Prerequisites

- Server running on `http://localhost:5000`
- PostgreSQL database with seed data
- Node.js dependencies installed (`npm install`)

## Quick Start

### 1. Start the Server
```bash
cd ~/repos/barber-appointment-fullstack
npm start
```

### 2. Test Health Check
- Open "Health Check" request
- Click "Send"
- Expect: 200 OK with status message

### 3. Authentication Flow
- **Register User** → Save the returned token
- **Login User** → Save the returned token
- **Get Current User** → Add token to Authorization header
  - Header: `Authorization: Bearer <your-token>`

### 4. Complete Booking Workflow

**Step 1: Set Availability**
```json
POST /api/availability/set
{
  "barberId": 1,
  "startTime": "2026-03-20T09:00:00-05:00",
  "endTime": "2026-03-20T17:00:00-05:00"
}
```
Expected: 201 Created

**Step 2: Query Available Slots**
```
GET /api/appointments/available?date=2026-03-20&barberId=1
```
Expected: 200 OK with array of 10 slots

**Step 3: Book an Appointment**
```json
POST /api/appointments/book
{
  "barberId": 1,
  "customerId": 2,
  "date": "2026-03-20",
  "startTime": "10:00"
}
```
Expected: 201 Created

**Step 4: Test Conflict Prevention**
- Send the same booking request again
- Expected: **409 Conflict** - "This time slot is already booked"

## Environment Variables

If you want to use different servers, create an environment:

1. Click "Environments" (left sidebar)
2. Create "Local Development"
3. Add variable:
   - `base_url`: `http://localhost:5000`
4. Use in requests: `{{base_url}}/api/auth/login`

## Common Issues

### "Cannot POST /api/appointments/book%0A"
- **Problem:** Newline character in URL
- **Fix:** Remove trailing characters from URL field

### "req.body is undefined"
- **Problem:** Body not set to JSON
- **Fix:** Body tab → raw → Dropdown: "JSON"

### "Invalid time value"
- **Problem:** Date format incorrect
- **Fix:** Use YYYY-MM-DD (e.g., "2026-03-20")

### 401 Unauthorized on protected routes
- **Problem:** Missing or invalid token
- **Fix:** Add to Headers:
  - Key: `Authorization`
  - Value: `Bearer <token-from-login>`

## Test Coverage

| Endpoint | Happy Path | Error Cases |
|----------|-----------|-------------|
| Register | ✓ 201 Created | ✓ 409 Duplicate email |
| Login | ✓ 200 OK | ✓ 401 Invalid credentials |
| Get User | ✓ 200 OK | ✓ 401 No token, 403 Invalid token |
| Set Availability | ✓ 201 Created | ✓ 400 Invalid times |
| Get Availability | ✓ 200 OK | - |
| Get Slots | ✓ 200 OK | ✓ 400 Missing params |
| Book Appointment | ✓ 201 Created | ✓ 409 Conflict, 422 Outside hours |
| Cancel | ✓ 200 OK | ✓ 404 Not found |

## Notes

- All times stored in UTC in database
- Appointment duration fixed at 45 minutes
- Tokens expire after 24 hours
- Conflict detection prevents double-bookings

## API Documentation

For complete API reference, see `docs/api.md`

## Support

Issues? Check server logs or verify database connection with:
```bash
psql barber_app -c "SELECT * FROM users;"
```