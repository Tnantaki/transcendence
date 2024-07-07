const apiURL = 'http://localhost:8000';

const formUpload = document.getElementById('upload-form');
formUpload.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData();
  const imageFile = document.getElementById('imageFile').files[0];
  formData.append('file', imageFile);
  alert("I'm uploader");

  fetch(apiURL + '/api/user/register', {
    method: 'POST',
    body: formData,
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
    alert('Image uploaded successfully.');
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Failed to upload image!');
  });
});
