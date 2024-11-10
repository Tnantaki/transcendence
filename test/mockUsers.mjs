import { mockFriend } from "./mockFriend.mjs";

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
    const data = await res.json()
    return {username: data.username, id: data.id}
  } catch (error) {
    console.log(error.message) 
  }
}

async function mockUser(username) {
  const res1 = await registerUser(username)
  console.log("Create", res1)
  for (let i = 1; i <= 10; i++) {
    const result = await registerUser("test" + i)
    console.log("Create", result)
  }

  await mockFriend(username)
}

mockUser('mos123')
