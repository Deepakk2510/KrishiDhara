import { Calendar, Clock, Video, Star, Phone } from 'lucide-react';
import { useState } from 'react';

const experts = [
  { id: 1, name: 'Dr. Ramesh Sharma', role: 'Senior Agronomist', specialty: 'Wheat & Rice', rating: 4.8, reviews: 124, fee: 500, image: 'RS' },
  { id: 2, name: 'Priya Patel', role: 'Soil Scientist', specialty: 'Fertilizer Optimization', rating: 4.9, reviews: 89, fee: 400, image: 'PP' },
  { id: 3, name: 'Dr. Anil Kumar', role: 'Horticulture Specialist', specialty: 'Fruits & Vegetables', rating: 4.7, reviews: 210, fee: 600, image: 'AK' },
];

const Consultation = () => {
  const [selectedExpert, setSelectedExpert] = useState(null);

  return (
    <div className="animate-slide-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">Expert Consultation</h1>
          <p className="page-subtitle">Book a video or audio call with verified agricultural scientists and veteran farmers.</p>
        </div>
      </div>

      {selectedExpert ? (
        <div className="card animate-slide-up">
          <button className="btn btn-outline mb-4" onClick={() => setSelectedExpert(null)}>← Back to Experts</button>
          
          <div className="flex gap-6 mt-4">
            <div className="avatar" style={{ width: '100px', height: '100px', fontSize: '2rem' }}>{selectedExpert.image}</div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{selectedExpert.name}</h2>
              <div style={{ color: 'var(--primary)', fontWeight: 500, marginBottom: '0.5rem' }}>{selectedExpert.role}</div>
              <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-muted)' }}>
                <span className="flex items-center gap-1"><Star size={16} color="var(--accent)" fill="var(--accent)" /> {selectedExpert.rating} ({selectedExpert.reviews} reviews)</span>
                <span>•</span>
                <span>Specialty: {selectedExpert.specialty}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>₹{selectedExpert.fee}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>per 30 min session</div>
            </div>
          </div>

          <hr style={{ border: 0, borderTop: '1px solid var(--border-color)', margin: '2rem 0' }} />

          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <h3 className="card-title">Select Date & Time</h3>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input type="date" className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Available Slots</label>
                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                  <button className="btn btn-outline" style={{ padding: '0.5rem' }}>09:00 AM</button>
                  <button className="btn btn-primary" style={{ padding: '0.5rem' }}>10:30 AM</button>
                  <button className="btn btn-outline" style={{ padding: '0.5rem' }}>02:00 PM</button>
                  <button className="btn btn-outline" style={{ padding: '0.5rem', opacity: 0.5 }} disabled>04:00 PM</button>
                </div>
              </div>
            </div>
            
            <div style={{ backgroundColor: 'var(--bg-app)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
              <h3 className="card-title">Booking Summary</h3>
              <div className="flex justify-between mb-4">
                <span>Consultation Fee</span>
                <span>₹{selectedExpert.fee}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span>Platform Fee (5%)</span>
                <span>₹{(selectedExpert.fee * 0.05).toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-6 pt-4" style={{ borderTop: '1px solid var(--border-color)', fontWeight: 700, fontSize: '1.1rem' }}>
                <span>Total Payable</span>
                <span>₹{(selectedExpert.fee * 1.05).toFixed(2)}</span>
              </div>
              
              <button className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }} onClick={() => alert('Redirecting to secure payment...')}>
                <Video size={18} /> Confirm & Pay
              </button>
              <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem' }}>You will receive a meeting link via SMS/Email.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {experts.map(expert => (
            <div key={expert.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="flex gap-4 mb-4">
                <div className="avatar" style={{ width: '64px', height: '64px', fontSize: '1.25rem' }}>{expert.image}</div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.2rem' }}>{expert.name}</h3>
                  <div style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 500 }}>{expert.role}</div>
                  <div className="flex items-center gap-1 mt-1" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <Star size={14} color="var(--accent)" fill="var(--accent)" /> {expert.rating} ({expert.reviews})
                  </div>
                </div>
              </div>
              
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', flex: 1, marginBottom: '1.5rem' }}>
                Expertise: {expert.specialty}
              </p>
              
              <div className="flex items-center justify-between" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>₹{expert.fee}<span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}> / 30m</span></div>
                <button className="btn btn-primary" onClick={() => setSelectedExpert(expert)}>Book Slot</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Consultation;
