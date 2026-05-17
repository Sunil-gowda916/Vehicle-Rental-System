const pool = require('../config/db');

class CustomerModel {
  static async createCustomer({ full_name, email, password_hash, phone, role = 'customer' }) {
    const [result] = await pool.query(
      `INSERT INTO customers (full_name, email, password_hash, phone, role)
       VALUES (?, ?, ?, ?, ?)`,
      [full_name, email, password_hash, phone, role]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM customers WHERE email = ?', [email]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT customer_id, full_name, email, phone, role, created_at FROM customers WHERE customer_id = ?', [id]);
    return rows[0];
  }
}

module.exports = CustomerModel;
