const authService = require('../services/authService');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'name, email, and password are required.',
      });
    }

    if (typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Name must be at least 2 characters.',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters.',
      });
    }

    const result = await authService.register({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'email and password are required.',
      });
    }

    const result = await authService.login({
      email: email.toLowerCase().trim(),
      password,
    });

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getProfile };