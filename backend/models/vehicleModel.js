const pool = require('../config/db');

class VehicleModel {
  static async getAvailable(filters = {}) {
    const conditions = ["v.availability_status = 'Available'"];
    const params = [];

    if (filters.category) {
      conditions.push('v.category = ?');
      params.push(filters.category);
    }
    if (filters.branch_id) {
      conditions.push('v.branch_id = ?');
      params.push(filters.branch_id);
    }
    if (filters.transmission) {
      conditions.push('v.transmission = ?');
      params.push(filters.transmission);
    }

    const query = `
      SELECT v.*, b.branch_name, b.city
      FROM vehicles v
      JOIN branches b ON b.branch_id = v.branch_id
      WHERE ${conditions.join(' AND ')}
      ORDER BY v.vehicle_id DESC
    `;

    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async getAll() {
    const [rows] = await pool.query(
      `SELECT v.*, b.branch_name, b.city
       FROM vehicles v
       JOIN branches b ON b.branch_id = v.branch_id
       ORDER BY v.vehicle_id DESC`
    );
    return rows;
  }

  static async create(data) {
    const [result] = await pool.query(
      `INSERT INTO vehicles
       (vehicle_name, vehicle_number, category, transmission, rental_price_per_day, seating_capacity, branch_id, availability_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)` ,
      [
        data.vehicle_name,
        data.vehicle_number,
        data.category,
        data.transmission,
        data.rental_price_per_day,
        data.seating_capacity,
        data.branch_id,
        data.availability_status || 'Available'
      ]
    );
    return result.insertId;
  }

  static async update(vehicleId, data) {
    const [result] = await pool.query(
      `UPDATE vehicles
       SET vehicle_name = ?, vehicle_number = ?, category = ?, transmission = ?,
           rental_price_per_day = ?, seating_capacity = ?, branch_id = ?, availability_status = ?
       WHERE vehicle_id = ?`,
      [
        data.vehicle_name,
        data.vehicle_number,
        data.category,
        data.transmission,
        data.rental_price_per_day,
        data.seating_capacity,
        data.branch_id,
        data.availability_status,
        vehicleId
      ]
    );
    return result.affectedRows;
  }

  static async remove(vehicleId) {
    const [result] = await pool.query('DELETE FROM vehicles WHERE vehicle_id = ?', [vehicleId]);
    return result.affectedRows;
  }
}

module.exports = VehicleModel;
