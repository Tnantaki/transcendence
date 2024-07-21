import { setSelectLanguage } from "./i18n.js";

const title_extension = "Transcendence";
const template_dir = "/templates/";
const js_dir = "js/";
const js_game_dir = js_dir + "gameUX/";
const js_user_dir = js_dir + "userManage/";

const urlRoute = {
  "/": {
    urlPath: template_dir + "main.html",
    script: js_user_dir + "main.js",
    title: title_extension,
  },
  "/signup": {
    urlPath: template_dir + "signup.html",
    script: js_user_dir + "signup.js",
    title: "Signup" + " - " + title_extension,
  },
  "/login": {
    urlPath: template_dir + "login.html",
    script: js_user_dir + "login.js",
    title: "Login" + " - " + title_extension,
  }, 
  "/profile": {
    urlPath: template_dir + "profile.html",
    script: js_user_dir + "profile.js",
    title: "Profile" + " - " + title_extension,
  }, 
  "/editProfile": {
    urlPath: template_dir + "editProfile.html",
    script: js_user_dir + "editProfile.js",
    title: "Edit Profile" + " - " + title_extension,
  }, 
  "/history": {
    urlPath: template_dir + "match-history.html",
    script: "",
    title: "Match History" + " - " + title_extension,
  }, 
  "/leaderboard": {
    urlPath: template_dir + "leaderboard.html",
    script: "",
    title: "Leaderboard" + " - " + title_extension,
  }, 
  "/game": {
    urlPath: template_dir + "game.html",
    script: [
      js_game_dir + "utils.js",
      js_game_dir + "main-menu.js",
      js_game_dir + "tournament-board.js",
      js_game_dir + "players-board.js",
      js_game_dir + "online-menu.js",
      js_game_dir + "online-board.js"
    ],
    title: "Game" + " - " + title_extension,
  }, 
};

// Disable default a tag behavior of reload full page to make SPA
function setATagDefault() {
  const linkTags = document.querySelectorAll('a');
  linkTags.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const url = link.getAttribute('href'); 
      loadPage(url);
    });
  });
}

// Sequential Script Loading
function loadScriptInOrder(scripts, contentDiv) {
  return scripts.reduce((promise, script) => {
    return promise.then(() => {
      return new Promise((resolve, reject) => {
        const addScript = document.createElement('script');
        addScript.src = script + "?v=" + new Date().getTime();
        addScript.onload = resolve;
        addScript.onerror = reject;
        contentDiv.appendChild(addScript);
      });
    });
  }, Promise.resolve());
}

// Load content from route
export function loadPage(url) {
  const token = localStorage.getItem('token');

  if (!token && url !== "/signup") {
    url = "/login"
  } else if (token && url === '/login') {
    url = "/"
  }
  const route = urlRoute[url];
  const contentDiv = document.getElementById('content');

  fetch(route.urlPath)
    .then(response => response.text())
    .then(data => {
      contentDiv.innerHTML = data;
      document.title = route.title;
      if (route.script) {
        if (url === '/game') {
          loadScriptInOrder(route.script, contentDiv);
          // route.script.forEach(e => {
          //   const addScript = document.createElement('script');
          //   addScript.src = e + "?v=" + new Date().getTime();
          //   contentDiv.appendChild(addScript);
          // })
        } else {
          const addScript = document.createElement('script');
          // append query parameter timestamp to the script URL to prevent caching.
          addScript.src = route.script + "?v=" + new Date().getTime();
          addScript.type = 'module';
          contentDiv.appendChild(addScript);
        }
      }
      setATagDefault();
      setSelectLanguage();
      history.pushState({url: url}, null, url);
    })
    .catch(error => {
      contentDiv.innerHTML = `<p>Error loading page from url="${url}"</p>`;
      console.error('Error loading page:', error);
    });
}

// Triggering index.html to load content page from url input
document.addEventListener('DOMContentLoaded', () => {
  loadPage(location.pathname);
});

// Popstate will trigger on back and forward buttom
window.addEventListener('popstate', (event) => {
  if (event.state)
    loadPage(event.state.url);
});
