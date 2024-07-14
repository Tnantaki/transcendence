const formRegister = document.getElementById('login-form');
const popOutText = document.getElementById('popOutErrMsg');

formRegister.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.target;

  // Create JSON object
  const formData = new FormData(event.target);
  const data = {
    username: formData.get('username'),
    password: formData.get('password'),
  };

  // send post requets with JSON data
  fetch(apiURL + '/api/user/login', {
    method: 'POST',
    headers: {
      'content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
    // window.location.href = 'http://localhost:' TODO: redirect page
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

