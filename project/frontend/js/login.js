import * as constant from './constants.js';

const formRegister = document.getElementById('login-form');
const popOutText = document.getElementById('popOutErrMsg');

formRegister.addEventListener('submit', (event) => {
  event.preventDefault();

  // Create JSON object
  const formData = new FormData(event.target);
  const data = {
    username: formData.get('username'),
    password: formData.get('password'),
  };

  // send post requets with JSON data
  fetch(constant.API_LOGIN, {
    method: 'POST',
    headers: {
      'content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    localStorage.setItem("token", data.token);
    window.location.href = '/';
    console.log('Success:', data);
  })
  .catch(error => {
    console.error('Error:', error);
    popOutText.style.display = 'block';
  });

  // Clear input
  event.target.querySelectorAll('.login-input').forEach((input) => {
    input.value = '';
  });
});

