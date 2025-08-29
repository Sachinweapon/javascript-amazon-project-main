const API_BASE = "http://localhost:4242/api/dropship";
let PRODUCTS = [];
let CART = [];

async function init() {
  await loadProducts();
  await loadShippingOptions();
  bindUI();
  renderCart();
}

function bindUI() {
  document.getElementById("openCart").onclick = () => show("cartDrawer");
  document.getElementById("closeCart").onclick = () => hide("cartDrawer");
  document.getElementById("checkoutBtn").onclick = () => show("checkoutPanel");
  document.getElementById("cancelCheckout").onclick = () => hide("checkoutPanel");
  document.getElementById("checkoutForm").onsubmit = handleCheckout;
}

function show(id) { document.getElementById(id).classList.remove("hidden"); }
function hide(id) { document.getElementById(id).classList.add("hidden"); }

async function loadProducts() {
  const res = await fetch(`${API_BASE}/products`);
  PRODUCTS = await res.json();
  renderProducts();
}

async function loadShippingOptions() {
  const res = await fetch(`${API_BASE}/shipping-options`);
  const opts = await res.json();
  const sel = document.getElementById("shippingOption");
  sel.innerHTML = opts.map(o => `<option value="${o.id}">${o.label} — ₹${o.amount}</option>`).join("");
}

function renderProducts() {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = PRODUCTS.map(p => `
    <div class="card">
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <p>₹${p.price}</p>
      <button onclick="addToCart('${p.sku}')">Add to Cart</button>
    </div>
  `).join("");
}

window.addToCart = function(sku) {
  const p = PRODUCTS.find(x => x.sku === sku);
  if (!p) return;
  const found = CART.find(i => i.sku === sku);
  if (found) found.qty++;
  else CART.push({ ...p, qty: 1 });
  renderCart();
}

function renderCart() {
  document.getElementById("cartCount").innerText = CART.reduce((s,i)=>s+i.qty,0);
  document.getElementById("cartItems").innerHTML = CART.map(i =>
    `<p>${i.title} x${i.qty} — ₹${i.price * i.qty}</p>`
  ).join("");
  const subtotal = CART.reduce((s,i)=>s+i.price*i.qty,0);
  document.getElementById("subtotal").innerText = "₹"+subtotal;
  document.getElementById("total").innerText = "₹"+subtotal; // shipping later
}

async function handleCheckout(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const order = {
    customer: { name: fd.get("name"), email: fd.get("email") },
    address: { line1: fd.get("address1"), city: fd.get("city"), zip: fd.get("zip") },
    shippingOption: fd.get("shippingOption"),
    items: CART
  };
  const res = await fetch(`${API_BASE}/checkout`, {
    method:"POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify(order)
  });
  const data = await res.json();
  document.getElementById("orderResult").innerText = "Order placed! ID: "+data.orderId;
  CART = [];
  renderCart();
}
init();
