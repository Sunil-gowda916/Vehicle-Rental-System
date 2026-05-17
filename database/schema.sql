CREATE DATABASE IF NOT EXISTS vehicle_rental_system;
USE vehicle_rental_system;

CREATE TABLE IF NOT EXISTS customers (
  customer_id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS branches (
  branch_id INT PRIMARY KEY AUTO_INCREMENT,
  branch_name VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  address VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vehicles (
  vehicle_id INT PRIMARY KEY AUTO_INCREMENT,
  vehicle_name VARCHAR(100) NOT NULL,
  vehicle_number VARCHAR(30) NOT NULL UNIQUE,
  category ENUM('Hatchback', 'Sedan', 'SUV') NOT NULL,
  transmission ENUM('Manual', 'Automatic') NOT NULL,
  rental_price_per_day DECIMAL(10,2) NOT NULL CHECK (rental_price_per_day > 0),
  seating_capacity INT NOT NULL CHECK (seating_capacity >= 2),
  branch_id INT NOT NULL,
  availability_status ENUM('Available', 'Booked') NOT NULL DEFAULT 'Available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_vehicles_branch FOREIGN KEY (branch_id) REFERENCES branches(branch_id)
);

CREATE TABLE IF NOT EXISTS bookings (
  booking_id INT PRIMARY KEY AUTO_INCREMENT,
  customer_id INT NOT NULL,
  vehicle_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  booking_status ENUM('Active', 'Cancelled') NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_booking_dates CHECK (end_date >= start_date),
  CONSTRAINT fk_bookings_customer FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
  CONSTRAINT fk_bookings_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id)
);

CREATE TABLE IF NOT EXISTS booking_cancellations (
  cancellation_id INT PRIMARY KEY AUTO_INCREMENT,
  booking_id INT NOT NULL,
  cancelled_by INT NOT NULL,
  cancellation_reason VARCHAR(255),
  cancelled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_cancellations_booking FOREIGN KEY (booking_id) REFERENCES bookings(booking_id),
  CONSTRAINT fk_cancellations_customer FOREIGN KEY (cancelled_by) REFERENCES customers(customer_id)
);

CREATE TABLE IF NOT EXISTS booking_modifications (
  modification_id INT PRIMARY KEY AUTO_INCREMENT,
  booking_id INT NOT NULL,
  modified_by INT NOT NULL,
  old_start_date DATE NOT NULL,
  old_end_date DATE NOT NULL,
  new_start_date DATE NOT NULL,
  new_end_date DATE NOT NULL,
  modification_reason VARCHAR(255),
  modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_modified_dates CHECK (new_end_date >= new_start_date),
  CONSTRAINT fk_modifications_booking FOREIGN KEY (booking_id) REFERENCES bookings(booking_id),
  CONSTRAINT fk_modifications_customer FOREIGN KEY (modified_by) REFERENCES customers(customer_id)
);

CREATE TABLE IF NOT EXISTS final_bookings (
  final_booking_id INT PRIMARY KEY AUTO_INCREMENT,
  booking_id INT NOT NULL,
  customer_id INT NOT NULL,
  vehicle_id INT NOT NULL,
  action_type ENUM('BOOKED', 'MODIFIED', 'CANCELLED') NOT NULL,
  remarks VARCHAR(255),
  action_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_final_booking FOREIGN KEY (booking_id) REFERENCES bookings(booking_id),
  CONSTRAINT fk_final_customer FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
  CONSTRAINT fk_final_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id)
);
