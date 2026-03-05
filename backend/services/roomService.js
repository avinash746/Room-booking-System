const { pool } = require('../config/db');

/**
 * Get all rooms
 */
const getAllRooms = async () => {
  const [rows] = await pool.query(
    `SELECT id, name, description, price_per_night, capacity, image_url, amenities, created_at
     FROM rooms
     ORDER BY price_per_night ASC`
  );
  return rows;
};

/**
 * Get single room by ID
 */
const getRoomById = async (roomId) => {
  const [rows] = await pool.query(
    `SELECT id, name, description, price_per_night, capacity, image_url, amenities, created_at
     FROM rooms WHERE id = ? LIMIT 1`,
    [roomId]
  );
  if (rows.length === 0) {
    const err = new Error('Room not found.');
    err.status = 404;
    throw err;
  }
  return rows[0];
};

/**
 * Check if a room is available for a date range.
 * Returns true if available, false if conflicting booking exists.
 */
const checkAvailability = async (roomId, startDate, endDate, excludeBookingId = null) => {
  // Overlap condition: existing.start_date < new.end_date AND existing.end_date > new.start_date
  let query = `
    SELECT COUNT(*) AS cnt
    FROM bookings
    WHERE room_id = ?
      AND status = 'confirmed'
      AND start_date < ?
      AND end_date > ?
  `;
  const params = [roomId, endDate, startDate];

  if (excludeBookingId) {
    query += ' AND id != ?';
    params.push(excludeBookingId);
  }

  const [rows] = await pool.query(query, params);
  return rows[0].cnt === 0; // true = available
};

/**
 * Get booked dates for a room (for frontend calendar display)
 */
const getBookedDates = async (roomId) => {
  const [rows] = await pool.query(
    `SELECT start_date, end_date
     FROM bookings
     WHERE room_id = ? AND status = 'confirmed'
     ORDER BY start_date ASC`,
    [roomId]
  );
  return rows;
};

module.exports = { getAllRooms, getRoomById, checkAvailability, getBookedDates };