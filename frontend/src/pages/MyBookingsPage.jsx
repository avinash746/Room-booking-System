import { useState, useEffect } from 'react';
import { bookingsAPI } from '../services/api';
import BookingCard from '../components/common/BookingCard';
import { getErrorMessage } from '../utils/helpers';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await bookingsAPI.getMyBookings();
      setBookings(res.data.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(bookingId);
    try {
      await bookingsAPI.cancel(bookingId);
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
      );
      toast.success('Booking cancelled successfully.');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setCancelling(null);
    }
  };

  const filtered = bookings.filter((b) => {
    if (filter === 'confirmed') return b.status === 'confirmed';
    if (filter === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Bookings</h1>
          <p className="page-subtitle">
            {bookings.length > 0
              ? `${confirmedCount} active booking${confirmedCount !== 1 ? 's' : ''}`
              : 'Manage all your reservations'}
          </p>
        </div>
        <Link to="/dashboard" className="btn btn-primary">Browse Rooms</Link>
      </div>

      {/* Filter tabs */}
      {bookings.length > 0 && (
        <div className="filter-tabs">
          {['all', 'confirmed', 'cancelled'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`filter-tab ${filter === f ? 'filter-tab-active' : ''}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span className="filter-count">
                {f === 'all' ? bookings.length : bookings.filter((b) => b.status === f).length}
              </span>
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="state-container">
          <div className="spinner large" />
        </div>
      )}

      {!loading && error && (
        <div className="state-container">
          <div className="error-state">
            <span className="state-icon">⚠️</span>
            <h2>Failed to load bookings</h2>
            <p>{error}</p>
            <button onClick={fetchBookings} className="btn btn-primary">Retry</button>
          </div>
        </div>
      )}

      {!loading && !error && bookings.length === 0 && (
        <div className="state-container">
          <div className="empty-state">
            <span className="state-icon">📅</span>
            <h2>No bookings yet</h2>
            <p>Start exploring our rooms and make your first reservation!</p>
            <Link to="/dashboard" className="btn btn-primary">Explore Rooms</Link>
          </div>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="bookings-list">
          {filtered.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={handleCancel}
              cancelling={cancelling}
            />
          ))}
        </div>
      )}

      {!loading && !error && bookings.length > 0 && filtered.length === 0 && (
        <div className="state-container">
          <div className="empty-state">
            <span className="state-icon">🔍</span>
            <h2>No {filter} bookings</h2>
            <button onClick={() => setFilter('all')} className="btn btn-outline">Show All</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;