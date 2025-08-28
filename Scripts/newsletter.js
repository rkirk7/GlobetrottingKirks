
document.getElementById('newsletter-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const email = document.getElementById('emailInput').value.trim();
  if (!email) return;

  // TODO: Send email to backend or Mailchimp API
  console.log("Newsletter signup:", email);

  // Show success message
  document.getElementById('form-message').classList.remove('d-none');
  document.getElementById('emailInput').value = '';
});
