const express = require('express');
const { body } = require('express-validator');
const {
  createBooking,
  cancelBooking,
  modifyBooking,
  getMyBookings,
  getFinalBookings
} = require('../controllers/bookingController');
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimitMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');

const router = express.Router();

router.post(
  '/',
  authLimiter,
  authMiddleware,
  [
    body('vehicle_id').isInt({ min: 1 }),
    body('start_date').isISO8601(),
    body('end_date').isISO8601()
  ],
  validationMiddleware,
  createBooking
);

router.patch(
  '/:bookingId/cancel',
  authLimiter,
  authMiddleware,
  [body('reason').optional().trim().isLength({ min: 3, max: 255 })],
  validationMiddleware,
  cancelBooking
);

router.patch(
  '/:bookingId/modify',
  authLimiter,
  authMiddleware,
  [
    body('new_start_date').isISO8601(),
    body('new_end_date').isISO8601(),
    body('reason').optional().trim().isLength({ min: 3, max: 255 })
  ],
  validationMiddleware,
  modifyBooking
);

router.get('/my', authLimiter, authMiddleware, getMyBookings);
router.get('/final', authLimiter, authMiddleware, requireRole('admin'), getFinalBookings);

module.exports = router;
