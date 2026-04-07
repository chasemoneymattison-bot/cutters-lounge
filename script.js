// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Header scroll effect
const header = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
  else header.style.boxShadow = 'none';
});

// Mobile menu toggle (simple show/hide)
const menuToggle = document.getElementById('menuToggle');
const navMain = document.querySelector('.nav-main');
menuToggle?.addEventListener('click', () => {
  const isOpen = navMain.style.display === 'flex';
  if (isOpen) {
    navMain.style.display = '';
  } else {
    navMain.style.display = 'flex';
    navMain.style.position = 'absolute';
    navMain.style.top = '100%';
    navMain.style.left = '0';
    navMain.style.right = '0';
    navMain.style.background = '#fff';
    navMain.style.flexDirection = 'column';
    navMain.style.padding = '20px 24px';
    navMain.style.gap = '18px';
    navMain.style.borderBottom = '1px solid #e8e8e8';
  }
});

// Close mobile nav on link click
document.querySelectorAll('.nav-main a').forEach(a => {
  a.addEventListener('click', () => {
    if (window.innerWidth <= 960) navMain.style.display = '';
  });
});

// ========= CART =========
const cart = JSON.parse(localStorage.getItem('cuttersCart') || '[]');
const cartBtn = document.getElementById('cartBtn');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const cartClose = document.getElementById('cartClose');
const cartItemsEl = document.getElementById('cartItems');
const cartCountEl = document.getElementById('cartCount');
const cartSubtotalEl = document.getElementById('cartSubtotal');

function saveCart() {
  localStorage.setItem('cuttersCart', JSON.stringify(cart));
}

function renderCart() {
  cartCountEl.textContent = cart.reduce((s, i) => s + i.qty, 0);
  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
  } else {
    cartItemsEl.innerHTML = cart.map((item, i) => `
      <div class="cart-item">
        <div style="width:60px;height:60px;background:#f5f5f5;border-radius:4px;"></div>
        <div>
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-qty">Qty: ${item.qty} × $${item.price.toFixed(2)}</div>
          <button data-i="${i}" class="remove-item" style="font-size:11px;color:#999;margin-top:4px;text-decoration:underline;">Remove</button>
        </div>
        <div class="cart-item-price">$${(item.qty * item.price).toFixed(2)}</div>
      </div>
    `).join('');
    cartItemsEl.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        cart.splice(parseInt(e.target.dataset.i), 1);
        saveCart();
        renderCart();
      });
    });
  }
  const subtotal = cart.reduce((s, i) => s + i.qty * i.price, 0);
  cartSubtotalEl.textContent = '$' + subtotal.toFixed(2);
}

function openCart() { cartDrawer.classList.add('open'); cartDrawer.setAttribute('aria-hidden', 'false'); }
function closeCart() { cartDrawer.classList.remove('open'); cartDrawer.setAttribute('aria-hidden', 'true'); }

cartBtn.addEventListener('click', openCart);
cartOverlay.addEventListener('click', closeCart);
cartClose.addEventListener('click', closeCart);

document.querySelectorAll('.add-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.dataset.name;
    const price = parseFloat(btn.dataset.price);
    const existing = cart.find(i => i.name === name);
    if (existing) existing.qty += 1;
    else cart.push({ name, price, qty: 1 });
    saveCart();
    renderCart();
    openCart();
  });
});

renderCart();

// Smooth-scroll offset fix for fixed header
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    if (id === '#' || id.length < 2) return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      const offset = 90;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
