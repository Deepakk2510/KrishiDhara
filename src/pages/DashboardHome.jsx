import { Droplets, Thermometer, Wind, Sprout, TrendingUp, CloudRain } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', temp: 28, humidity: 65 },
  { name: 'Tue', temp: 30, humidity: 60 },
  { name: 'Wed', temp: 31, humidity: 55 },
  { name: 'Thu', temp: 29, humidity: 58 },
  { name: 'Fri', temp: 27, humidity: 70 },
  { name: 'Sat', temp: 26, humidity: 75 },
  { name: 'Sun', temp: 28, humidity: 68 },
];

const DashboardHome = () => {
  return (
    <div className="animate-slide-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome back, Ramesh</h1>
          <p className="page-subtitle">Here's what's happening on your farm today.</p>
        </div>
        <button className="btn btn-primary">
          Download Report
        </button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
            <CloudRain size={24} />
          </div>
          <div className="stat-content">
            <h4>Rainfall Expected</h4>
            <div className="stat-value">12<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>mm</span></div>
          </div>
        </div>
        
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
            <Thermometer size={24} />
          </div>
          <div className="stat-content">
            <h4>Avg Temperature</h4>
            <div className="stat-value">28<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>°C</span></div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
            <Sprout size={24} />
          </div>
          <div className="stat-content">
            <h4>Crop Health</h4>
            <div className="stat-value" style={{ color: '#16a34a' }}>94%</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f3e8ff', color: '#9333ea' }}>
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h4>Market Trend (Wheat)</h4>
            <div className="stat-value" style={{ color: '#16a34a' }}>+2.4%</div>
          </div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Chart Section */}
        <div className="card">
          <h3 className="card-title">Weather Forecast (7 Days)</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <Tooltip />
                <Area type="monotone" dataKey="temp" stroke="#f59e0b" fillOpacity={1} fill="url(#colorTemp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts Section */}
        <div className="card">
          <h3 className="card-title">Critical Alerts</h3>
          <div className="flex flex-col gap-4 mt-4">
            <div style={{ padding: '1rem', borderLeft: '4px solid var(--danger)', backgroundColor: '#fef2f2', borderRadius: '4px' }}>
              <div style={{ fontWeight: 600, color: '#991b1b', marginBottom: '0.25rem' }}>Pest Warning: Aphids</div>
              <p style={{ fontSize: '0.85rem', color: '#b91c1c' }}>High risk of aphids detected in neighboring districts. Consider preventive spray.</p>
            </div>
            
            <div style={{ padding: '1rem', borderLeft: '4px solid var(--accent)', backgroundColor: '#fffbeb', borderRadius: '4px' }}>
              <div style={{ fontWeight: 600, color: '#b45309', marginBottom: '0.25rem' }}>Heavy Rain Expected</div>
              <p style={{ fontSize: '0.85rem', color: '#d97706' }}>Postpone fertilizer application scheduled for tomorrow.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
