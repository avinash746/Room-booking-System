# 🏨 LuxeStay — Room Booking System

A full-stack room booking web application built with React, Node.js, Express, and MySQL.

---

## 🛠️ Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18, React Router, Axios     |
| Backend   | Node.js, Express.js               |
| Database  | MySQL 8+                          |
| Auth      | JWT (JSON Web Tokens) + bcryptjs  |
| Styling   | Custom CSS Design System          |

---

## 📁 Project Structure

```
room-booking-system/
├── backend/
│   ├── config/
│   │   └── db.js                 # MySQL connection pool
│   ├── controllers/
│   │   ├── authController.js     # Auth request handling
│   │   ├── roomController.js     # Room request handling
│   │   └── bookingController.js  # Booking request handling
│   ├── db/
│   │   └── schema.sql            # Database schema + seed data
│   ├── middleware/
│   │   ├── auth.js               # JWT verification
│   │   └── errorHandler.js       # Global error handler
│   ├── routes/
│   │   ├── auth.js               # Auth routes
│   │   ├── rooms.js              # Room routes
│   │   └── bookings.js           # Booking routes
│   ├── services/
│   │   ├── authService.js        # Auth business logic
│   │   ├── roomService.js        # Room business logic
│   │   └── bookingService.js     # Booking + overlap prevention
│   ├── .env.example              # Environment variable template
│   ├── package.json
│   └── server.js                 # App entry point
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── common/
│       │   │   ├── BookingCard.jsx
│       │   │   ├── ProtectedRoute.jsx
│       │   │   └── RoomCard.jsx
│       │   └── layout/
│       │       └── Navbar.jsx
│       ├── context/
│       │   └── AuthContext.jsx   # Global auth state
│       ├── pages/
│       │   ├── DashboardPage.jsx
│       │   ├── LoginPage.jsx
│       │   ├── MyBookingsPage.jsx
│       │   ├── RegisterPage.jsx
│       │   └── RoomDetailPage.jsx
│       ├── services/
│       │   └── api.js            # All Axios API calls
│       ├── styles/
│       │   └── global.css        # Design system
│       ├── utils/
│       │   └── helpers.js        # Date & price helpers
│       ├── App.jsx               # Routes + providers
│       ├── index.js              # React entry point
│       ├── .env.example
│       └── package.json
│
├── architecture-notes.txt        # System design explanation
├── LuxeStay_API.postman_collection.json
└── README.md
```

---

## ✅ Prerequisites

Make sure these are installed before starting:

- **Node.js** v18 or higher → https://nodejs.org
- **MySQL** v8 or higher → https://dev.mysql.com/downloads
- **npm** v9 or higher (comes with Node.js)

Check versions:
```bash
node -v
npm -v
mysql --version
```

---

## 🚀 Setup Instructions

### Step 1 — Clone the Project

```bash
git clone https://github.com/your-username/room-booking-system.git
cd room-booking-system
```

---

### Step 2 — Setup the Database

Open **MySQL Workbench** and run the schema file:

```
File → Open SQL Script → backend/db/schema.sql → Open
Press Ctrl + Shift + Enter to run
```

Or run from terminal:

```bash
mysql -u root -p < backend/db/schema.sql
```

This will:
- Create the `room_booking_db` database
- Create `users`, `rooms`, `bookings` tables
- Insert 6 sample rooms automatically

---

### Step 3 — Setup Backend

```bash
cd backend
npm init -y
npm install express mysql2 jsonwebtoken bcryptjs cors dotenv
npm install --save-dev nodemon
npm install
cp .env.example .env
```

Now open `backend/.env` and fill in your values:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=room_booking_db

JWT_SECRET=your_random_secret_key_here
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:3000
```

Start the backend server:

```bash
npm run dev
```

You should see:
```
✅ MySQL connected successfully
🚀 Server running on http://localhost:5000
```

---

### Step 4 — Setup Frontend

Open a **new terminal window**:

```bash
npx create-react-app frontend
cd frontend
npm install react@18.2.0 react-dom@18.2.0 react-scripts@5.0.1 react-router-dom axios react-hot-toast date-fns
npm install
cp .env.example .env
```

The `frontend/.env` file should contain:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm start
```

The app will open at **http://localhost:3000** automatically.

---

## 🌐 API Endpoints

Base URL: `http://localhost:5000/api`

### Auth
| Method | Endpoint          | Auth | Description          |
|--------|-------------------|------|----------------------|
| POST   | /auth/register    | No   | Register new user    |
| POST   | /auth/login       | No   | Login, returns JWT   |
| GET    | /auth/profile     | Yes  | Get user profile     |

### Rooms
| Method | Endpoint                    | Auth | Description          |
|--------|-----------------------------|------|----------------------|
| GET    | /rooms                      | No   | Get all rooms        |
| GET    | /rooms/:id                  | No   | Get single room      |
| GET    | /rooms/:id/availability     | Yes  | Check availability   |

### Bookings
| Method | Endpoint              | Auth | Description          |
|--------|-----------------------|------|----------------------|
| POST   | /bookings             | Yes  | Create booking       |
| GET    | /bookings/my          | Yes  | Get my bookings      |
| PATCH  | /bookings/:id/cancel  | Yes  | Cancel booking       |

