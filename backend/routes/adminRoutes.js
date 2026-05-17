const express = require('express');
const { body } = require('express-validator');
const {
  getBranches,
  createBranch,
  updateBranch,
  deleteBranch,
  dashboard
} = require('../controllers/adminController');
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimitMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');

const router = express.Router();

router.use(authLimiter, authMiddleware, requireRole('admin'));

router.get('/dashboard', dashboard);
router.get('/branches', getBranches);
router.post(
  '/branches',
  [body('branch_name').trim().notEmpty(), body('city').trim().notEmpty(), body('address').trim().notEmpty()],
  validationMiddleware,
  createBranch
);
router.put(
  '/branches/:branchId',
  [body('branch_name').trim().notEmpty(), body('city').trim().notEmpty(), body('address').trim().notEmpty()],
  validationMiddleware,
  updateBranch
);
router.delete('/branches/:branchId', deleteBranch);

module.exports = router;
