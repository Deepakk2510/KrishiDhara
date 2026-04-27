import { useState, useEffect } from 'react';
import { ShoppingCart, Tractor, Beaker, Sprout, ExternalLink } from 'lucide-react';

const Shop = () => {
  const [filter, setFilter] = useState('All');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch products:', err);
        setLoading(false);
      });
  }, []);

  const filteredProducts = filter === 'All' ? products : products.filter(p => p.type === filter);

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('v3_cart') || '[]');
    cart.push(product);
    localStorage.setItem('v3_cart', JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
    window.dispatchEvent(new Event('cartUpdated'));
  };


  return (
    <div className="animate-slide-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">Shop & Equipment Rentals</h1>
          <p className="page-subtitle">Purchase premium seeds, fertilizers, or rent heavy machinery for your farm.</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {['All', 'Supplies', 'Seeds', 'Equipment', 'Rental'].map(cat => (
          <button 
            key={cat} 
            className={`btn ${filter === cat ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter(cat)}
            style={{ borderRadius: '99px' }}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading products from backend...</div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {filteredProducts.map(product => {
            return (
              <div key={product.id} className="card flex flex-col transition-all hover:shadow-md" style={{ transform: 'translateY(0)', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ height: '180px', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: product.type === 'Rental' ? 'var(--accent)' : 'var(--primary)', backgroundColor: product.type === 'Rental' ? '#fffbeb' : '#ecfdf5', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    {product.type}
                  </span>
                  <h3 style={{ fontSize: '1.1rem', marginTop: '0.75rem', marginBottom: '0.5rem', lineHeight: 1.3 }}>{product.name}</h3>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>₹{product.price}</div>
                  {product.external_url ? (
                    <a href={product.external_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ color: '#d97706', borderColor: '#fcd34d' }}>
                      Buy on Amazon <ExternalLink size={14} style={{ marginLeft: '4px' }} />
                    </a>
                  ) : (
                    <button className="btn btn-primary" onClick={() => addToCart(product)}>
                      <ShoppingCart size={16} /> Add
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Shop;
