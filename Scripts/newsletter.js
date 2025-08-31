document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('mc-embedded-subscribe-form');
  if (!form) return; // prevent errors if form not found

  form.addEventListener('submit', function(e) {
    // This will NOT block Mailchimp's default behavior
    // Only useful if you want to show your own success popup
    e.preventDefault();

    const email = document.getElementById('mce-EMAIL').value.trim();
    if (!email) return;

    console.log("Newsletter signup:", email);

    alert("Success! Thanks for subscribing.");
    form.reset();
  });
});
