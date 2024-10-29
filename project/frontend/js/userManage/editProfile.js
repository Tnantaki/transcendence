import * as constant from "../constants.js";
import { loadPage } from "../router.js";
import { fetchAPI } from "./api.js";
import { createProfilePicture, getMyProfile } from "../services/profileService.js";

const profileForm = document.getElementById("profileForm");
const profilePicture = document.getElementById("profile-picture");
// const email2FA = document.getElementById("2fa-email");
// const inputCode = document.querySelectorAll(".input-box");
// const sendForm = document.getElementById("edit-continue");
// const resendCode = document.getElementById("edit-resend-code");

getProfile();
countCharacter();
uploadProfilePicture();

profileForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  sendEditProfileForm(event)
});

function countCharacter() {
  const textArea = document.getElementById("bio");
  const charCount = document.querySelector(".char-count");

  textArea.addEventListener("input", () => {
    const currentLength = textArea.value.length;
    charCount.textContent = `${currentLength}/200`
  });
}

function uploadProfilePicture() {
  const fileInput = document.getElementById("fileInput");

  fileInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const profileValue = await createProfilePicture(formData)
      profilePicture.src = "/api" + profileValue["profile"];
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

async function sendEditProfileForm(event) {
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
};

async function getProfile() {
  const profileValue = await getMyProfile()

  if (profileValue["profile"])
    profilePicture.src = "/api" + profileValue["profile"]
  if (profileValue["display_name"])
    profileForm.querySelector("#displayName").value = profileValue["display_name"];
  if (profileValue["email"]) {
    profileForm.querySelector("#email").value = profileValue["email"];
    // email2FA.innerHTML = profileValue["email"];
  }
  if (profileValue["bio"]) {
    profileForm.querySelector("#bio").value = profileValue["bio"];
    const charCount = document.querySelector(".char-count");
    charCount.textContent = `${profileValue["bio"].length}/200`
  }
}

// --------------- Cancel ---------------
// profileForm.addEventListener("submit", async (event) => {
//   event.preventDefault();
//   console.log("send 2fa to backend")
// });
// resendCode.addEventListener("click", async (event) => {
//   console.log("send 2fa to backend")
// })
// For 2FA Popup : jump focus input behavior
// function add2FAInputFocus() {
//   inputCode.forEach((input, index) => {
//     input.addEventListener("input", () => {
//       if (input.value.length === 1) {
//         if (index < inputCode.length - 1) {
//           inputCode[index + 1].focus();
//         }
//       }
//     });
//     input.addEventListener("keydown", (event) => {
//       if (event.key === "Backspace" && input.value.length === 0)
//         if (index > 0) {
//           inputCode[index - 1].focus();
//         }
//     });
//   });
// }
// document.getElementById('2FA').addEventListener('shown.bs.modal', function () {
//   inputCode[0].focus()
// });
// sendForm.addEventListener("click", (event) => {
//   let code = ""
//   inputCode.forEach((input) => {
//     code += input.value
//   })
//   console.log("sendProfile")
//   console.log(code)
//   sendEditProfileForm(event, code)
// })

// add2FAInputFocus();