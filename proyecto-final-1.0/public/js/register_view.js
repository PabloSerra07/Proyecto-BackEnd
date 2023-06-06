const passwordForm = document.getElementById("registerForm");
const password1Input = document.getElementById("password");
const password2Input = document.getElementById("password2");

function verifyCoincidence_password(event) {
  const password1 = password1Input.value;
  const password2 = password2Input.value;

  if (password1 !== password2) {
    event.preventDefault();
    password1Input.style.backgroundColor = "#F08080";
    password2Input.style.backgroundColor = "#F08080";
  } else {
    password1Input.style.backgroundColor = "";
    password2Input.style.backgroundColor = "";
  }
}

passwordForm.addEventListener("submit", verifyCoincidence_password);