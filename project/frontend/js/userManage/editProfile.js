import * as constant from "../constants.js";
import { loadPage } from "../router.js";
import { fetchAPI, fetchUploadFile } from "./api.js";

console.log("Edit Profile page")

const profileForm = document.getElementById("profileForm");
const profilePicture = document.getElementById("profile-picture");

function countCharacter() {
  const textArea = document.getElementById("bio");
  const charCount = document.querySelector(".char-count");

  textArea.addEventListener("input", () => {
    const currentLength = textArea.value.length;
    charCount.textContent = `${currentLength}/200`
  });
}

function uploadProfilePicture() {
  const fileInput = document.getElementById("file");

  fileInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetchUploadFile("POST", constant.API_MY_PROFILE + "profile/", {
          auth: true,
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          profilePicture.src = e.target.result;
        }
        reader.readAsDataURL(file);
      } catch (error) {
        console.error(error.message);
      }
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

function removeEmptyFields(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => 
      value !== null && value !== undefined && value !== ''
    )
  );
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

  const body = removeEmptyFields({
    display_name: input.displayName,
    email: input.email,
    password: input.password,
    bio: input.bio,
  });
  
  try {
    const response = await fetchAPI("PATCH", constant.API_MY_PROFILE, {
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

async function getProfile() {
  try {
    const response = await fetchAPI("GET", constant.API_MY_PROFILE, { auth: true, });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const profileValue = await response.json();

    if (profileValue["profile"])
      profilePicture.src = "/api" + profileValue["profile"]
    if (profileValue["display_name"])
      profileForm.querySelector("#displayName").value = profileValue["display_name"];
    if (profileValue["email"])
      profileForm.querySelector("#email").value = profileValue["email"];
    if (profileValue["bio"])
      profileForm.querySelector("#bio").value = profileValue["bio"];
  } catch (error) {
    console.error(error.message);
  }
}

getProfile();
countCharacter();
uploadProfilePicture();