const bookingService = require('../services/bookingService');

const createBooking = async (req, res, next) => {
  try {
    const { roomId, startDate, endDate } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!roomId || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'roomId, startDate, and endDate are required.',
      });
    }

    // Validate date formats
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

    // Prevent past date bookings
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (start < today) {
      return res.status(400).json({
        success: false,
        message: 'startDate cannot be in the past.',
      });
    }

    const booking = await bookingService.createBooking({
      userId,
      roomId: parseInt(roomId),
      startDate,
      endDate,
    });

    res.status(201).json({
      success: true,
      message: 'Room booked successfully!',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await bookingService.getUserBookings(req.user.id);
    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

const cancelBooking = async (req, res, next) => {
  try {
    const bookingId = parseInt(req.params.id);
    const userId = req.user.id;

    const result = await bookingService.cancelBooking(bookingId, userId);

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createBooking, getUserBookings, cancelBooking };