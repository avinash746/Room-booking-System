import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/helpers';

const RoomCard = ({ room }) => {
  const amenities = Array.isArray(room.amenities)
    ? room.amenities
    : JSON.parse(room.amenities || '[]');

  return (
    <div className="room-card">
      <div className="room-card-image-wrap">
        <img
          src={room.image_url || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600'}
          alt={room.name}
          className="room-card-image"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600';
          }}
        />
        <div className="room-card-price-badge">
          <span>{formatCurrency(room.price_per_night)}</span>
          <span className="per-night">/night</span>
        </div>
      </div>

      <div className="room-card-body">
        <h3 className="room-card-name">{room.name}</h3>
        <p className="room-card-desc">{room.description}</p>

        <div className="room-card-meta">
          <span className="room-meta-item">
            <span className="meta-icon">👥</span>
            {room.capacity} guest{room.capacity !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="room-amenities">
          {amenities.slice(0, 3).map((a, i) => (
            <span key={i} className="amenity-tag">{a}</span>
          ))}
          {amenities.length > 3 && (
            <span className="amenity-tag amenity-more">+{amenities.length - 3} more</span>
          )}
        </div>

        <Link to={`/rooms/${room.id}`} className="btn btn-primary btn-full">
          View & Book
        </Link>
      </div>
    </div>
  );
};

export default RoomCard;