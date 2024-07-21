// document.addEventListener("DOMContentLoaded", () => {
// });

function countCharacter() {
  const textArea = document.getElementById("bioInput");
  const charCount = document.querySelector(".char-count");

  textArea.addEventListener("input", () => {
    const currentLength = textArea.value.length;
    charCount.textContent = `${currentLength}/200`
  });
}

function displayProfilePicture() {
  const fileInput = document.getElementById("file");
  const profilePicture = document.getElementById("profile-picture");

  fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        profilePicture.src = e.target.result;
      }
      reader.readAsDataURL(file);
    } else {
      profilePicture.src = "../static/svg/default-user-picture.svg";
    }
  });
}

async function editProfile() {
  try {
    const formUpload = document.getElementById("upload-form");
    const Formbody = new FormData();
    // const profileValue = await fetchProfileById(id);
    // await 
  } catch (error) {
    console.error("Failed update profile:", error);
  }
}

countCharacter();
displayProfilePicture();
editProfile();
// TODO: update api
// const formUpload = document.getElementById("upload-form");
// formUpload.addEventListener("submit", (event) => {
//   event.preventDefault();

//   const formData = new FormData();
//   const imageFile = document.getElementById("imageFile").files[0];
//   formData.append("file", imageFile);
//   alert("I"m uploader");

//   fetch(apiURL + "/api/user/register", {
//     method: "POST",
//     body: formData,
//   })
//   .then(response => response.json())
//   .then(data => {
//     console.log("Success:", data);
//     alert("Image uploaded successfully.");
//   })
//   .catch(error => {
//     console.error("Error:", error);
//     alert("Failed to upload image!");
//   });
// });