import { Search, Bell, ShoppingCart, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const items = JSON.parse(localStorage.getItem('v3_cart') || '[]');
      setCartCount(items.length);
    };
    
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', updateCartCount);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <header className="header">
      <div className="header-search">
        <Search className="search-icon" size={18} />
        <input type="text" placeholder="Search crops, schemes, experts..." />
      </div>

      <div className="header-actions">
        <button className="icon-btn" onClick={() => navigate('/cart')}>
          <ShoppingCart size={22} />
          {cartCount > 0 && <span className="badge">{cartCount}</span>}
        </button>
        
        <button className="icon-btn">
          <Bell size={22} />
          <span className="badge">3</span>
        </button>
        
        <div className="user-profile" style={{ marginLeft: '1rem', paddingLeft: '1rem', borderLeft: '1px solid var(--border-color)' }}>
          <div className="avatar">{getInitials(user?.name)}</div>
          <span style={{ fontSize: '0.9rem', marginRight: '1rem' }}>{user?.name || 'User'}</span>
          
          <button className="icon-btn" onClick={handleLogout} title="Logout">
            <LogOut size={18} color="var(--danger)" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
