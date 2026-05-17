const pool = require('../config/db');

class BranchModel {
  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM branches ORDER BY branch_id DESC');
    return rows;
  }

  static async create({ branch_name, city, address }) {
    const [result] = await pool.query(
      'INSERT INTO branches (branch_name, city, address) VALUES (?, ?, ?)',
      [branch_name, city, address]
    );
    return result.insertId;
  }

  static async update(branchId, { branch_name, city, address }) {
    const [result] = await pool.query(
      'UPDATE branches SET branch_name = ?, city = ?, address = ? WHERE branch_id = ?',
      [branch_name, city, address, branchId]
    );
    return result.affectedRows;
  }

  static async remove(branchId) {
    const [result] = await pool.query('DELETE FROM branches WHERE branch_id = ?', [branchId]);
    return result.affectedRows;
  }
}

module.exports = BranchModel;
