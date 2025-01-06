// let loginEmail = document.getElementById("loginEmail");
// let loginPassword = document.getElementById("loginPassword");
// let loginForm = document.getElementById("loginForm");
// let loginMessageModal = document.getElementById("loginMessageModal");
// let loginModalMessage = document.getElementById("loginModalMessage");
// let closeLoginModal = document.getElementsByClassName("close")[0];

// loginForm.addEventListener("submit", (event) => {
//     event.preventDefault();

//     let emailValue = loginEmail.value;
//     let passwordValue = loginPassword.value;

//     // Get the existing user details from localStorage
//     let userArray = JSON.parse(localStorage.getItem("userDetails")) || [];

//     // Check if the user exists with matching email and password
//     let validUser = userArray.some(user => user.name === emailValue && user.password === passwordValue);

//     if (validUser) {
//         // Redirect to home page
//         window.location.href = "home.html";  // Redirect to home page or any desired URL
//     } else {
//         // Display error message in the modal
//         loginModalMessage.innerHTML = "Error: Invalid email or password!";
//         loginMessageModal.style.display = "block";
//     }
// });

// // Close the modal when the 'x' is clicked
// closeLoginModal.onclick = function() {
//     loginMessageModal.style.display = "none";
// }

// // Close the modal if the user clicks outside of it
// window.onclick = function(event) {
//     if (event.target === loginMessageModal) {
//         loginMessageModal.style.display = "none";
//     }
// }


// document.addEventListener("DOMContentLoaded", function () {
//     let message = sessionStorage.getItem("signupMessage");
  
//     if (message) {
//       // Display the message to the user
//       let messageBox = document.getElementById("messageBox");
//       messageBox.innerHTML = message;
//       messageBox.style.display = "block";
  
//       // Clear the message after displaying it
//       sessionStorage.removeItem("signupMessage");
//     }
//   });
  

let loginEmail = document.getElementById("loginEmail");
let loginPassword = document.getElementById("loginPassword");
let loginForm = document.getElementById("loginForm");
let loginMessageModal = document.getElementById("loginMessageModal");
let loginModalMessage = document.getElementById("loginModalMessage");
let closeLoginModal = document.getElementsByClassName("close")[0];
let loader = document.getElementsByClassName("loaderDiv")[0];
let loginText = document.getElementById("login-text");
let container = document.getElementsByClassName("container")[0];

// Hide loader initially
loader.style.display = "none";

// Login form submission
loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  let emailValue = loginEmail.value.trim(); // Trim whitespace
  let passwordValue = loginPassword.value.trim(); // Trim whitespace

  // Validate empty fields
  if (!emailValue || !passwordValue) {
    loginModalMessage.innerHTML = "Error: Please fill in both fields!";
    loginMessageModal.style.display = "block";
    return;
  }

  // Get the existing user details from localStorage
  let userArray = JSON.parse(localStorage.getItem("userDetails")) || [];

  // Check if the user exists with matching email and password
  let validUser = userArray.some(
    (user) => user.name.toLowerCase() === emailValue.toLowerCase() && user.password === passwordValue
  );

  if (validUser) {
    container.style.display = "none";
    loader.style.display = "flex";

    // Redirect to home page
    setTimeout(() => {
      window.location.href = "../index1.html";
    }, 2500);
  } else {
    // Display error message in the modal
    loginModalMessage.innerHTML = "Error: Invalid USER NAME or PASSWORD!";
    loginMessageModal.style.display = "block";
  }
});

// Close the modal when the 'x' is clicked
closeLoginModal.onclick = function () {
  loginMessageModal.style.display = "none";
};

// Close the modal if the user clicks outside of it
window.onclick = function (event) {
  if (event.target === loginMessageModal) {
    loginMessageModal.style.display = "none";
  }
};

// Display the signup message from sessionStorage
document.addEventListener("DOMContentLoaded", function () {
  let message = sessionStorage.getItem("signupMessage");

  if (message) {
    let messageBox = document.getElementById("messageBox");
    if (messageBox) {
      messageBox.innerHTML = message;
      messageBox.style.display = "block";

      // Clear the message after displaying it
      sessionStorage.removeItem("signupMessage");
    }
  }
});

// Redirect to signup page with loader
loginText.onclick = () => {
  container.style.display = "none";
  loader.style.display = "flex";

  setTimeout(() => {
    window.location.href = "signup.html";
  }, 2000); // Reduced timeout to 2 seconds
};
