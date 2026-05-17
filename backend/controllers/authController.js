const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const CustomerModel = require('../models/customerModel');

const signToken = (user) => jwt.sign(
  { customer_id: user.customer_id, email: user.email, role: user.role },
  process.env.JWT_SECRET || 'dev_secret',
  { expiresIn: '1d' }
);

const register = async (req, res, next) => {
  try {
    const { full_name, email, password, phone } = req.body;

    const existing = await CustomerModel.findByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const customer_id = await CustomerModel.createCustomer({
      full_name,
      email,
      password_hash,
      phone,
      role: 'customer'
    });
    const customer = await CustomerModel.findById(customer_id);

    return res.status(201).json({
      message: 'Registration successful',
      token: signToken(customer),
      user: customer
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await CustomerModel.findByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const safeUser = await CustomerModel.findById(user.customer_id);
    return res.json({
      message: 'Login successful',
      token: signToken(safeUser),
      user: safeUser
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { register, login };
