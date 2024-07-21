import * as constand from "../constants.js";
import { loadPage } from "../router.js";
import { fetchAPI } from "./api.js";

console.log("Edit Profile page")

const profileForm = document.getElementById("profileForm");

function countCharacter() {
  const textArea = document.getElementById("bio");
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

function validateInput(input) {
  let returnValue = true;

  if (input.password !== input.password2) {
    const errMsg = profileForm.querySelector("#password2-error");
    errMsg.previousElementSibling.style.marginBottom = "2px";
    errMsg.style.display = "block";
    returnValue = false;
  }
  return returnValue;
}


profileForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const input = {
    displayName: formData.get("displayName"),
    email: formData.get("email"),
    password: formData.get("password"),
    password2: formData.get("password2"),
    bio: formData.get("bio"),
  };

  if (!validateInput(input)) {
    console.error("Invalid input!");
    return ;
  }

  const body = {
    display_name: input.displayName,
    email: input.email,
    password: input.password,
    bio: input.bio,
  }
  console.log(body);
  
  try {
    const response = await fetchAPI("PATCH", constand.API_MY_PROFILE, {
      auth: true,
      body: body,
    });

    if (!response.ok) {
      if (response.status === 409) { // data conflict
        const errMsg = signupForm.querySelector("#displayName-error");
        errMsg.previousElementSibling.style.marginBottom = "2px";
        errMsg.style.display = "block";
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    console.log(data);
    loadPage("/profile");
  } catch (error) {
    console.error(error.message);
  }
});

countCharacter();
displayProfilePicture();

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