import { useState, useEffect } from 'react';
import { roomsAPI } from '../services/api';
import RoomCard from '../components/common/RoomCard';
import { getErrorMessage } from '../utils/helpers';

const DashboardPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await roomsAPI.getAll();
        setRooms(res.data.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const filtered = rooms.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      {/* Hero */}
      <div className="dashboard-hero">
        <h1 className="hero-title">Find Your Perfect Room</h1>
        <p className="hero-subtitle">Luxury stays tailored to your needs</p>
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search rooms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Content */}
      <div className="dashboard-content">
        {loading && (
          <div className="state-container">
            <div className="loading-grid">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="room-card-skeleton" />
              ))}
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="state-container">
            <div className="error-state">
              <span className="state-icon">⚠️</span>
              <h2>Failed to load rooms</h2>
              <p>{error}</p>
              <button onClick={() => window.location.reload()} className="btn btn-primary">
                Try Again
              </button>
            </div>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="state-container">
            <div className="empty-state">
              <span className="state-icon">🏨</span>
              <h2>No rooms found</h2>
              <p>{search ? 'Try a different search term.' : 'No rooms available at the moment.'}</p>
              {search && (
                <button onClick={() => setSearch('')} className="btn btn-outline">
                  Clear Search
                </button>
              )}
            </div>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <>
            <div className="results-count">
              Showing {filtered.length} room{filtered.length !== 1 ? 's' : ''}
              {search && ` for "${search}"`}
            </div>
            <div className="rooms-grid">
              {filtered.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;