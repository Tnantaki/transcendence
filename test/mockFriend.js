const BACKEND_URL = "http://localhost:8001/api/";

const API_LOGIN = BACKEND_URL + "i/uac/login/";
const API_MY_PROFILE = BACKEND_URL + "i/uac/me/";
const API_FRIEND_SENT_REQ = BACKEND_URL + "i/uac/friend-request/";

async function getMe(username) {
  const token = await login(username)
  try {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append('Content-Type', 'application/json');
    const res = await fetch(API_MY_PROFILE, {
      method: 'GET', 
      headers: myHeaders
    })
    if (res.status >= 300) {
      throw new Error(`Error status: ${res.status}`)
    }
    const data = await res.json()
    return data
  } catch (error) {
    console.log(error.message) 
  }
  return ""
}

async function login(username) {
  const body = {
    username,
    password: "1234",
  };
  try {
    const res = await fetch(API_LOGIN, {
      method: 'POST',
      body: JSON.stringify(body)
    })
    if (res.status >= 300) {
      throw new Error(`Error status: ${res.status}`)
    }
    const data = await res.json()
    return data.token
  } catch (error) {
    console.log(error.message) 
  }
  return ""
}

async function sendFriendRequest(username, id) {
  const token = await login(username)
  const myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + token);
  myHeaders.append('Content-Type', 'application/json');
  const body = {
    receiver_id: id,
  };
  try {
    const res = await fetch(API_FRIEND_SENT_REQ, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: myHeaders
    })
    if (res.status >= 300) {
      throw new Error(`Error status: ${res.status}`)
    }
    const data = await res.json()
    return data
  } catch (error) {
    console.log(error.message) 
  }
  return ""
}

async function test() {
  // const data = await getMe("mos123")
  const data = await getMe("test2")
  for (let i = 1; i <= 10; i++) {
    const result = await sendFriendRequest("test" + i, data.id)
    console.log(result)
  }
}

test()
