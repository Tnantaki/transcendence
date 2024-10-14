import { setSelectLanguage } from "./i18n.js";
import { checkNoti } from "./index.js";

const title_extension = "Transcendence";
const template_dir = "/templates/";
const js_dir = "js/";
const js_game_dir = js_dir + "gameUI/";
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
    script: js_game_dir + "history-table.js",
    title: "Match History" + " - " + title_extension,
  }, 
  "/leaderboard": {
    urlPath: template_dir + "leaderboard.html",
    script: js_game_dir + "leaderboard.js",
    title: "Leaderboard" + " - " + title_extension,
  }, 
  "/game": {
    urlPath: template_dir + "game.html",
    script: js_game_dir + "main-menu.js",
    title: "Game" + " - " + title_extension,
  },
  "/game-single": {
    urlPath: template_dir + "game.html",
    script: js_dir + "gamePlay/Main.js",
    title: "Single Player" + " - " + title_extension,
  },
  "/game-versus": {
    urlPath: template_dir + "game.html",
    script: js_dir + "gamePlay/Main.js",
    title: "Versus" + " - " + title_extension,
  },
  "/online": {
    urlPath: template_dir + "test/index.html",
    script: js_dir + "test/PongOnline.js",
      // js_dir + "test/pongOnlineScript.js" ,
    title: "Tests" + " - " + title_extension,
  }
};

export function loadPage(url) {
  const newUrl = loadContent(url)
  // pushState will save state and update browser url without full page reload
  // 1st arg: state use for store obj in histor stack
  // 2nd arg: not use anymore pass empty string for safe
  // 3rd arg: url string that will display on browser url
  history.pushState({page: newUrl}, "", newUrl);
  console.log("push one state", newUrl)
}

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

// Load content from route
function loadContent(url) {
  const token = localStorage.getItem('token');
  let endPoint = url.split("?")[0];

  if (!token && endPoint !== "/signup") {
    endPoint = "/login";
  } else if (token && endPoint === '/login') {
    endPoint = "/";
  }
  const route = urlRoute[endPoint];
  const contentDiv = document.getElementById('content');
  const searchParams = url.includes('?') ? url.slice(url.indexOf('?')) : ""

  fetch(route.urlPath)
    .then(response => response.text())
    .then(data => {
      contentDiv.innerHTML = data;
      document.title = route.title;
      if (route.script) {
        const addScript = document.createElement('script');
        // append query parameter timestamp to the script URL to prevent caching.
        addScript.src = route.script + "?v=" + new Date().getTime();
        addScript.type = 'module';
        contentDiv.appendChild(addScript);
      }
      setATagDefault();
      setSelectLanguage();
      checkNoti();
    })
    .catch(error => {
      contentDiv.innerHTML = `<p>Error loading page from url="${url}"</p>`;
    });
  const newUrl = endPoint + searchParams;
  return newUrl
}

// Triggering index.html to load content page from url input
document.addEventListener('DOMContentLoaded', () => {
  loadContent(location.pathname + location.search);
});

// Popstate will trigger on back and forward buttom
window.addEventListener('popstate', (event) => {
  if (event.state && event.state.page)
    loadContent(event.state.page);
});
