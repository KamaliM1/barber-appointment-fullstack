/**
 * Validation middleware for different request types
 */

// Validate appointment booking request
const validateBooking = (req, res, next) => {
    const {barberId, customerId, date, start_time} = req.body;

    // Check the required fields
    if(!barberId || !customerId || !date || !start_time) {
        return res.status(400).json({
            error: true,
            message: 'Missing required fields',
            required: ['barberId', 'customerId', 'date', 'start_time']
        });
    }

    // Validate that barberId is a number
    if(isNaN(parseInt(barberId))){
        return res.status(400).json ({
            error:  true,
            message: 'barberId must be a number'
        });
    }

    // Validate that customerId is a number
    if(isNaN(parseInt(customerId))){
        return res.status(400).json ({
            error: true,
            message: 'customerId must be a number'
        });
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if(!dateRegex.test(date)) {
        return res.status(400).json ({
            error: true,
            message: 'Invalid date format. Use YYYY-MM-DD'
        });
    }

    // Validate time format (HH:MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(start_time)) {
        return res.status(400).json({
            error: true,
            message: 'Invalid time format. Use HH:MM (24-hour format)'
        });
    }

    // Validate date is not in the past
    const appointmentDate = new Date(`${date}T${start_time}`);
    if (appointmentDate < new Date()) {
        return res.status(400).json({
            error: true,
            message: 'Cannot book appointments in the past'
        });
    }

    // All validations are passed
    next();
};

// Validate availability setting request
const validateAvailability = (req, res, next) => {
    const {barberId, start_time, endTime} = req.body;

    if(!barberId, !start_time, !endTime) {
        return res.status(400).json ({
            error: true,
            message: 'Missing required fields',
            required: ['barberId', 'start_time', 'endTime']
        });
    }

    // Validate times
    const start = new Date(start_time);
    const end = new Date(endTime);

    if(isNaN(start.getTime() | isNaN(end.getTime()))) {
        return res.status(400).json ({
            error: true,
            message: 'Invalid date/time format'
        });
    }

    if(end <= start) {
        return res.status(400).json({
            error: true,
            message: 'End time must be after start time'
        });
    }

    next();
};

module.exports = {
    validateBooking, 
    validateAvailability
};