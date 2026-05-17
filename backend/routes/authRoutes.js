const express = require('express');
const { body } = require('express-validator');
const { register, login } = require('../controllers/authController');
const validationMiddleware = require('../middleware/validationMiddleware');

const router = express.Router();

router.post(
  '/register',
  [
    body('full_name').trim().notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('phone').optional().isLength({ min: 10, max: 15 })
  ],
  validationMiddleware,
  register
);

router.post('/login', [body('email').isEmail(), body('password').notEmpty()], validationMiddleware, login);

module.exports = router;
