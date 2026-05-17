USE vehicle_rental_system;

INSERT INTO customers (full_name, email, password_hash, phone, role) VALUES
('Admin User', 'admin@vrs.com', '$2b$10$7Q9PcWLtNQSuMokmNfxtwOQjMxh3IcaQxMxXfQX6n0nDLM8t9vNma', '9999999999', 'admin'),
('Rahul Sharma', 'rahul@demo.com', '$2b$10$7Q9PcWLtNQSuMokmNfxtwOQjMxh3IcaQxMxXfQX6n0nDLM8t9vNma', '9876543210', 'customer');

INSERT INTO branches (branch_name, city, address) VALUES
('Central Branch', 'Bengaluru', 'MG Road, Bengaluru'),
('North Branch', 'Mysuru', 'VV Mohalla, Mysuru');

INSERT INTO vehicles (vehicle_name, vehicle_number, category, transmission, rental_price_per_day, seating_capacity, branch_id, availability_status) VALUES
('Maruti Swift', 'KA01AB1234', 'Hatchback', 'Manual', 1800, 5, 1, 'Available'),
('Honda City', 'KA05CD5678', 'Sedan', 'Automatic', 2500, 5, 1, 'Available'),
('Mahindra XUV700', 'KA09EF9999', 'SUV', 'Automatic', 4200, 7, 2, 'Booked');

INSERT INTO bookings (customer_id, vehicle_id, start_date, end_date, booking_status) VALUES
(2, 3, '2026-05-18', '2026-05-20', 'Active');

INSERT INTO final_bookings (booking_id, customer_id, vehicle_id, action_type, remarks) VALUES
(1, 2, 3, 'BOOKED', 'Initial booking created');
