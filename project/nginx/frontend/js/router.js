const template_dir = "/templates/";

const urlRoute = {
  "/": template_dir + "login.html",
  "/signup": template_dir + "signup.html",
  "/home": template_dir + "home.html", // TODO: for testing
  // "/login": "login.html",
};

document.addEventListener('DOMContentLoaded', function() {
  const contentDiv = document.getElementById('content');
  // const location = window.location.pathname.replace(/^\/frontend/, ""); // TODO: replace frontend with real path
  const location = window.location.pathname;
  const page = urlRoute[location];

  function loadPage(page) {
    fetch(page)
      .then(response => response.text())
      .then(data => {
        contentDiv.innerHTML = data;
      })
      .catch(error => {
        contentDiv.innerHTML = '<p>Error loading page.</p>';
        console.error('Error loading page:', error);
      });
  }
  loadPage(page);
});
