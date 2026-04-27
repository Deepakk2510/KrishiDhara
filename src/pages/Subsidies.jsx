import { useState, useEffect } from 'react';
import { Search, ExternalLink, CheckCircle } from 'lucide-react';

const Subsidies = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/schemes')
      .then(res => res.json())
      .then(data => {
        setSchemes(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch schemes:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="animate-slide-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">Government Schemes & Subsidies</h1>
          <p className="page-subtitle">Find and apply for financial assistance programs you are eligible for.</p>
        </div>
      </div>

      <div className="card mb-6">
        <div className="flex gap-4">
          <div className="form-group flex-1" style={{ marginBottom: 0 }}>
            <div className="header-search" style={{ width: '100%' }}>
              <Search className="search-icon" size={18} />
              <input type="text" placeholder="Search schemes by name or category..." style={{ width: '100%', borderRadius: 'var(--radius-md)' }} />
            </div>
          </div>
          <select className="form-select" style={{ width: '200px' }}>
            <option>All Categories</option>
            <option>Income Support</option>
            <option>Equipment</option>
            <option>Irrigation</option>
          </select>
          <button className="btn btn-primary">Search</button>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading government schemes...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-app)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)' }}>Scheme Name</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)' }}>Category</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)' }}>Benefit Amount</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {schemes.map((scheme, i) => (
                <tr key={scheme.id} style={{ borderBottom: i !== schemes.length - 1 ? '1px solid var(--border-color)' : 'none', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.02)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '0.25rem' }}>{scheme.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{scheme.provider}</div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <span style={{ padding: '0.25rem 0.75rem', backgroundColor: 'var(--bg-app)', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 500 }}>
                      {scheme.category}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', fontWeight: 500 }}>{scheme.amount}</td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <span style={{ 
                      color: scheme.status === 'Active' ? 'var(--primary)' : 'var(--accent)',
                      display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 500
                    }}>
                      {scheme.status === 'Active' && <CheckCircle size={14} />} {scheme.status}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                    <a href={scheme.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                      Apply <ExternalLink size={14} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Subsidies;
