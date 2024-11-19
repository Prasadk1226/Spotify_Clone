// document.addEventListener("DOMContentLoaded", function () {
//     const form = document.querySelector("form");
//     const emailInput = form.querySelector('input[name="email"]');
//     const nextBtn = document.getElementById("nextBtn");
  
//     form.addEventListener("submit", function (event) {
//       event.preventDefault(); // Prevent form submission for validation
  
//       const emailValue = emailInput.value.trim();
//       const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email pattern
  
//       if (!emailValue) {
//         alert("Email address cannot be empty!");
//         return;
//       }
  
//       if (!emailPattern.test(emailValue)) {
//         alert("Please enter a valid email address!");
//         return;
//       }
  
//       // If email is valid, you can submit the form or perform further actions
//       // alert("Email is valid. Logged in successfully!");
//       // form.submit(e); e.preventDefault(); // Uncomment this line to allow actual form submission
//     });
//   });
//   // let signinEmail = document.getElementById("signinEmail")
//   // let signinPassword = document.getElementById("signinPassword")
//   // let myForm = document.getElementById("myForm")

//   // myForm.addEventListener("submit",(event)=>{
//   //   event.preventDefault()
//   //   let signinEmail = document.getElementById("signinEmail");
//   //   let signinPassword = document.getElementById("signinPassword");
//   //   let userData = {name: signinEmail.value, password:signinPassword.value};
//   //   let userArray = JSON.parse(localStorage.getItem("userDetails"))||[];
//   //   userArray.push(userData);
//   //   localStorage.setItem("userDetails",JSON.stringify(userArray));
//   // })

//   let signinEmail = document.getElementById("signinEmail");
// let signinPassword = document.getElementById("signinPassword");
// let myForm = document.getElementById("myForm");
// let messageModal = document.getElementById("messageModal");
// let modalMessage = document.getElementById("modalMessage");
// let closeModal = document.getElementsByClassName("close")[0];

// myForm.addEventListener("submit", (event) => {
//     event.preventDefault();

//     let emailValue = signinEmail.value;
//     let passwordValue = signinPassword.value;
//     let userData = { name: emailValue, password: passwordValue };

//     // Get the existing user details from localStorage
//     let userArray = JSON.parse(localStorage.getItem("userDetails")) || [];

//     // Check if the user already exists
//     let userExists = userArray.some(user => user.name === emailValue && user.password === passwordValue);

//     if (userExists) {
//         // Display error message in the modal
//         modalMessage.innerHTML = "Error: User with this email and password already exists!";
//         messageModal.style.display = "block";
//     } else {
//         // Add the new user and save to localStorage
//         userArray.push(userData);
//         localStorage.setItem("userDetails", JSON.stringify(userArray));

//         // Display success message in the modal
//         modalMessage.innerHTML = "Signup successful!";
//         messageModal.style.display = "block";
//     }
// });

// // Close the modal when the 'x' is clicked
// closeModal.onclick = function() {
//     messageModal.style.display = "none";
// }

// // Close the modal if the user clicks outside of it
// window.onclick = function(event) {
//     if (event.target === messageModal) {
//         messageModal.style.display = "none";
//     }
// }

  
let signinEmail = document.getElementById("signinEmail");
let signinPassword = document.getElementById("signinPassword");
let myForm = document.getElementById("myForm");
let messageModal = document.getElementById("messageModal");
let modalMessage = document.getElementById("modalMessage");
let closeModal = document.getElementsByClassName("close")[0];

myForm.addEventListener("submit", (event) => {
  event.preventDefault();

  let emailValue = signinEmail.value;
  let passwordValue = signinPassword.value;

  // Password validation
  if (passwordValue.length < 6) {
    modalMessage.innerHTML = "Password must be at least 6 characters long.";
    messageModal.style.display = "block";
    return;
  }

  let userData = { name: emailValue, password: passwordValue };

  // Get the existing user details from localStorage
  let userArray = JSON.parse(localStorage.getItem("userDetails")) || [];

  // Check if the user already exists (only by email)
  let userExists = userArray.some(user => user.name === emailValue);

  if (userExists) {
    // Store the message in localStorage or sessionStorage
    sessionStorage.setItem("signupMessage", "You have already signed up. Please log in.");
    // modalMessage.innerHTML = "User already exists. Log in to listen your fav songs.";
    // messageModal.style.display = "block";
    // Redirect to the login page
    window.location.href = "login.html"; // Make sure to point to your actual login page
  } else {
    userArray.push(userData);
    localStorage.setItem("userDetails", JSON.stringify(userArray));

    modalMessage.innerHTML = "Signup successful!";
    messageModal.style.display = "block";

    // Clear form
    signinEmail.value = "";
    signinPassword.value = "";
  }
});

// Close modal
closeModal.onclick = function() {
  messageModal.style.display = "none";
};

// Close modal if clicked outside
window.onclick = function(event) {
  if (event.target === messageModal) {
    messageModal.style.display = "none";
  }
};
