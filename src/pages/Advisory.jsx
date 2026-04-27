import { useState } from 'react';
import { MapPin, Droplets, Thermometer, Sprout, ShieldAlert } from 'lucide-react';

const Advisory = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = (e) => {
    e.preventDefault();
    setAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      setAnalyzing(false);
      setResult(true);
    }, 1500);
  };

  return (
    <div className="animate-slide-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">Personalized Crop Advisory</h1>
          <p className="page-subtitle">Enter your farm details to get scientifically backed crop recommendations.</p>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Input Form */}
        <div className="card" style={{ height: 'fit-content' }}>
          <h3 className="card-title">Farm Parameters</h3>
          <form onSubmit={handleAnalyze}>
            <div className="form-group">
              <label className="form-label">Soil Type</label>
              <select className="form-select" required>
                <option value="">Select Soil...</option>
                <option value="alluvial">Alluvial Soil</option>
                <option value="black">Black Cotton Soil</option>
                <option value="red">Red & Yellow Soil</option>
                <option value="laterite">Laterite Soil</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Available Irrigation</label>
              <select className="form-select" required>
                <option value="rainfed">Rainfed (No Irrigation)</option>
                <option value="drip">Drip Irrigation</option>
                <option value="sprinkler">Sprinkler</option>
                <option value="canal">Canal / Well</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Season</label>
              <select className="form-select" required>
                <option value="kharif">Kharif (Monsoon)</option>
                <option value="rabi">Rabi (Winter)</option>
                <option value="zaid">Zaid (Summer)</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Location (Optional)</label>
              <div className="flex gap-2">
                <input type="text" className="form-input" placeholder="e.g. Pune, MH" />
                <button type="button" className="btn btn-outline" style={{ padding: '0.5rem' }}><MapPin size={20} /></button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary mt-4" style={{ width: '100%' }} disabled={analyzing}>
              {analyzing ? 'Analyzing Data...' : 'Get Recommendations'}
            </button>
          </form>
        </div>

        {/* Results */}
        <div>
          {analyzing ? (
            <div className="card flex flex-col items-center justify-center" style={{ minHeight: '400px' }}>
              <div style={{ width: '50px', height: '50px', border: '4px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              <p className="mt-4">Running agronomic models...</p>
              <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            </div>
          ) : result ? (
            <div className="animate-slide-up flex flex-col gap-6">
              <div className="card" style={{ borderTop: '4px solid var(--primary)' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Top Recommendation: Cotton</h2>
                <p style={{ color: 'var(--text-muted)' }}>Based on Black Soil, Drip Irrigation, and Kharif season.</p>
                
                <div className="grid mt-6" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  <div style={{ padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: 'var(--radius-md)' }}>
                    <div className="flex items-center gap-2 mb-2" style={{ color: '#16a34a', fontWeight: 600 }}><Droplets size={18} /> Water Need</div>
                    <div style={{ fontWeight: 500 }}>Moderate (Drip optimal)</div>
                  </div>
                  <div style={{ padding: '1rem', backgroundColor: '#fffbeb', borderRadius: 'var(--radius-md)' }}>
                    <div className="flex items-center gap-2 mb-2" style={{ color: '#d97706', fontWeight: 600 }}><Thermometer size={18} /> Ideal Temp</div>
                    <div style={{ fontWeight: 500 }}>21°C - 30°C</div>
                  </div>
                  <div style={{ padding: '1rem', backgroundColor: '#eff6ff', borderRadius: 'var(--radius-md)' }}>
                    <div className="flex items-center gap-2 mb-2" style={{ color: '#2563eb', fontWeight: 600 }}><Sprout size={18} /> Yield Est.</div>
                    <div style={{ fontWeight: 500 }}>15-20 q/ha</div>
                  </div>
                </div>
              </div>

              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="card">
                  <h3 className="card-title">Fertilizer Schedule</h3>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                    <li className="flex items-start gap-2">
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)', marginTop: '6px' }}></div>
                      <div><strong>Basal Dose (Sowing):</strong> 20 kg N, 40 kg P2O5, 40 kg K2O per ha.</div>
                    </li>
                    <li className="flex items-start gap-2">
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)', marginTop: '6px' }}></div>
                      <div><strong>Top Dressing (45 days):</strong> 40 kg Nitrogen per ha.</div>
                    </li>
                  </ul>
                </div>
                
                <div className="card">
                  <h3 className="card-title text-danger"><ShieldAlert size={20} color="var(--danger)" /> Risk Factors</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                    <strong>Pests:</strong> High susceptibility to Bollworms.
                  </p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Recommendation: Use Bt cotton varieties and set up pheromone traps early in the season.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="card flex flex-col items-center justify-center" style={{ minHeight: '400px', color: 'var(--text-muted)' }}>
              <Sprout size={64} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <p>Fill out your farm parameters to get a custom report.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Advisory;
