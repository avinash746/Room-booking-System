const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticate } = require('../middleware/auth');

// All booking routes require authentication
router.use(authenticate);

// POST /api/bookings
router.post('/', bookingController.createBooking);

// GET /api/bookings/my
router.get('/my', bookingController.getUserBookings);

// PATCH /api/bookings/:id/cancel
router.patch('/:id/cancel', bookingController.cancelBooking);

module.exports = router;