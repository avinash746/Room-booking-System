import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🏨</span>
          <span className="brand-name">LuxeStay</span>
        </Link>

        <div className="navbar-links">
          <Link to="/dashboard" className={isActive('/dashboard')}>Rooms</Link>
          {isAuthenticated && (
            <Link to="/my-bookings" className={isActive('/my-bookings')}>My Bookings</Link>
          )}
        </div>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              <span className="navbar-user">
                <span className="user-avatar">{user?.name?.[0]?.toUpperCase()}</span>
                <span className="user-name">{user?.name}</span>
              </span>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;