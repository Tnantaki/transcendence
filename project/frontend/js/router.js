const template_dir = "/templates/";
const js_dir = "js/";
const title_extension = "Transcendence";

const urlRoute = {
  "/": {
    urlPath: template_dir + "main.html",
    script: js_dir + "main.js",
    title: title_extension,
  },
  "/signup": {
    urlPath: template_dir + "signup.html",
    script: js_dir + "signup.js",
    title: "Signup" + " - " + title_extension,
  },
  "/login": {
    urlPath: template_dir + "login.html",
    script: js_dir + "login.js",
    title: "Login" + " - " + title_extension,
  }, 
  "/profile": {
    urlPath: template_dir + "profile.html",
    script: js_dir + "profile.js",
    title: "Profile" + " - " + title_extension,
  }, 
  "/editProfile": {
    urlPath: template_dir + "editProfile.html",
    script: js_dir + "editProfile.js",
    title: "Edit Profile" + " - " + title_extension,
  }, 
};

document.addEventListener('DOMContentLoaded', function() {
  const contentDiv = document.getElementById('content');
  const location = window.location.pathname;
  const page = urlRoute[location];
  console.log(location); // Print Debug

  function loadPage(page) {
    fetch(page.urlPath)
      .then(response => response.text())
      .then(data => {
        contentDiv.innerHTML = data;
        document.title = page.title;
        if (page.script) {
          const addScript = document.createElement('script');

          addScript.src = page.script;
          addScript.type = 'module';
          contentDiv.appendChild(addScript);
        }
      })
      .catch(error => {
        contentDiv.innerHTML = '<p>Error loading page.</p>';
        console.error('Error loading page:', error);
      });
  }
  loadPage(page);
});
