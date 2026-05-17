const BranchModel = require('../models/branchModel');
const BookingModel = require('../models/bookingModel');

const getBranches = async (req, res, next) => {
  try {
    const data = await BranchModel.getAll();
    return res.json(data);
  } catch (error) {
    return next(error);
  }
};

const createBranch = async (req, res, next) => {
  try {
    const branch_id = await BranchModel.create(req.body);
    return res.status(201).json({ message: 'Branch created', branch_id });
  } catch (error) {
    return next(error);
  }
};

const updateBranch = async (req, res, next) => {
  try {
    const count = await BranchModel.update(req.params.branchId, req.body);
    if (!count) {
      return res.status(404).json({ message: 'Branch not found' });
    }
    return res.json({ message: 'Branch updated' });
  } catch (error) {
    return next(error);
  }
};

const deleteBranch = async (req, res, next) => {
  try {
    const count = await BranchModel.remove(req.params.branchId);
    if (!count) {
      return res.status(404).json({ message: 'Branch not found' });
    }
    return res.json({ message: 'Branch deleted' });
  } catch (error) {
    return next(error);
  }
};

const dashboard = async (req, res, next) => {
  try {
    const overview = await BookingModel.adminOverview();
    return res.json(overview);
  } catch (error) {
    return next(error);
  }
};

module.exports = { getBranches, createBranch, updateBranch, deleteBranch, dashboard };
