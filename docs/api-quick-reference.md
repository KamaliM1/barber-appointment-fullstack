# API Quick Reference

## Endpoints

### Health & Status
- `GET /health` - Health check
- `GET /api` - API info
- `GET /api/test-db` - Database test

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
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Unprocessable Entity |
| 500 | Server Error |

## Common Request Bodies

**Book Appointment:**
```json
{
  "barberId": 1,
  "customerId": 2,
  "date": "2026-03-17",
  "startTime": "10:00"
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