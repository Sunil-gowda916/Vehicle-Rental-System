const VehicleModel = require('../models/vehicleModel');

const getAvailableVehicles = async (req, res, next) => {
  try {
    const vehicles = await VehicleModel.getAvailable(req.query);
    return res.json(vehicles);
  } catch (error) {
    return next(error);
  }
};

const getAllVehicles = async (req, res, next) => {
  try {
    const vehicles = await VehicleModel.getAll();
    return res.json(vehicles);
  } catch (error) {
    return next(error);
  }
};

const createVehicle = async (req, res, next) => {
  try {
    const id = await VehicleModel.create(req.body);
    return res.status(201).json({ message: 'Vehicle added', vehicle_id: id });
  } catch (error) {
    return next(error);
  }
};

const updateVehicle = async (req, res, next) => {
  try {
    const count = await VehicleModel.update(req.params.vehicleId, req.body);
    if (!count) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    return res.json({ message: 'Vehicle updated' });
  } catch (error) {
    return next(error);
  }
};

const deleteVehicle = async (req, res, next) => {
  try {
    const count = await VehicleModel.remove(req.params.vehicleId);
    if (!count) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    return res.json({ message: 'Vehicle deleted' });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getAvailableVehicles, getAllVehicles, createVehicle, updateVehicle, deleteVehicle };
