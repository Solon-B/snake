document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");

  // Add an event listener to the form for saving the name
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting

    // Get the name from the input field
    const nameInput = document.getElementById("name");
    const name = nameInput.value;

    // Save the name in local storage
    localStorage.setItem("username", name);

    // Redirect to the next page (play_hard.html)
    window.location.href = "difficulty.html";
  });
});
