document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const emailInput = form.querySelector('input[name="email"]');
    const nextBtn = document.getElementById("nextBtn");
  
    form.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent form submission for validation
  
      const emailValue = emailInput.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email pattern
  
      if (!emailValue) {
        alert("Email address cannot be empty!");
        return;
      }
  
      if (!emailPattern.test(emailValue)) {
        alert("Please enter a valid email address!");
        return;
      }
  
      // If email is valid, you can submit the form or perform further actions
      alert("Email is valid. Logged in successfully!");
      // form.submit(); // Uncomment this line to allow actual form submission
    });
  });
  