let loginEmail = document.getElementById("loginEmail");
let loginPassword = document.getElementById("loginPassword");
let loginForm = document.getElementById("loginForm");
let loginMessageModal = document.getElementById("loginMessageModal");
let loginModalMessage = document.getElementById("loginModalMessage");
let closeLoginModal = document.getElementsByClassName("close")[0];

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    let emailValue = loginEmail.value;
    let passwordValue = loginPassword.value;

    // Get the existing user details from localStorage
    let userArray = JSON.parse(localStorage.getItem("userDetails")) || [];

    // Check if the user exists with matching email and password
    let validUser = userArray.some(user => user.name === emailValue && user.password === passwordValue);

    if (validUser) {
        // Redirect to home page
        window.location.href = "home.html";  // Redirect to home page or any desired URL
    } else {
        // Display error message in the modal
        loginModalMessage.innerHTML = "Error: Invalid email or password!";
        loginMessageModal.style.display = "block";
    }
});

// Close the modal when the 'x' is clicked
closeLoginModal.onclick = function() {
    loginMessageModal.style.display = "none";
}

// Close the modal if the user clicks outside of it
window.onclick = function(event) {
    if (event.target === loginMessageModal) {
        loginMessageModal.style.display = "none";
    }
}


document.addEventListener("DOMContentLoaded", function () {
    let message = sessionStorage.getItem("signupMessage");
  
    if (message) {
      // Display the message to the user
      let messageBox = document.getElementById("messageBox");
      messageBox.innerHTML = message;
      messageBox.style.display = "block";
  
      // Clear the message after displaying it
      sessionStorage.removeItem("signupMessage");
    }
  });
  