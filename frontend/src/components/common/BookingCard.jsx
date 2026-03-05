import { useState } from 'react';
import { formatDate, formatCurrency, calcNights } from '../../utils/helpers';

const BookingCard = ({ booking, onCancel, cancelling }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const nights = calcNights(booking.start_date, booking.end_date);
  const isPast = new Date(booking.start_date) < new Date();
  const canCancel = booking.status === 'confirmed' && !isPast;
  const statusClass = booking.status === 'confirmed' ? 'status-confirmed' : 'status-cancelled';

  const handleCancelClick = () => setShowConfirm(true);
  const handleConfirm = () => { setShowConfirm(false); onCancel(booking.id); };
  const handleClose = () => setShowConfirm(false);

  return (
    <>
      {/* ── Cancel Confirm Modal ── */}
      {showConfirm && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: 'rgba(15,31,53,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            background: '#fff', borderRadius: '20px',
            padding: '36px 32px', maxWidth: '420px', width: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.25)', textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🚫</div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.7rem', color: '#0f1f35', marginBottom: '10px'
            }}>Cancel Booking?</h2>
            <p style={{ color: '#4a5568', marginBottom: '6px', fontSize: '0.95rem' }}>
              <strong>{booking.room_name}</strong>
            </p>
            <p style={{ color: '#8a96a8', fontSize: '0.88rem', marginBottom: '28px' }}>
              {formatDate(booking.start_date)} → {formatDate(booking.end_date)}<br/>
              This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={handleClose} style={{
                padding: '10px 28px', borderRadius: '8px',
                border: '2px solid #e2d9cc', background: 'transparent',
                fontFamily: 'inherit', fontSize: '0.9rem',
                fontWeight: '600', cursor: 'pointer', color: '#4a5568'
              }}>Keep Booking</button>
              <button onClick={handleConfirm} style={{
                padding: '10px 28px', borderRadius: '8px',
                border: 'none', background: '#e53e3e',
                fontFamily: 'inherit', fontSize: '0.9rem',
                fontWeight: '600', cursor: 'pointer', color: '#fff'
              }}>Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Booking Card ── */}
      <div className={`booking-card ${booking.status === 'cancelled' ? 'booking-cancelled' : ''}`}>
        <div className="booking-card-image">
          <img
            src={booking.image_url || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300'}
            alt={booking.room_name}
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300'; }}
          />
        </div>

        <div className="booking-card-body">
          {/* Header */}
          <div className="booking-card-header">
            <h3 className="booking-room-name">{booking.room_name}</h3>
            <span className={`booking-status ${statusClass}`}>
              {booking.status === 'confirmed' ? '✓ Confirmed' : '✗ Cancelled'}
            </span>
          </div>

          {/* Dates */}
          <div className="booking-dates">
            <div className="booking-date-item">
              <span className="date-label">Check-in</span>
              <span className="date-value">{formatDate(booking.start_date)}</span>
            </div>
            <div className="booking-date-divider">→</div>
            <div className="booking-date-item">
              <span className="date-label">Check-out</span>
              <span className="date-value">{formatDate(booking.end_date)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="booking-card-footer">
            <div className="booking-price-info">
              <span className="booking-nights">{nights} night{nights !== 1 ? 's' : ''}</span>
              <span className="booking-total">{formatCurrency(booking.total_price)}</span>
            </div>

            {/* Cancel Button — only for confirmed future bookings */}
            {canCancel && (
              <button
                onClick={handleCancelClick}
                disabled={cancelling === booking.id}
                className="cancel-btn"
              >
                {cancelling === booking.id ? (
                  <><span className="btn-spinner" /> Cancelling...</>
                ) : (
                  <> 🚫 Cancel Booking</>
                )}
              </button>
            )}

            {/* Past booking note */}
            {booking.status === 'confirmed' && isPast && (
              <span style={{ fontSize: '0.78rem', color: '#8a96a8', fontStyle: 'italic' }}>
                Past booking
              </span>
            )}
          </div>

          <div className="booking-booked-on">
            Booked on {formatDate(booking.created_at)}
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingCard;