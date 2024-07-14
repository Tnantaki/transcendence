const routes = {
  "/" : {
    location: "home.html"
  },
  "/login": {
    location: "login_read2.html"
  },
  "/token": {
    location: "check_token.html"
  }
};

async function router() {
  const path = window.location.pathname;
  const appDiv = document.getElementById("app-content");
  appDiv.innerHTML = "";
  const rout = routes[path] || routes["/"];
  const html = await fetch(
    "/templates/" + rout.location
  ).then((response) => response.text());
  appDiv.innerHTML = html;
}

function navigate(event) {
  event.preventDefault();
  const path = event.target.getAttribute("href");
  window.history.pushState({}, path, window.location.origin + path);
  router();
}

window.addEventListener("load", router);
window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll("a");
  links.forEach((link) => {
    link.addEventListener("click", navigate);
  });
});

