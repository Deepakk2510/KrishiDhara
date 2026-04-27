import { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('v3_cart') || '[]');
    setCartItems(items);
  }, []);

  const removeFromCart = (index) => {
    const newCart = [...cartItems];
    newCart.splice(index, 1);
    setCartItems(newCart);
    localStorage.setItem('v3_cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('krishidhara_token');
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ items: cartItems })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      // Redirect to Stripe checkout
      window.location.href = data.url;
    } catch (err) {
      console.error('Checkout failed:', err);
      alert('Failed to initiate secure checkout. Please ensure backend is running and keys are configured.');
      setLoading(false);
    }
  };

  return (
    <div className="animate-slide-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">Your Cart</h1>
          <p className="page-subtitle">Review your items and proceed to checkout.</p>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="card flex flex-col items-center justify-center" style={{ minHeight: '400px' }}>
          <ShoppingCart size={64} color="var(--text-muted)" style={{ opacity: 0.3, marginBottom: '1.5rem' }} />
          <h2 style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Your cart is empty</h2>
          <Link to="/shop" className="btn btn-primary">Go to Shop</Link>
        </div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <div className="card">
            <h3 className="card-title mb-4">Order Items ({cartItems.length})</h3>
            
            <div className="flex flex-col">
              {cartItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center" style={{ padding: '1rem 0', borderBottom: index !== cartItems.length -1 ? '1px solid var(--border-color)' : 'none' }}>
                  <div className="flex items-center gap-4">
                    <div style={{ width: '64px', height: '64px', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '0.25rem' }}>{item.type}</div>
                      <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>{item.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div style={{ fontWeight: 700 }}>₹{item.price}</div>
                    <button onClick={() => removeFromCart(index)} className="icon-btn" style={{ color: 'var(--danger)' }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ height: 'fit-content' }}>
            <h3 className="card-title mb-4">Payment Summary</h3>
            
            <div className="flex justify-between mb-3">
              <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
              <span style={{ fontWeight: 500 }}>₹{total}</span>
            </div>
            <div className="flex justify-between mb-3">
              <span style={{ color: 'var(--text-muted)' }}>Tax (18%)</span>
              <span style={{ fontWeight: 500 }}>₹{(total * 0.18).toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span style={{ color: 'var(--text-muted)' }}>Delivery/Rental Fee</span>
              <span style={{ fontWeight: 500, color: 'var(--primary)' }}>Free</span>
            </div>
            
            <div className="flex justify-between pt-4 mt-2" style={{ borderTop: '1px solid var(--border-color)', fontSize: '1.25rem', fontWeight: 700 }}>
              <span>Total</span>
              <span>₹{(total * 1.18).toFixed(2)}</span>
            </div>

            <button 
              className="btn btn-primary mt-6" 
              style={{ width: '100%', padding: '0.75rem' }}
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Proceed to Checkout'} <ArrowRight size={18} />
            </button>
            
            <div className="flex items-center justify-center gap-2 mt-4" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <ShieldCheck size={16} color="var(--primary)" /> Secure Payments by Stripe
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
