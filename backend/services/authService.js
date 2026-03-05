const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

const SALT_ROUNDS = 12;

/**
 * Register a new user
 */
const register = async ({ name, email, password }) => {
  // Check if email is already taken
  const [existing] = await pool.query(
    'SELECT id FROM users WHERE email = ? LIMIT 1',
    [email]
  );
  if (existing.length > 0) {
    const err = new Error('Email is already registered.');
    err.status = 409;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const [result] = await pool.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashedPassword]
  );

  const token = generateToken({ id: result.insertId, email, name });

  return {
    token,
    user: { id: result.insertId, name, email },
  };
};

/**
 * Login an existing user
 */
const login = async ({ email, password }) => {
  const [rows] = await pool.query(
    'SELECT id, name, email, password FROM users WHERE email = ? LIMIT 1',
    [email]
  );

  if (rows.length === 0) {
    const err = new Error('Invalid email or password.');
    err.status = 401;
    throw err;
  }

  const user = rows[0];
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    const err = new Error('Invalid email or password.');
    err.status = 401;
    throw err;
  }

  const token = generateToken({ id: user.id, email: user.email, name: user.name });

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email },
  };
};

/**
 * Get authenticated user's profile
 */
const getProfile = async (userId) => {
  const [rows] = await pool.query(
    'SELECT id, name, email, created_at FROM users WHERE id = ? LIMIT 1',
    [userId]
  );
  if (rows.length === 0) {
    const err = new Error('User not found.');
    err.status = 404;
    throw err;
  }
  return rows[0];
};

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

module.exports = { register, login, getProfile };