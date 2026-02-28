const express = require ('express');
const router = express.Router();
const { validateAvailability } = require('../middleware/validator');
const {
    setAvailability,
    getAvailability
} = require('../controllers/availabilityController');

// POST /api/availability/set
router.post('/set', validateAvailability, setAvailability);

// GET /api/availability/:barberId
router.get('/:barberId', getAvailability);

module.exports = router;