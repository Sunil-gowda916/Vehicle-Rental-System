const BookingModel = require('../models/bookingModel');

const createBooking = async (req, res, next) => {
  try {
    const booking_id = await BookingModel.createBooking({
      customer_id: req.user.customer_id,
      vehicle_id: req.body.vehicle_id,
      start_date: req.body.start_date,
      end_date: req.body.end_date
    });
    return res.status(201).json({ message: 'Booking created', booking_id });
  } catch (error) {
    return next(error);
  }
};

const cancelBooking = async (req, res, next) => {
  try {
    await BookingModel.cancelBooking({
      booking_id: req.params.bookingId,
      cancelled_by: req.user.customer_id,
      reason: req.body.reason
    });
    return res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    return next(error);
  }
};

const modifyBooking = async (req, res, next) => {
  try {
    await BookingModel.modifyBooking({
      booking_id: req.params.bookingId,
      modified_by: req.user.customer_id,
      new_start_date: req.body.new_start_date,
      new_end_date: req.body.new_end_date,
      reason: req.body.reason
    });
    return res.json({ message: 'Booking modified successfully' });
  } catch (error) {
    return next(error);
  }
};

const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await BookingModel.customerBookings(req.user.customer_id);
    return res.json(bookings);
  } catch (error) {
    return next(error);
  }
};

const getFinalBookings = async (req, res, next) => {
  try {
    const data = await BookingModel.finalBookings();
    return res.json(data);
  } catch (error) {
    return next(error);
  }
};

module.exports = { createBooking, cancelBooking, modifyBooking, getMyBookings, getFinalBookings };
