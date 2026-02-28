const express = require('express');
const router = express.Router();
const { validateBooking } = require('../middleware/validator');
const {
    getAvailableSlots,
    bookAppointment,
    cancelAppointment
} = require('../controllers/appointmentController');

// Get /api/appointments/available ? date=YYYY-MM-DD & barberId = 1
router.get('/available', getAvailableSlots);

// POST /api/appointments/book
router.post('/book', validateBooking, bookAppointment);

// DELETE /api/appointments/:id/cancel
router.delete('/:id/cancel', cancelAppointment);

module.exports = router;