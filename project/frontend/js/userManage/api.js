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

  try {
    const response = await fetch(url, {
      method: method,
      headers: myHeaders,
      body: body ? JSON.stringify(body) : undefined,
      ...otherOptions
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function fetchUploadFile(method, url, options = {}) {
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

  try {
    const response = await fetch(url, {
      method: method,
      headers: myHeaders,
      body: body,
      ...otherOptions
    });
    return response;
  } catch (error) {
    throw error;
  }
}
