const mainRadios = document.querySelectorAll('input[name="paymentMain"]');
const upiOptions = document.getElementById('upiOptions');
const payBtn = document.getElementById('payBtn');

mainRadios.forEach(r => {
  r.addEventListener('change', () => {
    if (r.value === 'upi') {
      upiOptions.style.display = 'block';
    } else {
      upiOptions.style.display = 'none';
      // clear UPI selection if switching to COD
      document.querySelectorAll('input[name="upiApp"]').forEach(app => app.checked = false);
      document.getElementById('upiId').value = '';
    }
  });
});

payBtn.addEventListener('click', () => {
  const selectedMain = document.querySelector('input[name="paymentMain"]:checked');
  if (!selectedMain) {
    alert("Please select a payment method.");
    return;
  }

  let paymentMethod = '';

  if (selectedMain.value === 'upi') {
    const selectedApp = document.querySelector('input[name="upiApp"]:checked');
    const upiId = document.getElementById('upiId').value.trim();
    if (!selectedApp || !upiId) {
      alert("Please select a UPI app and enter your UPI ID.");
      return;
    }
    paymentMethod = `${selectedApp.value} (${upiId})`;
  } else if (selectedMain.value === 'cod') {
    paymentMethod = 'Cash on Delivery';
  }

  const currentOrder = JSON.parse(localStorage.getItem('currentOrder') || '{}');
  currentOrder.payment = paymentMethod;
  localStorage.setItem('currentOrder', JSON.stringify(currentOrder));
  window.location.href = 'ordersuccess.html';
});
