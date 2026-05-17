const pool = require('../config/db');

class BookingModel {
  static async createBooking({ customer_id, vehicle_id, start_date, end_date }) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [vehicleRows] = await connection.query(
        'SELECT * FROM vehicles WHERE vehicle_id = ? FOR UPDATE',
        [vehicle_id]
      );
      const vehicle = vehicleRows[0];

      if (!vehicle || vehicle.availability_status !== 'Available') {
        const error = new Error('Vehicle is not available for booking');
        error.status = 400;
        throw error;
      }

      const [bookingResult] = await connection.query(
        `INSERT INTO bookings (customer_id, vehicle_id, start_date, end_date, booking_status)
         VALUES (?, ?, ?, ?, 'Active')`,
        [customer_id, vehicle_id, start_date, end_date]
      );

      await connection.query(
        "UPDATE vehicles SET availability_status = 'Booked' WHERE vehicle_id = ?",
        [vehicle_id]
      );

      await connection.query(
        `INSERT INTO final_bookings (booking_id, customer_id, vehicle_id, action_type, remarks)
         VALUES (?, ?, ?, 'BOOKED', 'Booking created successfully')`,
        [bookingResult.insertId, customer_id, vehicle_id]
      );

      await connection.commit();
      return bookingResult.insertId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async cancelBooking({ booking_id, cancelled_by, reason }) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [bookingRows] = await connection.query(
        'SELECT * FROM bookings WHERE booking_id = ? FOR UPDATE',
        [booking_id]
      );
      const booking = bookingRows[0];

      if (!booking || booking.booking_status !== 'Active') {
        const error = new Error('Only active bookings can be cancelled');
        error.status = 400;
        throw error;
      }

      await connection.query(
        `INSERT INTO booking_cancellations (booking_id, cancelled_by, cancellation_reason)
         VALUES (?, ?, ?)`,
        [booking_id, cancelled_by, reason]
      );

      await connection.query(
        "UPDATE bookings SET booking_status = 'Cancelled' WHERE booking_id = ?",
        [booking_id]
      );

      await connection.query(
        "UPDATE vehicles SET availability_status = 'Available' WHERE vehicle_id = ?",
        [booking.vehicle_id]
      );

      await connection.query(
        `INSERT INTO final_bookings (booking_id, customer_id, vehicle_id, action_type, remarks)
         VALUES (?, ?, ?, 'CANCELLED', ?)`,
        [booking_id, booking.customer_id, booking.vehicle_id, reason || 'Booking cancelled']
      );

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async modifyBooking({ booking_id, modified_by, new_start_date, new_end_date, reason }) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [bookingRows] = await connection.query(
        'SELECT * FROM bookings WHERE booking_id = ? FOR UPDATE',
        [booking_id]
      );
      const booking = bookingRows[0];

      if (!booking || booking.booking_status !== 'Active') {
        const error = new Error('Only active bookings can be modified');
        error.status = 400;
        throw error;
      }

      await connection.query(
        `INSERT INTO booking_modifications
        (booking_id, modified_by, old_start_date, old_end_date, new_start_date, new_end_date, modification_reason)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [booking_id, modified_by, booking.start_date, booking.end_date, new_start_date, new_end_date, reason]
      );

      await connection.query(
        `UPDATE bookings SET start_date = ?, end_date = ? WHERE booking_id = ?`,
        [new_start_date, new_end_date, booking_id]
      );

      await connection.query(
        `INSERT INTO final_bookings (booking_id, customer_id, vehicle_id, action_type, remarks)
         VALUES (?, ?, ?, 'MODIFIED', ?)`,
        [booking_id, booking.customer_id, booking.vehicle_id, reason || 'Booking modified']
      );

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async customerBookings(customerId) {
    const [rows] = await pool.query(
      `SELECT b.*, v.vehicle_name, v.vehicle_number, v.category, v.rental_price_per_day, br.branch_name
       FROM bookings b
       JOIN vehicles v ON v.vehicle_id = b.vehicle_id
       JOIN branches br ON br.branch_id = v.branch_id
       WHERE b.customer_id = ?
       ORDER BY b.booking_id DESC`,
      [customerId]
    );
    return rows;
  }

  static async finalBookings() {
    const [rows] = await pool.query(
      `SELECT fb.*, c.full_name, v.vehicle_name, v.vehicle_number
       FROM final_bookings fb
       JOIN customers c ON c.customer_id = fb.customer_id
       JOIN vehicles v ON v.vehicle_id = fb.vehicle_id
       ORDER BY fb.final_booking_id DESC`
    );
    return rows;
  }

  static async adminOverview() {
    const [rows] = await pool.query(
      `SELECT
          (SELECT COUNT(*) FROM bookings WHERE booking_status = 'Active') AS active_bookings,
          (SELECT COUNT(*) FROM booking_cancellations) AS cancellations,
          (SELECT COUNT(*) FROM booking_modifications) AS modifications,
          (SELECT COUNT(*) FROM vehicles WHERE availability_status = 'Available') AS available_vehicles,
          (SELECT COUNT(*) FROM vehicles WHERE availability_status = 'Booked') AS booked_vehicles`
    );
    return rows[0];
  }
}

module.exports = BookingModel;
