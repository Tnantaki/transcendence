import * as constant from "./constants.js"
import { fetchAPI } from "./api.js"

const formRegister = document.getElementById('login-form');
const popOutText = document.getElementById('popOutErrMsg');

formRegister.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Create JSON object
  const formData = new FormData(event.target);
  const body = {
    username: formData.get('username'),
    password: formData.get('password'),
  };

  try {
    const data = await fetchAPI("POST", constant.API_LOGIN, {
      auth: false,
      body: body,
    });

    localStorage.setItem("token", data.token);
    window.location.href = '/';
    console.log('Success:', data);
  } catch (error) {
    console.error("Failed to fetch API:", error);
    popOutText.style.display = 'block';

    // Clear input
    event.target.querySelectorAll('.login-input').forEach((input) => {
      input.value = '';
    });
  }
});
