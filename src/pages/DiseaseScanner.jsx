import { useState } from 'react';
import { UploadCloud, CheckCircle, AlertTriangle, FileImage } from 'lucide-react';

const DiseaseScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setScanning(true);
    setResult(null);
    
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const token = localStorage.getItem('krishidhara_token');
        const res = await fetch('/api/scan-disease', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ imageBase64: reader.result })
        });
        
        const data = await res.json();
        setScanning(false);
        
        if (!res.ok) {
          alert(`Error: ${data.error}`);
          return;
        }
        
        setResult(data);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setScanning(false);
      alert('Failed to process image');
    }
  };

  return (
    <div className="animate-slide-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">AI Disease Scanner</h1>
          <p className="page-subtitle">Upload a photo of your affected crop for instant diagnosis and treatment plans.</p>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="card">
          <h3 className="card-title">Upload Image</h3>
          
          <div 
            className="flex flex-col items-center justify-center" 
            style={{ 
              border: '2px dashed var(--border-color)', 
              borderRadius: 'var(--radius-lg)', 
              padding: '3rem', 
              backgroundColor: '#f9fafb',
              cursor: 'pointer',
              minHeight: '300px'
            }}
            onClick={handleUpload}
          >
            {scanning ? (
              <>
                <div style={{ width: '50px', height: '50px', border: '4px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <p className="mt-4" style={{ fontWeight: 500 }}>AI is analyzing your image...</p>
                <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
              </>
            ) : (
              <>
                <UploadCloud size={64} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Click to upload or drag and drop</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>SVG, PNG, JPG or GIF (max. 10MB)</p>
                <label className="btn btn-outline mt-6" style={{ cursor: 'pointer' }}>
                  Select Photo
                  <input type="file" style={{ display: 'none' }} accept="image/*" onChange={handleUpload} />
                </label>
              </>
            )}
          </div>
        </div>

        <div>
          {result ? (
            <div className="card animate-slide-up" style={{ borderLeft: '4px solid var(--accent)' }}>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle color="var(--accent)" />
                <h3 className="card-title" style={{ margin: 0 }}>Diagnosis Complete</h3>
              </div>
              
              <div className="mb-4">
                <div className="form-label">Detected Disease</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--danger)' }}>{result.disease}</div>
              </div>
              
              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '1rem', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-sm)' }}>
                  <div className="form-label">AI Confidence</div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--primary)' }}>{result.confidence}%</div>
                </div>
                <div style={{ padding: '1rem', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-sm)' }}>
                  <div className="form-label">Severity</div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent)' }}>{result.severity}</div>
                </div>
              </div>
              
              <div>
                <div className="form-label">Treatment Recommendation</div>
                <p style={{ lineHeight: 1.6, color: 'var(--text-main)' }}>{result.recommendation}</p>
              </div>
              
              <button className="btn btn-primary mt-6" style={{ width: '100%' }}>Buy Recommended Treatment</button>
            </div>
          ) : (
            <div className="card flex flex-col items-center justify-center" style={{ height: '100%', color: 'var(--text-muted)', textAlign: 'center' }}>
              <FileImage size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <p>Upload an image to see the diagnosis results here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiseaseScanner;
