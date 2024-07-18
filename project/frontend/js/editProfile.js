// document.addEventListener('DOMContentLoaded', () => {
// });

function countCharacter() {
  const textArea = document.getElementById('bioInput');
  const charCount = document.querySelector('.char-count');

  textArea.addEventListener('input', () => {
    const currentLength = textArea.value.length;
    charCount.textContent = `${currentLength}/200`
  });
}

async function editProfile() {
  try {
    const formUpload = document.getElementById('upload-form');
    const Formbody = new FormData();
    // const profileValue = await fetchProfileById(id);
    // await 
  } catch (error) {
    console.error("Failed update profile:", error);
  }
}

countCharacter();
editProfile();
// TODO: update api
// const formUpload = document.getElementById('upload-form');
// formUpload.addEventListener('submit', (event) => {
//   event.preventDefault();

//   const formData = new FormData();
//   const imageFile = document.getElementById('imageFile').files[0];
//   formData.append('file', imageFile);
//   alert("I'm uploader");

//   fetch(apiURL + '/api/user/register', {
//     method: 'POST',
//     body: formData,
//   })
//   .then(response => response.json())
//   .then(data => {
//     console.log('Success:', data);
//     alert('Image uploaded successfully.');
//   })
//   .catch(error => {
//     console.error('Error:', error);
//     alert('Failed to upload image!');
//   });
// });