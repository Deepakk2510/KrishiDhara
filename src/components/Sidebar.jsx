import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  LineChart, 
  ScanLine, 
  Landmark, 
  CalendarDays, 
  Sprout, 
  ShoppingCart,
  Settings
} from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Sprout color="var(--primary)" /> Krishi<span>Dhara</span>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} end>
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>
        
        <NavLink to="/markets" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <LineChart size={20} /> Market Insights
        </NavLink>
        
        <NavLink to="/disease-scanner" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <ScanLine size={20} /> Disease Scanner
        </NavLink>
        
        <NavLink to="/subsidies" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <Landmark size={20} /> Subsidies & Schemes
        </NavLink>
        
        <NavLink to="/consultation" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <CalendarDays size={20} /> Expert Booking
        </NavLink>
        
        <NavLink to="/advisory" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <Sprout size={20} /> Crop Advisory
        </NavLink>
        
        <NavLink to="/shop" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <ShoppingCart size={20} /> Shop & Rentals
        </NavLink>
      </nav>

      <div style={{ padding: '1.5rem 1rem', borderTop: '1px solid var(--border-sidebar)' }}>
        <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <Settings size={20} /> Profile & Settings
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
