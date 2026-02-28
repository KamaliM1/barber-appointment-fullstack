const { query } = require('../config/database');

/**
 * Get available appointment slots for a given date and barber
 */

const getAvailableSlots = async (req, res, next) => {
    try {
        const { date, barberId } = req.query;

        // Validate required parameters
        if (!date || !barberId) {
            return res.status(400).json ({
                error: true,
                message: 'Missing required parameters: date and barberId'
            });
        }

        // Get availability blocks for the barber on this date
        const availabilityQuery = 
        ` SELECT id, start_time, end_time
          FROM availability_blocks
          WHERE barber_id = $1
          AND DATE(start_time) = $2
        `;

        const availability = await query (availabilityQuery, [barberId, date]);

        if (availability.rows.length === 0) {
            return res.json({
                date,
                barberId: parseInt(barberId),
                availableSlots: [],
                message: 'No availability for this date'
            });
        }

        // Get existing appointments for this barber on this date
        const appointmentsQuery = 
        ` SELECT start_time, end_time
          FROM appointments
          WHERE barber_id = $1
          AND DATE(start_time) = $2
          AND status = 'booked'
        `;

        const appointments = await query (appointmentsQuery, [barberId, date]);

        // Generate 45-minute slots from availability books
        const slots = [];
        availability.rows.forEach(block => {
            const start = new Date(block.start_time);
            const end = new Date(block.end_time);

            let current = new Date(start);

            while (current < end) {
                const slotEnd = new Date(current.getTime() + 45 * 60000);

                if(slotEnd <= end) {
                    slots.push({
                        start: current.toISOString(),
                        end: slotEnd.toISOString()
                    });
                }

                current = slotEnd;
            }
        });

        // Filter out booked slots
        const bookedSlots = appointments.rows.map(apt => ({
            start: new Date(apt.start_time).toISOString(),
            end: new Date(apt.end_time).toISOString()
        }));

        const availableSlots = slots.filter(slot => {
            return !bookedSlots.some(booked =>
                slot.start === booked.start
            );
        });

        res.json({
            date,
            barberId: parseInt(barberId),
            totalSlots: slots.length,
            bookedSlots: bookedSlots.length,
            availableSlots: availableSlots
        });
    } catch (error) {
        next(error);
    }
};


/**
 * Book a new appointment
 */

const bookAppointment = async (req, res, next) => {
    try {
        const { barberId, customerId, date, start_time } = req.body;

        // Calculate end time (45 minutes after start)
        const start = new Date (`${date}T${start_time}`);
        const end = new Date(start.getTime() + 45 * 60000);

        // Check if barber has availability for this specific time
        const availabilityCheck = 
        `SELECT id FROM availability_blocks
         WHERE barber_id = $1
         AND start_time <= $2
         AND end_time >= $3
        `;

        const hasAvailability = await query(availabilityCheck, [
            barberId,
            start.toISOString(),
            end.toISOString()
        ]);

        if(hasAvailability.rows.length === 0){
            return res.status(422).json({
                error: true,
                message: 'Barber is not available at this time'
            });
        }

        // Check for conflicts
        const conflictCheck = 
        ` SELECT id FROM appointments
          WHERE barber_id = $1
          AND start_time < $2
          AND end_time > $3
          AND status = 'booked'
        `;

        const conflicts = await query(conflictCheck, [
            barberId,
            end.toISOString(),
            start.toISOString()
        ]);

        if (conflicts.rows.length > 0) {
            return res.status(409).json ({
                error: true,
                message: 'This time slot is already booked'
            });
        }

        // Create the appointment
        const insertQuery = 
        ` INSERT INTO appointments
          (barber_id, customer_id, start_time, end_time, status)
          VALUES ($1, $2, $3, $4, 'booked')
          RETURNING id, barber_id, customer_id, start_time, end_time, status, created_at
        `;

        const result = await query (insertQuery, [
            barberId,
            customerId,
            start.toISOString(),
            end.toISOString()
        ]);

        res.status(201).json({
            success: true,
            message: 'Appointment booked successfully',
            appointment: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Cancel an appointment
 */

const cancelAppointment = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check if appointment exists
        const checkQuery = 
        ` SELECT id, status FROM appointments
          WHERE id = $1
        `;

        const existing = await query(checkQuery, [id]);

        if(existing.rows.length === 0) {
            return res.status(404).json ({
                error: true,
                message: 'Appointment not found'
            });
        }

        // Update status to cancelled
        const updatedQuery = 
        ` UPDATE appointments
          SET status = 'cancelled', updated_at = NOW()
          WHERE id = $1
          RETURNING id, status, updated_at
        `;

        const result = await query(updatedQuery, [id]);

        res.json({
            success: true,
            message: 'Appointment cancelled successfully',
            appointment: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAvailableSlots,
    bookAppointment,
    cancelAppointment
};