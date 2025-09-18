import { cart } from '../data/cart.js';
import { products } from '../data/products.js';

const summaryContainer = document.querySelector('.js-dropship-summary');
const marginInput = document.getElementById('margin');
const applyMarginBtn = document.getElementById('apply-margin');
const addressSection = document.getElementById('address-section');
const confirmOrderBtn = document.getElementById('confirm-order');
const cartQuantityEl = document.querySelector('.js-cart-quantity');
const priceSummary = document.getElementById('price-summary');

let dropshipItems = [];
let finalTotal = 0;
let lastSubtotal = 0;
let lastMarginAmount = 0;
let lastFinalTotal = 0;

function renderCart() {
  let html = '';
  let totalQty = 0;
  cart.forEach((cartItem, index) => {
    const product = products.find(p => p.id === cartItem.productId);
    if (!product) return;
    totalQty += cartItem.quantity;
    const price = (product.priceCents / 100).toFixed(2);
    html += `
      <div class="cart-item-container">
        <div class="delivery-date">Eligible for dropshipping</div>
        <div class="cart-item-details-grid">
          <input type="checkbox" class="dropship-checkbox" data-index="${index}">
          <img class="product-image" src="${product.image}" alt="${product.name}">
          <div class="cart-item-details">
            <div class="product-name">${product.name}</div>
            <div class="product-price">$${price}</div>
            <div class="product-quantity">Quantity: ${cartItem.quantity}</div>
          </div>
        </div>
      </div>
    `;
  });
  summaryContainer.innerHTML = html;
  cartQuantityEl.textContent = totalQty;

  const checkboxes = Array.from(document.querySelectorAll('.dropship-checkbox'));

  function updateApplyState() {
    const anyChecked = checkboxes.some(cb => cb.checked);
    applyMarginBtn.disabled = !anyChecked;
  }

  checkboxes.forEach(cb => {
    cb.addEventListener('change', updateApplyState);
  });

  updateApplyState(); // initialize
}

function updatePriceSummary(subtotal, marginAmount, total, itemCount) {
  priceSummary.innerHTML = `
    <h2>Payment Summary</h2>
    <div class="payment-summary-row">
      <span>Subtotal (${itemCount} items):</span>
      <span class="payment-summary-money">$${subtotal.toFixed(2)}</span>
    </div>
    <div class="payment-summary-row">
      <span>Margin Added:</span>
      <span class="payment-summary-money">+$${marginAmount.toFixed(2)}</span>
    </div>
    <div class="payment-summary-row">
      <span>Shipping:</span>
      <span class="payment-summary-money">FREE</span>
    </div>
    <div class="payment-summary-row total-row">
      <span>Order Total:</span>
      <span class="payment-summary-money">$${total.toFixed(2)}</span>
    </div>
  `;
  priceSummary.classList.remove('show');
  void priceSummary.offsetWidth;
  priceSummary.classList.add('show');
}

applyMarginBtn.addEventListener('click', () => {
  const checkboxes = Array.from(document.querySelectorAll('.dropship-checkbox'));
  const checkedBoxes = checkboxes.filter(cb => cb.checked);
  if (checkedBoxes.length === 0) {
    alert('Please select at least one product before applying margin.');
    return;
  }
  
  const margin = parseFloat(marginInput.value) || 0;
  dropshipItems = [];
  finalTotal = 0;
  let subtotal = 0;
  
  checkboxes.forEach((cb, i) => {
    const item = cart[i];
    const product = products.find(p => p.id === item.productId);
    if (!product) return;
    const baseTotal = (product.priceCents / 100) * item.quantity;
    subtotal += baseTotal;
    if (cb.checked) {
      const finalPrice = baseTotal + (baseTotal * margin / 100);
      dropshipItems.push({ ...item, margin, finalPrice: finalPrice.toFixed(2), productId: item.productId });
      finalTotal += finalPrice;
    } else {
      finalTotal += baseTotal;
    }
  });

  const marginAmount = finalTotal - subtotal;
  lastSubtotal = subtotal;
  lastMarginAmount = marginAmount;
  lastFinalTotal = finalTotal;
  updatePriceSummary(subtotal, marginAmount, finalTotal, cart.reduce((sum, c) => sum + c.quantity, 0));
  addressSection.style.display = 'block';
});

document.querySelectorAll("input[name='sameAddress']").forEach(radio => {
  radio.addEventListener("change", () => {
    document.getElementById("dropship-address-container").style.display =
      (radio.value === "no" && radio.checked) ? "block" : "none";
  });
});

confirmOrderBtn.addEventListener("click", () => {
  const normalAddress = document.getElementById("normal-address").value.trim();
  const sameAddress = document.querySelector("input[name='sameAddress']:checked").value;
  const dropshipAddress = sameAddress === "yes"
    ? normalAddress
    : document.getElementById("dropship-address").value.trim();

  if (!normalAddress) {
    alert("Please enter an address for non-dropshipped items.");
    return;
  }
  if (sameAddress === "no" && !dropshipAddress) {
    alert("Please enter a dropship address.");
    return;
  }

  const items = cart.map(ci => {
    const p = products.find(x => x.id === ci.productId) || {};
    const isDropship = dropshipItems.some(d => d.productId === ci.productId);
    return {
      productId: ci.productId,
      name: p.name || 'Product',
      image: p.image || 'images/placeholder.png',
      priceCents: p.priceCents || 0,
      quantity: ci.quantity,
      dropship: isDropship
    };
  });

  const order = {
    id: Date.now(),
    items,
    summary: {
      subtotal: lastSubtotal || items.reduce((s, it) => s + ((it.priceCents||0)/100) * it.quantity, 0),
      margin: lastMarginAmount || 0,
      total: lastFinalTotal || items.reduce((s, it) => s + ((it.priceCents||0)/100) * it.quantity, 0)
    },
    normalAddress,
    dropshipAddress,
    dropshipItems,
    date: new Date().toLocaleString()
  };

  localStorage.setItem('currentOrder', JSON.stringify(order));
  window.location.href = 'payment.html';
});

renderCart();
