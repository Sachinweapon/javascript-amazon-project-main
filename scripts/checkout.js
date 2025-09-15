import {renderOrderSummary} from './checkout/orderSummary.js';
import {renderPaymentSummary} from './checkout/paymentSummary.js';
// import '../data/cart-class.js';

renderOrderSummary();
renderPaymentSummary();
document.getElementById("dropship-btn").addEventListener("click", () => {
  window.location.href = "dropship.html";
});
