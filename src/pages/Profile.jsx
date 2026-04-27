import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Save, User, MapPin, Phone, Edit2, Upload } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    farm_size: '',
    profile_picture: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        location: user.location || '',
        farm_size: user.farm_size || '',
        profile_picture: user.profile_picture || ''
      });
    }
  }, [user]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profile_picture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    
    try {
      const token = localStorage.getItem('krishidhara_token');
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setSuccess(true);
        // Dispatch event so header can update if needed
        window.dispatchEvent(new Event('profileUpdated'));
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-slide-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Manage your personal information and farm details.</p>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        <div className="card flex flex-col items-center" style={{ height: 'fit-content' }}>
          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            {formData.profile_picture ? (
              <img src={formData.profile_picture} alt="Profile" style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--primary-light)' }} />
            ) : (
              <div style={{ width: '150px', height: '150px', borderRadius: '50%', backgroundColor: 'var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                <User size={64} />
              </div>
            )}
            <label style={{ position: 'absolute', bottom: '0', right: '0', backgroundColor: 'var(--primary)', color: 'white', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}>
              <Edit2 size={16} />
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
            </label>
          </div>
          
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.25rem' }}>{formData.name || 'Your Name'}</h2>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{user?.email}</div>
          
          <div style={{ width: '100%', padding: '1rem', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-md)' }}>
            <div className="flex items-center gap-2 mb-2" style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>
              <Phone size={16} color="var(--primary)" /> {formData.phone || 'Not provided'}
            </div>
            <div className="flex items-center gap-2" style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>
              <MapPin size={16} color="var(--primary)" /> {formData.location || 'Not provided'}
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title mb-6">Edit Details</h3>
          
          {success && <div style={{ padding: '0.75rem', backgroundColor: '#ecfdf5', color: '#065f46', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid #a7f3d0' }}>Profile updated successfully!</div>}

          <form onSubmit={handleSubmit}>
            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              </div>
              
              <div className="form-group">
                <label className="form-label">Email Address (Read Only)</label>
                <input type="email" className="form-input" value={user?.email || ''} disabled style={{ backgroundColor: 'var(--bg-app)', cursor: 'not-allowed' }} />
              </div>
              
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="tel" className="form-input" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="+91 9876543210" />
              </div>
              
              <div className="form-group">
                <label className="form-label">Location (District/State)</label>
                <input type="text" className="form-input" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="e.g. Pune, Maharashtra" />
              </div>
              
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Farm Size</label>
                <select className="form-select" value={formData.farm_size} onChange={(e) => setFormData({...formData, farm_size: e.target.value})}>
                  <option value="">Select Size...</option>
                  <option value="marginal">Marginal (Up to 1 Hectare)</option>
                  <option value="small">Small (1 - 2 Hectares)</option>
                  <option value="semi-medium">Semi-Medium (2 - 4 Hectares)</option>
                  <option value="medium">Medium (4 - 10 Hectares)</option>
                  <option value="large">Large (Above 10 Hectares)</option>
                </select>
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary mt-4" disabled={loading}>
              <Save size={18} /> {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