---

## 🗄️ Database Schema

### users
| Column     | Type         | Description              |
|------------|--------------|--------------------------|
| id         | INT UNSIGNED | Primary key              |
| name       | VARCHAR(100) | Full name                |
| email      | VARCHAR(191) | Unique login email       |
| password   | VARCHAR(255) | bcrypt hashed password   |
| created_at | DATETIME     | Account creation time    |

### rooms
| Column          | Type          | Description              |
|-----------------|---------------|--------------------------|
| id              | INT UNSIGNED  | Primary key              |
| name            | VARCHAR(150)  | Room title               |
| description     | TEXT          | Room description         |
| price_per_night | DECIMAL(10,2) | Price in USD             |
| capacity        | TINYINT       | Max guests               |
| image_url       | VARCHAR(500)  | Room image URL           |
| amenities       | JSON          | List of amenities        |

### bookings
| Column      | Type          | Description              |
|-------------|---------------|--------------------------|
| id          | INT UNSIGNED  | Primary key              |
| user_id     | INT UNSIGNED  | FK → users               |
| room_id     | INT UNSIGNED  | FK → rooms               |
| start_date  | DATE          | Check-in date            |
| end_date    | DATE          | Check-out date           |
| total_price | DECIMAL(10,2) | Total amount             |
| status      | ENUM          | confirmed / cancelled    |

---

## 🔐 How Authentication Works

1. User registers or logs in → backend returns a **JWT token**
2. Frontend stores token in **localStorage**
3. Every API request includes the token:
   ```
   Authorization: Bearer <token>
   ```
4. Backend middleware verifies the token on protected routes
5. Token expires after **7 days**
6. On expiry, user is automatically redirected to login

---

## 🔒 How Double Booking is Prevented

When a booking is created:

1. A **MySQL transaction** begins
2. All existing confirmed bookings for that room and date range are **locked** with `SELECT ... FOR UPDATE`
3. If any overlap is found → transaction is **rolled back** → error 409 is returned
4. If no overlap → booking is **inserted** → transaction is **committed**

This prevents race conditions when two users try to book the same room at the same time.

---

## 📮 Testing with Postman

Import `LuxeStay_API.postman_collection.json` into Postman.

**Test in this order:**
1. **Register** — create a new account
2. **Login** — token is saved automatically
3. **Get All Rooms** — browse available rooms
4. **Check Availability** — pick dates
5. **Create Booking** — book a room
6. **Get My Bookings** — view your bookings
7. **Cancel Booking** — cancel if needed

---

## 📦 Dependencies

### Backend
| Package       | Version | Purpose                    |
|---------------|---------|----------------------------|
| express       | ^4.18   | HTTP server framework      |
| mysql2        | ^3.6    | MySQL driver               |
| jsonwebtoken  | ^9.0    | JWT auth tokens            |
| bcryptjs      | ^2.4    | Password hashing           |
| cors          | ^2.8    | Cross-origin requests      |
| dotenv        | ^16.3   | Environment variables      |
| nodemon       | ^3.0    | Auto-restart (dev only)    |

### Frontend
| Package          | Version | Purpose                 |
|------------------|---------|-------------------------|
| react            | ^18.2   | UI library              |
| react-router-dom | ^6.21   | Client-side routing     |
| axios            | ^1.6    | HTTP client             |
| react-hot-toast  | ^2.4    | Toast notifications     |
| date-fns         | ^3.0    | Date formatting         |

---

## 🔄 Available Scripts

### Backend
```bash
npm run dev    # Start with nodemon (auto-restart)
npm start      # Start in production mode
```

### Frontend
```bash
npm start      # Start development server
npm run build  # Build for production
```

---

## 🚨 Common Errors & Fixes

| Error | Fix |
|-------|-----|
| `MySQL connected` not showing | Check `.env` DB credentials |
| `Table doesn't exist` | Run `schema.sql` in Workbench |
| `Module not found` | Run `npm install` in that folder |
| `Port 3000 already in use` | Kill process: `npx kill-port 3000` |
| `401 Unauthorized` | Login again to get fresh token |
| `409 Conflict` | Room already booked for those dates |

---

## 👨‍💻 Author

Built as a full-stack room booking system assignment.

- Frontend: React 18 + Custom CSS
- Backend: Node.js + Express
- Database: MySQL 8 with transaction-safe booking

## Screenshots
<img width="1888" height="910" alt="image" src="https://github.com/user-attachments/assets/ef7c504e-0781-44e3-b54b-f2dc4ebf5b37" />

<img width="1911" height="904" alt="image" src="https://github.com/user-attachments/assets/94ffcc97-d73d-4842-9073-b84a5d2c5d10" />

<img width="1897" height="911" alt="image" src="https://github.com/user-attachments/assets/3dc2ff96-09e2-4224-b63a-f4e26522d81a" />

<img width="1883" height="921" alt="image" src="https://github.com/user-attachments/assets/9299cd76-c20d-42e1-adc6-573fc30e791c" />
