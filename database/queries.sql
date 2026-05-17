USE vehicle_rental_system;

-- 1. Show all available vehicles during booking
SELECT * FROM vehicles WHERE availability_status = 'Available';

-- 2. Show available vehicles for specific branch and category
SELECT * FROM vehicles
WHERE availability_status = 'Available'
  AND branch_id = 1
  AND category = 'SUV';

-- 3. Customer booking history with vehicle data
SELECT b.booking_id, c.full_name, v.vehicle_name, b.start_date, b.end_date, b.booking_status
FROM bookings b
JOIN customers c ON c.customer_id = b.customer_id
JOIN vehicles v ON v.vehicle_id = b.vehicle_id
WHERE b.customer_id = 2;

-- 4. Admin monitoring dashboard counts
SELECT
  (SELECT COUNT(*) FROM bookings WHERE booking_status = 'Active') AS active_bookings,
  (SELECT COUNT(*) FROM booking_cancellations) AS cancellations,
  (SELECT COUNT(*) FROM booking_modifications) AS modifications,
  (SELECT COUNT(*) FROM vehicles WHERE availability_status = 'Available') AS available_vehicles,
  (SELECT COUNT(*) FROM vehicles WHERE availability_status = 'Booked') AS booked_vehicles;

-- 5. Final bookings output table
SELECT * FROM final_bookings ORDER BY action_time DESC;
