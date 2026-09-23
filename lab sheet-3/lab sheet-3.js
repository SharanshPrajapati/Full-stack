const http = require('http');

const PORT = 3000;

// In-memory mock product catalog
const products = [
  { id: 101, name: 'Headphones', price: 2499, img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300' },
  { id: 102, name: 'Keyboard', price: 1899, img: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300' },
  { id: 103, name: 'Mouse', price: 799, img: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300' },
  { id: 104, name: 'Monitor', price: 14499, img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300' },
  { id: 105, name: 'Stand', price: 999, img: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300' },
  { id: 106, name: 'USB Hub', price: 1299, img: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=300' }
];

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lab Sheet 3 - Store</title>
  <!-- React and Babel loaded directly via CDN so no build step is required -->
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: sans-serif; }
    body { background-color: #f8fafc; padding: 20px; }
    .header { display: flex; justify-content: space-between; align-items: center; max-width: 960px; margin: 0 auto 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; }
    .cart-btn { background: #0f172a; color: #fff; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 15px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; max-width: 960px; margin: 0 auto; }
    .card { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center; }
    .card img { width: 100%; height: 140px; object-fit: cover; border-radius: 4px; }
    .card h4 { margin: 8px 0; }
    .card p { font-weight: bold; margin-bottom: 10px; }
    .add-btn { background: #2563eb; color: #fff; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; }
    .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; }
    .modal { background: #fff; padding: 20px; border-radius: 8px; width: 400px; max-height: 80vh; overflow-y: auto; }
    .close-btn { float: right; border: none; background: transparent; font-size: 18px; cursor: pointer; }
    .cart-item { display: flex; justify-content: space-between; align-items: center; margin: 8px 0; border-bottom: 1px solid #f1f5f9; padding-bottom: 6px; }
    .del-btn { background: #ef4444; color: #fff; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; }
    .checkout-btn { width: 100%; padding: 8px 0; background: #16a34a; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; margin-top: 12px; }
    form { display: flex; flex-direction: column; gap: 10px; margin-top: 10px; }
    input, select { padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px; }
  </style>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel">
    const { useState } = React;
    const products = ${JSON.stringify(products)};

    function ProductCard({ product, onAdd }) {
      return (
        <div className="card">
          <img src={product.img} alt={product.name} />
          <h4>{product.name}</h4>
          <p>₹{product.price}</p>
          <button className="add-btn" onClick={() => onAdd(product)}>Add to Cart</button>
        </div>
      );
    }

    function Cart({ cart, onRemove, onClose, onCheckout }) {
      const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      return (
        <div className="overlay">
          <div className="modal">
            <button className="close-btn" onClick={onClose}>✕</button>
            <h3>Your Cart</h3>
            {cart.length === 0 ? (
              <p style={{ margin: '20px 0', textAlign: 'center' }}>Your cart is empty.</p>
            ) : (
              <div>
                {cart.map(({ product, quantity }) => (
                  <div key={product.id} className="cart-item">
                    <div>
                      <strong>{product.name}</strong> x {quantity}
                      <div style={{ fontSize: 13, color: '#64748b' }}>₹{product.price * quantity}</div>
                    </div>
                    <button className="del-btn" onClick={() => onRemove(product.id)}>Remove</button>
                  </div>
                ))}
                <h4 style={{ margin: '12px 0' }}>Grand Total: ₹{total}</h4>
                <button className="checkout-btn" onClick={onCheckout}>Proceed to Checkout</button>
              </div>
            )}
          </div>
        </div>
      );
    }

    function CheckoutForm({ onComplete, onCancel }) {
      const [form, setForm] = useState({ name: '', address: '', pincode: '', phone: '', payment: 'COD' });
      const [placed, setPlaced] = useState(false);

      const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
      const handleSubmit = (e) => {
        e.preventDefault();
        setPlaced(true);
        setTimeout(onComplete, 2000);
      };

      if (placed) {
        return (
          <div className="overlay">
            <div className="modal" style={{ textAlign: 'center' }}>
              <h3 style={{ color: '#16a34a' }}>🎉 Order Placed Successfully!</h3>
              <p style={{ marginTop: 8 }}>Thank you, <strong>{form.name}</strong>.</p>
            </div>
          </div>
        );
      }

      return (
        <div className="overlay">
          <div className="modal">
            <button className="close-btn" onClick={onCancel}>✕</button>
            <h3>Checkout Details</h3>
            <form onSubmit={handleSubmit}>
              <input name="name" placeholder="Full Name" required value={form.name} onChange={handleChange} />
              <input name="address" placeholder="Delivery Address" required value={form.address} onChange={handleChange} />
              <input name="pincode" placeholder="Pincode (6 digits)" required pattern="[0-9]{6}" value={form.pincode} onChange={handleChange} />
              <input name="phone" placeholder="Phone (10 digits)" required pattern="[0-9]{10}" value={form.phone} onChange={handleChange} />
              <select name="payment" value={form.payment} onChange={handleChange}>
                <option value="COD">Cash on Delivery (COD)</option>
                <option value="UPI">UPI Payment</option>
              </select>
              <button type="submit" className="checkout-btn">Place Order</button>
            </form>
          </div>
        </div>
      );
    }

    function App() {
      const [cart, setCart] = useState([]);
      const [showCart, setShowCart] = useState(false);
      const [showCheckout, setShowCheckout] = useState(false);

      const addToCart = (product) => {
        setCart((prev) => {
          const match = prev.find((item) => item.product.id === product.id);
          return match
            ? prev.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
            : [...prev, { product, quantity: 1 }];
        });
      };

      const removeFromCart = (id) => setCart((prev) => prev.filter((item) => item.product.id !== id));
      const count = cart.reduce((sum, item) => sum + item.quantity, 0);

      return (
        <div>
          <div className="header">
            <h2>MiniStore</h2>
            <button className="cart-btn" onClick={() => setShowCart(true)}>🛒 Cart ({count})</button>
          </div>

          <div className="grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} onAdd={addToCart} />
            ))}
          </div>

          {showCart && (
            <Cart
              cart={cart}
              onRemove={removeFromCart}
              onClose={() => setShowCart(false)}
              onCheckout={() => { setShowCart(false); setShowCheckout(true); }}
            />
          )}

          {showCheckout && (
            <CheckoutForm
              onCancel={() => setShowCheckout(false)}
              onComplete={() => { setCart([]); setShowCheckout(false); }}
            />
          )}
        </div>
      );
    }

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(htmlContent);
});

server.listen(PORT, () => {
  console.log(`Application running at http://localhost:${PORT}`);
});