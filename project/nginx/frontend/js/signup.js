const formRegister = document.getElementById('register-form');
formRegister.addEventListener('submit', (event) => {
  event.preventDefault();

  // Create JSON object
  const formData = new FormData(event.target);
  const data = {
    username: formData.get('username'),
    password: formData.get('password'),
    avatarName: formData.get('avatarName'),
  };

  // send post requets with JSON data
  fetch(apiURL + '/api/user/register', {
    method: 'POST',
    headers: {
      'content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
    alert('Register user succesfully.');
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Failed to register!');
  });
});
