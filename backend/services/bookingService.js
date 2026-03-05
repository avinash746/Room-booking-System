const { pool } = require('../config/db');
const { checkAvailability } = require('./roomService');

/**
 * Create a new booking using a database transaction.
 * Prevents overlapping bookings via row-level locking.
 */
const createBooking = async ({ userId, roomId, startDate, endDate }) => {
  // Validate date logic at service level (belt-and-suspenders on top of controller validation)
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (end <= start) {
    const err = new Error('end_date must be after start_date.');
    err.status = 400;
    throw err;
  }

  // Fetch room details (also validates room exists)
  const [roomRows] = await pool.query(
    'SELECT id, name, price_per_night FROM rooms WHERE id = ? LIMIT 1',
    [roomId]
  );
  if (roomRows.length === 0) {
    const err = new Error('Room not found.');
    err.status = 404;
    throw err;
  }
  const room = roomRows[0];

  // Calculate total price
  const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  const totalPrice = (nights * parseFloat(room.price_per_night)).toFixed(2);

  // --- Begin Transaction ---
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Lock all existing bookings for this room to prevent race conditions
    const [conflicting] = await connection.query(
      `SELECT id FROM bookings
       WHERE room_id = ?
         AND status = 'confirmed'
         AND start_date < ?
         AND end_date > ?
       FOR UPDATE`,
      [roomId, endDate, startDate]
    );

    if (conflicting.length > 0) {
      await connection.rollback();
      const err = new Error(
        'This room is already booked for the selected dates. Please choose different dates.'
      );
      err.status = 409;
      throw err;
    }

    // Insert the booking
    const [result] = await connection.query(
      `INSERT INTO bookings (user_id, room_id, start_date, end_date, total_price, status)
       VALUES (?, ?, ?, ?, ?, 'confirmed')`,
      [userId, roomId, startDate, endDate, totalPrice]
    );

    await connection.commit();

    // Return full booking details
    const [newBooking] = await connection.query(
      `SELECT b.id, b.start_date, b.end_date, b.total_price, b.status, b.created_at,
              r.id AS room_id, r.name AS room_name, r.price_per_night
       FROM bookings b
       JOIN rooms r ON r.id = b.room_id
       WHERE b.id = ?`,
      [result.insertId]
    );

    return newBooking[0];
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Get all bookings for a specific user
 */
const getUserBookings = async (userId) => {
  const [rows] = await pool.query(
    `SELECT b.id, b.start_date, b.end_date, b.total_price, b.status, b.created_at,
            r.id AS room_id, r.name AS room_name, r.price_per_night,
            r.image_url, r.capacity
     FROM bookings b
     JOIN rooms r ON r.id = b.room_id
     WHERE b.user_id = ?
     ORDER BY b.created_at DESC`,
    [userId]
  );
  return rows;
};

/**
 * Cancel a booking (only by the owner)
 */
const cancelBooking = async (bookingId, userId) => {
  const [rows] = await pool.query(
    'SELECT id, user_id, status, start_date FROM bookings WHERE id = ? LIMIT 1',
    [bookingId]
  );

  if (rows.length === 0) {
    const err = new Error('Booking not found.');
    err.status = 404;
    throw err;
  }

  const booking = rows[0];

  if (booking.user_id !== userId) {
    const err = new Error('You are not authorized to cancel this booking.');
    err.status = 403;
    throw err;
  }

  if (booking.status === 'cancelled') {
    const err = new Error('Booking is already cancelled.');
    err.status = 400;
    throw err;
  }

  // Prevent cancelling past bookings
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (new Date(booking.start_date) < today) {
    const err = new Error('Cannot cancel a booking that has already started or ended.');
    err.status = 400;
    throw err;
  }

  await pool.query(
    "UPDATE bookings SET status = 'cancelled' WHERE id = ?",
    [bookingId]
  );

  return { id: bookingId, status: 'cancelled' };
};

module.exports = { createBooking, getUserBookings, cancelBooking };