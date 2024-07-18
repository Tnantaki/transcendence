import { postProfile } from "./api.js";

document.addEventListener('DOMContentLoaded', () => {
  const formRegister = document.getElementById('register-form');
  formRegister.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Create JSON object
    const formData = new FormData(event.target);
    const data = {
      username: formData.get('username'),
      password: formData.get('password'),
      avatarName: formData.get('avatarName'),
    };

    try {
      const result = await postProfile(data);
      console.log("Signup Success:", result);
    } catch (error) {
      console.error("Failed Signup:", error);
    }
  });
});
