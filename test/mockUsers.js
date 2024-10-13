const BACKEND_URL = "http://localhost:8001/api/";

const API_SIGNUP = BACKEND_URL + "i/uac/register/";

async function registerUser(name) {
  const body = {
    username: name,
    password: "1234",
    email: name + "@cat.com",
  };
  try {
    const res = await fetch(API_SIGNUP, {method: 'POST', body: JSON.stringify(body)})
    if (res.status >= 300) {
      throw new Error(`Error status: ${res.status}`)
    }
    console.log("register success")
    console.log(await res.json())
  } catch (error) {
    console.log(error.message) 
  }
}


for (let i = 1; i <= 10; i++) {
  await registerUser("test" + i)
}