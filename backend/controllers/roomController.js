const roomService = require('../services/roomService');

const getAllRooms = async (req, res, next) => {
  try {
    const rooms = await roomService.getAllRooms();
    res.status(200).json({
      success: true,
      data: rooms,
    });
  } catch (error) {
    next(error);
  }
};

const getRoomById = async (req, res, next) => {
  try {
    const room = await roomService.getRoomById(parseInt(req.params.id));
    res.status(200).json({
      success: true,
      data: room,
    });
  } catch (error) {
    next(error);
  }
};

const checkAvailability = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const roomId = parseInt(req.params.id);

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'startDate and endDate query params are required.',
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Use YYYY-MM-DD.',
      });
    }

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: 'endDate must be after startDate.',
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (start < today) {
      return res.status(400).json({
        success: false,
        message: 'startDate cannot be in the past.',
      });
    }

    const isAvailable = await roomService.checkAvailability(roomId, startDate, endDate);
    const bookedDates = await roomService.getBookedDates(roomId);

    res.status(200).json({
      success: true,
      data: {
        available: isAvailable,
        room_id: roomId,
        start_date: startDate,
        end_date: endDate,
        booked_periods: bookedDates,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllRooms, getRoomById, checkAvailability };