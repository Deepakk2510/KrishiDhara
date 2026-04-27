import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

const chartData = [
  { month: 'Jan', Wheat: 2100, Rice: 3200, Cotton: 5500 },
  { month: 'Feb', Wheat: 2150, Rice: 3250, Cotton: 5600 },
  { month: 'Mar', Wheat: 2120, Rice: 3400, Cotton: 5400 },
  { month: 'Apr', Wheat: 2300, Rice: 3500, Cotton: 5700 },
  { month: 'May', Wheat: 2250, Rice: 3450, Cotton: 5900 },
  { month: 'Jun', Wheat: 2400, Rice: 3600, Cotton: 6100 },
];

const Markets = () => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/market-prices')
      .then(res => res.json())
      .then(data => {
        setPrices(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch market prices:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="animate-slide-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">Market Insights (Mandi)</h1>
          <p className="page-subtitle">Real-time commodity prices and historical trends.</p>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 3fr', gap: '1.5rem' }}>
        <div className="card">
          <h3 className="card-title">Live Mandi Rates</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Per Quintal</p>
          
          {loading ? (
            <div style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>Loading live rates...</div>
          ) : (
            <div className="flex flex-col gap-4">
              {prices.map((p, i) => (
                <div key={i} className="flex justify-between items-center" style={{ paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                  <div>
                    <div style={{ fontWeight: 500 }}>{p.crop}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700 }}>{p.price}</div>
                    <div style={{ fontSize: '0.8rem', color: p.trend === 'up' ? 'var(--primary)' : 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      {p.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {p.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-6" style={{ marginBottom: '1.5rem' }}>
            <h3 className="card-title" style={{ marginBottom: 0 }}>
              <TrendingUp size={20} color="var(--primary)" /> 6-Month Price Trends
            </h3>
            <select className="form-select" style={{ width: 'auto', padding: '0.4rem 1rem' }}>
              <option>All Crops</option>
              <option>Cereals</option>
              <option>Cash Crops</option>
            </select>
          </div>
          
          <div style={{ height: '400px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Wheat" stroke="#f59e0b" strokeWidth={2} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="Rice" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="Cotton" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Markets;
