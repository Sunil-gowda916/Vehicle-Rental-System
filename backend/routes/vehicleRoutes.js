const express = require('express');
const { body } = require('express-validator');
const {
  getAvailableVehicles,
  getAllVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle
} = require('../controllers/vehicleController');
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimitMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');

const router = express.Router();

router.get('/available', getAvailableVehicles);
router.get('/', authLimiter, authMiddleware, requireRole('admin'), getAllVehicles);

const vehicleValidators = [
  body('vehicle_name').trim().notEmpty(),
  body('vehicle_number').trim().notEmpty(),
  body('category').isIn(['Hatchback', 'Sedan', 'SUV']),
  body('transmission').isIn(['Manual', 'Automatic']),
  body('rental_price_per_day').isFloat({ gt: 0 }),
  body('seating_capacity').isInt({ min: 2, max: 12 }),
  body('branch_id').isInt({ min: 1 }),
  body('availability_status').optional().isIn(['Available', 'Booked'])
];

router.post('/', authLimiter, authMiddleware, requireRole('admin'), vehicleValidators, validationMiddleware, createVehicle);
router.put('/:vehicleId', authLimiter, authMiddleware, requireRole('admin'), vehicleValidators, validationMiddleware, updateVehicle);
router.delete('/:vehicleId', authLimiter, authMiddleware, requireRole('admin'), deleteVehicle);

module.exports = router;
