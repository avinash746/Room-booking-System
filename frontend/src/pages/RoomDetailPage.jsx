import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { roomsAPI, bookingsAPI } from '../services/api';
import { formatCurrency, formatDate, calcNights, getTodayString, getErrorMessage } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const RoomDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const today = getTodayString();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateErrors, setDateErrors] = useState({});

  const [availability, setAvailability] = useState(null);
  const [checkingAvail, setCheckingAvail] = useState(false);

  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await roomsAPI.getById(id);
        setRoom(res.data.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const validateDates = () => {
    const errs = {};
    if (!startDate) errs.startDate = 'Check-in date is required';
    if (!endDate) errs.endDate = 'Check-out date is required';
    if (startDate && endDate && endDate <= startDate) {
      errs.endDate = 'Check-out must be after check-in';
    }
    if (startDate && startDate < today) {
      errs.startDate = 'Check-in cannot be in the past';
    }
    return errs;
  };

  const handleCheckAvailability = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to check availability');
      navigate('/login');
      return;
    }
    const errs = validateDates();
    if (Object.keys(errs).length) { setDateErrors(errs); return; }
    setDateErrors({});
    setCheckingAvail(true);
    try {
      const res = await roomsAPI.checkAvailability(id, startDate, endDate);
      setAvailability(res.data.data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setCheckingAvail(false);
    }
  };

  const handleBook = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to book');
      navigate('/login');
      return;
    }
    const errs = validateDates();
    if (Object.keys(errs).length) { setDateErrors(errs); return; }

    setBooking(true);
    try {
      await bookingsAPI.create({ roomId: id, startDate, endDate });
      setBooked(true);
      toast.success('Room booked successfully! 🎉');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setBooking(false);
    }
  };

  const nights = calcNights(startDate, endDate);
  const totalPrice = room ? nights * parseFloat(room.price_per_night) : 0;

  const amenities = room
    ? Array.isArray(room.amenities)
      ? room.amenities
      : JSON.parse(room.amenities || '[]')
    : [];

  if (loading) {
    return (
      <div className="page-container">
        <div className="state-container">
          <div className="spinner large" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="state-container">
          <div className="error-state">
            <span className="state-icon">⚠️</span>
            <h2>Room Not Found</h2>
            <p>{error}</p>
            <Link to="/dashboard" className="btn btn-primary">Back to Rooms</Link>
          </div>
        </div>
      </div>
    );
  }

  if (booked) {
    return (
      <div className="page-container">
        <div className="state-container">
          <div className="success-state">
            <span className="state-icon">🎊</span>
            <h2>Booking Confirmed!</h2>
            <p>
              <strong>{room.name}</strong> is booked from{' '}
              <strong>{formatDate(startDate)}</strong> to <strong>{formatDate(endDate)}</strong>.
            </p>
            <p className="success-price">Total: {formatCurrency(totalPrice)}</p>
            <div className="success-actions">
              <Link to="/my-bookings" className="btn btn-primary">View My Bookings</Link>
              <Link to="/dashboard" className="btn btn-outline">Browse More Rooms</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Link to="/dashboard" className="back-link">← Back to Rooms</Link>

      <div className="room-detail-grid">
        {/* Left: Room info */}
        <div className="room-detail-left">
          <div className="room-detail-image-wrap">
            <img
              src={room.image_url || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'}
              alt={room.name}
              className="room-detail-image"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800';
              }}
            />
          </div>

          <h1 className="room-detail-name">{room.name}</h1>

          <div className="room-detail-meta">
            <span className="detail-meta-item">
              <span className="meta-icon">👥</span>
              Up to {room.capacity} guests
            </span>
            <span className="detail-meta-item">
              <span className="meta-icon">💰</span>
              {formatCurrency(room.price_per_night)} / night
            </span>
          </div>

          <p className="room-detail-desc">{room.description}</p>

          <div className="amenities-section">
            <h3 className="amenities-title">Amenities</h3>
            <div className="amenities-grid">
              {amenities.map((a, i) => (
                <span key={i} className="amenity-pill">✓ {a}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Booking widget */}
        <div className="booking-widget">
          <div className="widget-header">
            <span className="widget-price">{formatCurrency(room.price_per_night)}</span>
            <span className="widget-per-night">per night</span>
          </div>

          <div className="date-inputs">
            <div className="form-group">
              <label className="form-label">Check-in</label>
              <input
                type="date"
                value={startDate}
                min={today}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setAvailability(null);
                  setDateErrors({});
                }}
                className={`form-input ${dateErrors.startDate ? 'input-error' : ''}`}
              />
              {dateErrors.startDate && <span className="field-error">{dateErrors.startDate}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Check-out</label>
              <input
                type="date"
                value={endDate}
                min={startDate || today}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setAvailability(null);
                  setDateErrors({});
                }}
                className={`form-input ${dateErrors.endDate ? 'input-error' : ''}`}
              />
              {dateErrors.endDate && <span className="field-error">{dateErrors.endDate}</span>}
            </div>
          </div>

          {nights > 0 && (
            <div className="price-breakdown">
              <div className="price-row">
                <span>{formatCurrency(room.price_per_night)} × {nights} night{nights !== 1 ? 's' : ''}</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              <div className="price-row price-total">
                <span>Total</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
            </div>
          )}

          {/* Availability feedback */}
          {availability !== null && (
            <div className={`availability-badge ${availability.available ? 'avail-yes' : 'avail-no'}`}>
              {availability.available
                ? '✓ Available for selected dates'
                : '✗ Room is not available for these dates'}
            </div>
          )}

          {availability === null || !availability?.available ? (
            <button
              onClick={handleCheckAvailability}
              disabled={checkingAvail}
              className="btn btn-outline btn-full"
            >
              {checkingAvail ? <span className="btn-spinner" /> : 'Check Availability'}
            </button>
          ) : null}

          {availability?.available && (
            <button
              onClick={handleBook}
              disabled={booking}
              className="btn btn-primary btn-full btn-lg"
            >
              {booking ? <span className="btn-spinner" /> : 'Confirm Booking'}
            </button>
          )}

          {!isAuthenticated && (
            <p className="widget-auth-note">
              <Link to="/login" className="auth-link">Sign in</Link> to book this room
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomDetailPage;