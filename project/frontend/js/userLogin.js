async function  submitLogin() {
    event.preventDefault();
    const userName = document.getElementById("userNameLogin").value;
    const password = document.getElementById("passwordLogin").value;

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "username": userName,
        "password": password
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    let urls = "http://localhost:8001/api/i/uac/login/";
    let token = await fetch(urls, requestOptions)
    .then((response) => response.json())
    .then((res) =>{
            localStorage.setItem("token", res.token);
            return (res);
        })
    .catch((error) => console.error(error));
}

async function submitLogOut(){
    const token = localStorage.getItem("token");
    const logoutButton = document.getElementById("logOutButton")
    let urls = "http://localhost:8001/api/i/uac/logout/";

    if (!token){
        return true
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + token);

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow",
    }
    let logout = await fetch(urls, requestOptions).then(
        (response) => {
            localStorage.removeItem("token");
            console.log("LOGOUT SUCCESS!!");
            return true;
        }
    )
    
}
