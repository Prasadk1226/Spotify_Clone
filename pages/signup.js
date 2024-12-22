let container = document.getElementsByClassName("container")[0];
let signinEmail = document.getElementById("signinEmail");
let signinPassword = document.getElementById("signinPassword");
let myForm = document.getElementById("myForm");
let messageModal = document.getElementById("messageModal");
let modalMessage = document.getElementById("modalMessage");
let closeModal = document.getElementsByClassName("close")[0];


let stopCountdown = false; // Flag to control countdown

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
  let userExists = userArray.some((user) => user.name === emailValue);

  if (userExists) {
    // Store the message in localStorage or sessionStorage
    // sessionStorage.setItem(
    //   "signupMessage",
    //   "You have already signed up. Please log in."
    // );

    let countdown = 10; // Starting countdown value
    let exists = document.createElement("h1");
    let text = document.createElement("h3");
    exists.innerText = `User already exists. Log in to listen to your favorite songs.`;
    text.innerText = ` Redirecting you to LogIn page in ${countdown} seconds.`;
    messageModal.style.display = "block";
    modalMessage.appendChild(exists);
    modalMessage.appendChild(text);

    stopCountdown = false; // Reset the flag

    // Update the countdown every second
    let interval = setInterval(() => {
      if (stopCountdown) {
        clearInterval(interval); // Stop the interval if the user closes the modal
        return;
      }

      countdown -= 1; // Decrease the countdown value
      exists.innerText = `User already exists. Log in to listen to your favorite songs.`;
      text.innerText = `Redirecting you to LogIn page in ${countdown} seconds.`;
      modalMessage.appendChild(exists);
      modalMessage.appendChild(text);
      // modalMessage.innerHTML = `User already exists. Log in to listen to your favorite songs. Redirecting you to LogIn page in ${countdown} seconds.`;

      if (countdown <= 0) {
        clearInterval(interval); // Stop the interval when countdown reaches 0
        messageModal.style.display = "none"; // Hide the modal
        // Redirect to the login page
        window.location.href = "login.html"; // Make sure to point to your actual login page
      }
    }, 1000); // Update every 1 second
  } else {
    userArray.push(userData);
    localStorage.setItem("userDetails", JSON.stringify(userArray));

    let countdown = 10; // Starting countdown value
    modalMessage.innerHTML = `Redirecting you to Login Page in ${countdown} seconds.`;
    messageModal.style.display = "block";

    stopCountdown = false; // Reset the flag

    // Update the countdown every second
    let interval = setInterval(() => {
      if (stopCountdown) {
        clearInterval(interval); // Stop the interval if the user closes the modal
        return;
      }

      countdown -= 1; // Decrease the countdown value
      modalMessage.innerHTML = `Signup successful! Redirecting you to Login Page in ${countdown} seconds.`;

      if (countdown <= 0) {
        clearInterval(interval); // Stop the interval when countdown reaches 0
        messageModal.style.display = "none"; // Hide the modal
        // Redirect to the login page
        window.location.href = "login.html"; // Make sure to point to your actual login page
      }
    }, 1000); // Update every 1 second

    // Clear form
    signinEmail.value = "";
    signinPassword.value = "";
  }
});

// Close modal
closeModal.onclick = function () {
  stopCountdown = true; // Stop the countdown when the close button is clicked
  messageModal.style.display = "none"; // Hide the modal
  modalMessage.innerHTML = "";
};

// Close modal if clicked outside
window.onclick = function (event) {
  if (event.target === messageModal) {
    stopCountdown = true; // Stop the countdown if the modal is closed by clicking outside
    messageModal.style.display = "none";
    modalMessage.innerHTML = "";
  }
};

// Loader part for redirecting the page.
let loader = document.getElementsByClassName("loaderDiv")[0];
let loginText = document.getElementById("login-text");
loader.style.display = "none";

loginText.onclick = () => {
  container.style.display = "none";
  loader.style.display = "flex";

  setTimeout(() => {
    window.location.href = "login.html";
  }, 5000);
};

