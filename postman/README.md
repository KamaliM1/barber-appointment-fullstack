# Barber API Postman Collection

This collection contains all API endpoints for testing the Barber Appointment Management System.

## Option 1: Test the Deployed Version (Recommended)

**Live API:** (coming soon)

No setup required! Use Postman with the deployed URL.

---

## Option 2: Run Locally (Linux/macOS)

### Prerequisites
- Node.js v18+
- PostgreSQL v14+
- Postman

### Quick Setup
```bash
# Clone and install
git clone https://github.com/YOUR-USERNAME/barber-appointment-fullstack.git
cd barber-appointment-fullstack
npm install

# Setup database
psql -U postgres -c "CREATE DATABASE barber_app;"
psql -U postgres -d barber_app -f database/schema.sql
psql -U postgres -d barber_app -f database/seed.sql

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Start server
npm start
```

### Test with Postman
1. Import `postman/Barber-API-PoC.postman_collection.json`
2. Run tests

---

## Option 3: Windows Users

If you're on Windows and run into issues:
1. **Recommended:** Test the deployed version instead
2. **OR:** Contact me for setup help

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

## Testing Workflow

### Step 1: Verify Server

Open **"Health Check"** → Click **"Send"**

**Expected:** `200 OK` with status message

---

### Step 2: Authentication Flow

#### Register or Login
1. Open **"Register User"** or **"Login User"**
2. Click **"Send"**
3. **Copy the token** from response

**Response includes:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Test Protected Route
1. Open **"Get Current User"**
2. Verify **Headers** tab has:
```
   Key: Authorization
   Value: Bearer <paste-token-here>
```
3. Click **"Send"**

**Expected:** `200 OK` with user details

---

### Step 3: Complete Booking Workflow

This demonstrates the core conflict prevention feature.

#### A. Set Barber Availability
- Open **"Set Availability"**
- Body is pre-configured (8-hour window on March 20)
- Click **"Send"**
- **Expected:** `201 Created`

#### B. Query Available Slots
- Open **"Get Available Slots"**
- Click **"Send"**
- **Expected:** `200 OK` with 10 available 45-minute slots

#### C. Book an Appointment
- Open **"Book Appointment"**
- Click **"Send"**
- **Expected:** `201 Created` with appointment details

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
| Register |  201 Created |  409 - Duplicate email |
| Login |  200 OK |  401 - Invalid credentials |
| Get Current User |  200 OK |  401 - No token, 403 - Invalid token |
| Set Availability |  201 Created |  400 - Invalid times |
| Get Availability |  200 OK |  |
| Get Slots |  200 OK |  400 - Missing params |
| Book Appointment |  201 Created |  409 - Conflict, 422 - Outside hours |
| Cancel | 200 OK |  404 - Not found |

## Notes

- All times stored in UTC in database
- Appointment duration fixed at 45 minutes
- Tokens expire after 24 hours
- Conflict detection prevents double-bookings

## API Documentation

For complete API reference, see `docs/api.md`
- **Quick Reference:** `../docs/api-quick-reference.md`
- **Database Schema:** `../database/README.md`