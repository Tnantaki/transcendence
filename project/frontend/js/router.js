const template_dir = "/templates/";
const js_dir = "js/";
const title_extension = "Transcendence";
const initialURL = "/";

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

// Check Token
function getRoute(url) {
  const token = localStorage.getItem('token');

  if (!token) {
    return urlRoute['/login'];
  } else if (token && url === '/login') {
    return urlRoute['/'];
  }
  return urlRoute[url];
}

// Disable default a tag behavior of reload full page to make SPA
function setATagDefault() {
  const linkTags = document.querySelectorAll('a');
  linkTags.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const url = link.getAttribute('href'); 
      loadPage(url);
      history.pushState({url: url}, null, url);
    });
  });
}

// Load content from route
function loadPage(url) {
  const route = getRoute(url);
  const contentDiv = document.getElementById('content');

  fetch(route.urlPath)
    .then(response => response.text())
    .then(data => {
      contentDiv.innerHTML = data;
      document.title = route.title;
      if (route.script) {
        const addScript = document.createElement('script');

        addScript.src = route.script;
        addScript.type = 'module';
        contentDiv.appendChild(addScript);
        setATagDefault();
      }
    })
    .catch(error => {
      contentDiv.innerHTML = `<p>Error loading page from url="${url}"</p>`;
      console.error('Error loading page:', error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
  loadPage(location.pathname);
});

window.addEventListener('popstate', (event) => {
  if (event.state)
    loadPage(event.state.url);
});
