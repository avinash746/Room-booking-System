-- ============================================================
-- Room Booking System - Database Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS room_booking_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE room_booking_db;

-- ------------------------------------------------------------
-- Users Table
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id          INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  name        VARCHAR(100)     NOT NULL,
  email       VARCHAR(191)     NOT NULL,
  password    VARCHAR(255)     NOT NULL,
  created_at  DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Rooms Table
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rooms (
  id              INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  name            VARCHAR(150)     NOT NULL,
  description     TEXT,
  price_per_night DECIMAL(10, 2)   NOT NULL,
  capacity        TINYINT UNSIGNED NOT NULL DEFAULT 1,
  image_url       VARCHAR(500),
  amenities       JSON,
  created_at      DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Bookings Table
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bookings (
  id          INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  user_id     INT UNSIGNED     NOT NULL,
  room_id     INT UNSIGNED     NOT NULL,
  start_date  DATE             NOT NULL,
  end_date    DATE             NOT NULL,
  total_price DECIMAL(10, 2)   NOT NULL,
  status      ENUM('confirmed','cancelled') NOT NULL DEFAULT 'confirmed',
  created_at  DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_bookings_room FOREIGN KEY (room_id) REFERENCES rooms (id) ON DELETE CASCADE,
  -- Ensure start_date is before end_date at DB level
  CONSTRAINT chk_dates CHECK (end_date > start_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Index to speed up overlap queries
CREATE INDEX idx_bookings_room_dates ON bookings (room_id, start_date, end_date, status);
CREATE INDEX idx_bookings_user      ON bookings (user_id);

-- ------------------------------------------------------------
-- Seed: Sample Rooms
-- ------------------------------------------------------------
INSERT INTO rooms (name, description, price_per_night, capacity, image_url, amenities) VALUES
(
  'Deluxe Ocean View Suite',
  'Wake up to breathtaking ocean panoramas in this elegant suite featuring a king-size bed, marble bathroom, and private balcony.',
  299.00, 2,
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
  '["King Bed", "Ocean View", "Private Balcony", "Jacuzzi", "Mini Bar", "Free WiFi"]'
),
(
  'Executive Business Room',
  'Designed for the modern professional. A dedicated workspace, high-speed internet, and city skyline views.',
  189.00, 1,
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
  '["Queen Bed", "City View", "Work Desk", "Fast WiFi", "Coffee Machine", "Smart TV"]'
),
(
  'Cozy Garden Retreat',
  'A tranquil escape surrounded by lush gardens. Perfect for couples seeking peace and privacy.',
  149.00, 2,
  'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800',
  '["Double Bed", "Garden View", "Patio", "Bathtub", "Free WiFi", "Breakfast Included"]'
),
(
  'Royal Presidential Suite',
  'The pinnacle of luxury. An expansive multi-room suite with butler service, panoramic views, and bespoke furnishings.',
  699.00, 4,
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
  '["2 King Beds", "Panoramic View", "Private Pool", "Butler Service", "Full Kitchen", "Home Theater"]'
),
(
  'Standard Comfort Room',
  'Everything you need for a comfortable stay. Clean, modern, and great value for money.',
  89.00, 2,
  'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800',
  '["Double Bed", "Free WiFi", "TV", "Air Conditioning", "En-Suite Bathroom"]'
),
(
  'Penthouse Sky Loft',
  'Perched on the top floor, this stunning loft offers 360-degree city views, an open-plan living area, and rooftop access.',
  549.00, 3,
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
  '["King Bed", "360° View", "Rooftop Access", "Open Kitchen", "Lounge Area", "Premium Minibar"]'
);