const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { authenticate } = require('../middleware/auth');

// GET /api/rooms
router.get('/', roomController.getAllRooms);

// GET /api/rooms/:id
router.get('/:id', roomController.getRoomById);

// GET /api/rooms/:id/availability?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
router.get('/:id/availability', authenticate, roomController.checkAvailability);

module.exports = router;