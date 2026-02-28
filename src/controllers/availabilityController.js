const {query} = require('../config/database');

/**
 * Set availability for a barber
 */

const setAvailability = async (req, res, next) => {
    try {
        const { barberId, startTime, endTime } = req.body;

        const insertQuery = 
        ` INSERT INTO availability_blocks (barber_id, start_time, end_time)
          VALUES ($1, $2, $3)
          RETURNING id, barber_id, start_time, end_time, created_at
        `;

        const result = await query (insertQuery, [barberId, startTime, endTime]);

        res.status(201).json({
            success: true,
            message: 'Availability set successfully',
            availability: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get availability for a barber
 */

const getAvailability = async (req, res, next) => {
    try {
        const { barberId } = req.params;

        const selectQuery = 
        ` SELECT id, barber_id, start_time, end_time, created_at
          FROM availability_blocks
          WHERE barber_id = $1
          AND end_time > NOW()
          ORDER by start_time ASC
        `;

        const result = await query(selectQuery, [barberId]);

        res.json({
            barberId: parseInt(barberId),
            availabilityBlocks: result.rows
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    setAvailability,
    getAvailability
};