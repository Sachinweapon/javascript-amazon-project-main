import { cart } from '../../data/cart.js';
import { getProduct } from '../../data/products.js';
import { getDeliveryOption } from '../../data/deliveryOptions.js';
import { formatCurrency } from '../utils/money.js';

export function renderPaymentSummary() {
  // Calculate totals
  let productPriceCents = 0;
  let shippingPriceCents = 0;

  cart.forEach(item => {
    const product = getProduct(item.productId);
    productPriceCents += (product?.priceCents || 0) * item.quantity;

    const deliveryOption = getDeliveryOption(item.deliveryOptionId);
    shippingPriceCents += deliveryOption?.priceCents || 0;
  });

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = totalBeforeTaxCents * 0.1;
  const totalCents = totalBeforeTaxCents + taxCents;

  // Render HTML
  const paymentSummaryHTML = `
    <div class="payment-summary-title">Order Summary</div>

    <div class="payment-summary-row">
      <div>Items :</div>
      <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">$${formatCurrency(shippingPriceCents)}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${formatCurrency(totalBeforeTaxCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">$${formatCurrency(totalCents)}</div>
    </div>

    <div>
      <button id="placeOrderBtn" class="place-order-btn">Place Your Order</button>

      <div id="addressDropdown" class="address-dropdown">
        <h3>Enter Shipping Address</h3>
        <textarea id="shippingAddress" placeholder="Enter full address..." rows="4"></textarea>
        <button id="confirmAddressBtn" class="confirm-btn">Confirm Address</button>
      </div>
    </div>

    <button id="dropship-btn" class="button-primary place-order-btn">Dropshipping Options</button>
  `;

  document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;

  // -----------------------------
  // Event Listeners
  // -----------------------------
  const placeOrderBtn = document.getElementById("placeOrderBtn");
  const addressDropdown = document.getElementById("addressDropdown");
  const confirmAddressBtn = document.getElementById("confirmAddressBtn");
  const shippingAddressInput = document.getElementById("shippingAddress");
  const dropshipBtn = document.getElementById("dropship-btn");

  // Toggle address input
  placeOrderBtn.addEventListener("click", () => {
    addressDropdown.style.display = addressDropdown.style.display === 'block' ? 'none' : 'block';
  });

  // Confirm address and save enriched order
  confirmAddressBtn.addEventListener("click", () => {
    const address = shippingAddressInput.value.trim();
    if (!address) {
      alert("Please enter your address before proceeding.");
      return;
    }

    const selectedDeliveryRadio = document.querySelector(
      'input[name^="delivery-option"]:checked'
    );
    const deliveryOptionId = selectedDeliveryRadio ? selectedDeliveryRadio.value : null;

    // Enrich cart items with full product info
    const enrichedCart = cart.map(item => {
      const product = getProduct(item.productId) || {};
      return {
        productId: item.productId,
        name: product.name || 'Product',
        image: product.image || 'images/placeholder.png',
        priceCents: product.priceCents || 0,
        quantity: item.quantity,
        deliveryOptionId: deliveryOptionId
      };
    });

    const currentOrder = {
      items: enrichedCart,
      address,
      deliveryOption: deliveryOptionId,
      paymentMethod: null,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem("cart", JSON.stringify(enrichedCart));
    localStorage.setItem("currentOrder", JSON.stringify(currentOrder));

    window.location.href = "payment.html";
  });

  // Dropshipping flow
  if (dropshipBtn) {
    dropshipBtn.addEventListener("click", () => {
      window.location.href = "dropship.html";
    });
  }
}
