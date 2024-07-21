export async function fetchAPI(method, url, options = {}) {
  const {
    auth = false,
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
    myHeaders.append('Content-Type', 'application/json');
  }
  console.log(url);
  console.log("mytoken:", myHeaders.get("Authorization"));

  try {
    const response = await fetch(url, {
      method: method,
      Headers: myHeaders,
      body: body ? JSON.stringify(body) : undefined,
      ...otherOptions
    });
    return response;
  } catch (error) {
    console.log("Error: fetching user profile", error);
    throw error;
  }
}
