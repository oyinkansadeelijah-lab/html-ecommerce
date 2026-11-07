function getCart() { try { return JSON.parse(localStorage.getItem('store_cart')) || []; } catch { return []; } }
function saveCart(c) { localStorage.setItem('store_cart', JSON.stringify(c)); }
function addToCart(product) {
  const c = getCart();
  const existing = c.find(i => i.id === product.id);
  if (existing) { existing.qty += 1; } else { c.push({ ...product, qty: 1 }); }
  saveCart(c);
  updateCartUI();
}
function removeFromCart(id) { saveCart(getCart().filter(i => i.id !== id)); updateCartUI(); }
function updateQty(id, delta) {
  const c = getCart();
  const item = c.find(i => i.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart(c); updateCartUI();
}
function clearCart() { localStorage.removeItem('store_cart'); updateCartUI(); }
function cartCount() { return getCart().reduce((s, i) => s + i.qty, 0); }
function cartTotal() { return getCart().reduce((s, i) => s + i.price * i.qty, 0); }

function updateCartUI() {
  const badges = document.querySelectorAll('.cart-badge');
  const n = cartCount();
  badges.forEach(b => b.textContent = n > 0 ? n : '');
}

function renderCartRows(container) {
  const c = getCart();
  if (c.length === 0) { container.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:2rem;color:var(--muted)">Your cart is empty.</td></tr>'; return; }
  container.innerHTML = c.map(i => `
    <tr>
      <td><img src="${i.image}" alt="${i.name}" style="width:80px;height:80px;object-fit:cover;border-radius:12px;"></td>
      <td><a href="product.html?id=${i.id}" style="font-family:'Playfair Display',serif;font-size:1.1rem;color:var(--ink);">${i.name}</a></td>
      <td>
        <div class="qty-control">
          <button onclick="updateQty('${i.id}', -1)" class="qty-btn">−</button>
          <span>${i.qty}</span>
          <button onclick="updateQty('${i.id}', 1)" class="qty-btn">+</button>
        </div>
      </td>
      <td>$${(i.price * i.qty).toLocaleString()}</td>
      <td><button onclick="removeFromCart('${i.id}')" style="color:var(--muted);font-weight:600;font-size:0.85rem;">Remove</button></td>
    </tr>
  `).join('');
}

function renderCartSummary() {
  const total = cartTotal();
  const el = document.getElementById('cart-summary');
  if (el) el.innerHTML = `<p style="margin-bottom:0.5rem"><span style="color:var(--muted)">Subtotal</span> <strong>$${total.toLocaleString()}</strong></p><p style="margin-bottom:1rem"><span style="color:var(--muted)">Delivery</span> <strong>Complimentary</strong></p><div style="border-top:1px solid var(--border);margin:1rem 0;padding-top:1rem;font-family:'Playfair Display',serif;font-size:1.4rem;"><span>Total</span> <span style="color:var(--gold)">$${total.toLocaleString()}</span></div><a href="checkout.html" class="btn-primary" style="display:block;text-align:center;width:100%;">Checkout</a>`;
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();
  const table = document.getElementById('cart-table-body');
  if (table) { renderCartRows(table); renderCartSummary(); }
});
