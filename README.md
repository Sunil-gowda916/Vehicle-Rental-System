# Vehicle Rental System (DBMS Mini Project)

A beginner-friendly, industry-structured full-stack **Vehicle Rental System** using:
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js + Express.js (MVC)
- **Database:** MySQL

## 1) Architecture Overview

```text
vehicle-rental-system/
├── frontend/
│   ├── index.html
│   ├── css/styles.css
│   └── js/{api.js,app.js}
├── backend/
│   ├── app.js
│   ├── server.js
│   ├── config/db.js
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── .env.example
├── database/
│   ├── schema.sql
│   ├── sample_data.sql
│   └── queries.sql
├── screenshots/
├── .gitignore
└── README.md
```

## 2) ER Diagram (Text Explanation)

- **Customers** (1) → (M) **Bookings**
- **Branches** (1) → (M) **Vehicles**
- **Vehicles** (1) → (M) **Bookings**
- **Bookings** (1) → (M) **Booking_Cancellations**
- **Bookings** (1) → (M) **Booking_Modifications**
- **Bookings** (1) → (M) **Final_Bookings**

## 3) Automatic Booking Logic

1. During booking, only `availability_status='Available'` vehicles are shown.
2. On successful booking: `Available -> Booked`.
3. On cancellation: `Booked -> Available`.
4. Every modification stored in `booking_modifications`.
5. Every cancellation stored in `booking_cancellations`.
6. Output history stored in `final_bookings`.

## 4) Database Setup (MySQL)

```sql
SOURCE database/schema.sql;
SOURCE database/sample_data.sql;
```

Useful query collection:
```sql
SOURCE database/queries.sql;
```

## 5) Backend Setup (CMD / Terminal Commands)

```bash
cd backend
cp .env.example .env
# Update DB credentials and JWT_SECRET in .env
npm install
npm run start
```

Runs API at: `http://localhost:5000`

## 6) Frontend Setup

Open `frontend/index.html` directly in browser, or serve using a static server.

## 7) REST API Documentation

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Vehicles
- `GET /api/vehicles/available` (public, filters: `category`, `branch_id`, `transmission`)
- `GET /api/vehicles` (admin)
- `POST /api/vehicles` (admin)
- `PUT /api/vehicles/:vehicleId` (admin)
- `DELETE /api/vehicles/:vehicleId` (admin)

### Bookings
- `POST /api/bookings` (customer/admin with token)
- `PATCH /api/bookings/:bookingId/cancel` (customer/admin)
- `PATCH /api/bookings/:bookingId/modify` (customer/admin)
- `GET /api/bookings/my`
- `GET /api/bookings/final` (admin)

### Admin
- `GET /api/admin/dashboard`
- `GET /api/admin/branches`
- `POST /api/admin/branches`
- `PUT /api/admin/branches/:branchId`
- `DELETE /api/admin/branches/:branchId`

## 8) Sample API Requests

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "full_name": "Test User",
  "email": "test@demo.com",
  "password": "password123",
  "phone": "9000000000"
}
```

### Book Vehicle
```http
POST /api/bookings
Authorization: Bearer <JWT>
Content-Type: application/json

{
  "vehicle_id": 1,
  "start_date": "2026-05-20",
  "end_date": "2026-05-22"
}
```

### Modify Booking
```http
PATCH /api/bookings/1/modify
Authorization: Bearer <JWT>
Content-Type: application/json

{
  "new_start_date": "2026-05-21",
  "new_end_date": "2026-05-23",
  "reason": "Plan changed"
}
```

### Cancel Booking
```http
PATCH /api/bookings/1/cancel
Authorization: Bearer <JWT>
Content-Type: application/json

{
  "reason": "Trip cancelled"
}
```

## 9) Testing Checklist

- Register/login with customer/admin
- Verify available vehicles endpoint only returns available records
- Book a vehicle and verify status changes to `Booked`
- Cancel booking and verify status changes to `Available`
- Modify booking and verify modification log is created
- Verify `final_bookings` keeps action history

## 10) Deployment Guidance

- Deploy backend on Render/Railway/EC2.
- Use managed MySQL (PlanetScale/Aiven/RDS).
- Set environment variables securely.
- Serve frontend via Netlify/Vercel/GitHub Pages.
- Configure CORS with frontend domain in production.

## 11) Suggested Git Commit Sequence

1. `feat(db): add normalized schema, seed data, and query pack`
2. `feat(api): implement MVC backend with auth and booking workflows`
3. `feat(ui): add responsive frontend for auth, booking, and admin monitoring`
4. `docs: add setup guide, API docs, ER explanation, and deployment notes`
