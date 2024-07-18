import { fetchUserProfile } from "./api.js"

console.log("Viewing main page.");

async function getProfile() {
  try {
    console.log("fetching Profile data");
    const profileValue = await fetchUserProfile();
    const profile = document.getElementById("blockProfile");

    profile.querySelector("#profilePicture").src = profileValue["image"];
    profile.querySelector("#profileName").innerHTML = profileValue["avatar_name"];
    
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
  }
}

getProfile();