export async function fetchAPI(method, url, options = {}) {
  const {
    auth = true,
    headers = {},
    body,
    throwErrors = true,
    ...otherOptions
  } = options;

  const myHeaders = new Headers(headers);

  if (auth) {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Error: Can't get token.")
    }
    myHeaders.append("Authorization", "Bearer " + token);
  }

  if (body && !myHeaders.has("Content-Type")) {
    console.log("get it");
    myHeaders.append('Content-Type', 'application/json');
  }

  try {
    const response = await fetch(url, {
      method: method,
      Headers: myHeaders,
      body: body ? JSON.stringify(body) : undefined,
      ...otherOptions
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error: fetching user profile", error);
    throw error;
  }
}

// export async function postProfile(data) {
//   try {
//     const response = await fetch(constant.API_SIGNUP, {
//       method: "POST",
//       headers: {
//         'content-Type': 'application/json'
//       },
//       body: JSON.stringify(data)
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
    
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.log("Error: fetching", error);
//     throw error;
//   }
// }
