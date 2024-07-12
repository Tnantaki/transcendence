// import mockupProfiles from "./mock/mockProfiles.json" with { type: "json" };

// match history
  // player1_id: int
  // player2_id: int
  // win_id: int
  // score1: int
  // score2: int
  // start_date: str
  // duration: int

// take id as parameter

function getProfile(myId) {
  fetch('../js/mock/mockProfiles.json') // TODO: fetch data from backend by use id and parse JSON
    .then(response => response.json())
    .then(data => {
      const profileValue = data[myId];
      // const profileValue = JSON.parse(mockupProfiles[myId]);
      const profile = document.getElementById('my-profile');

      profile.querySelector('#avatarName').innerHTML = profileValue["avatar_name"];
      profile.querySelector('#bio').innerHTML = profileValue["bio"];
      profile.querySelector('#email').innerHTML = profileValue["email"];
      profile.querySelector('#winLose').innerHTML = profileValue["wins"] + ':' + profileValue["losses"];
      profile.querySelector('#totalPlay').innerHTML = profileValue["total_games_play"];
      profile.querySelector('#tourWon').innerHTML = profileValue["tour_won"];
      profile.querySelector('#tourPlay').innerHTML = profileValue["tour_play"];
      profile.querySelector('#profileImage').src = profileValue["image"];
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function profileFriend(friendId) {
  fetch('../js/mock/mockProfiles.json') // TODO: fetch data from backend by use id and parse JSON
    .then(response => response.json())
    .then(data => {
      const profileValue = data[friendId]; // TODO: fetch data from backend by use id and parse JSON
      const profile = document.getElementById('friend-profile');

      profile.querySelector('#friendAvatarName').innerHTML = profileValue["avatar_name"];
      profile.querySelector('#friendBio').innerHTML = profileValue["bio"];
      profile.querySelector('#friendEmail').innerHTML = profileValue["email"];
      profile.querySelector('#friendWinLose').innerHTML = profileValue["wins"] + ':' + profileValue["losses"];
      profile.querySelector('#friendTotalPlay').innerHTML = profileValue["total_games_play"];
      profile.querySelector('#friendTourWon').innerHTML = profileValue["tour_won"];
      profile.querySelector('#friendTourPlay').innerHTML = profileValue["tour_play"];
      profile.querySelector('#friendProfileImage').src = profileValue["image"];
      // text line.
      // const elem = document.getElementById('friendBio');
      // elem.style.setProperty('-webkit-line-clamp', Math.floor(window.innerHeight / 150));
    })
    .catch(error => {
      console.error('Error:', error);
    });
}


function getFriendList(myId) {
  fetch('../js/mock/mockFriends.json') // TODO: fetch data from backend by use id and parse JSON
    .then(response => response.json())
    .then(friendList => {
      const blockFriendList = document.getElementsByClassName('bk-friend-list')[0];

      friendList.forEach(element => {
        fetch('../js/mock/mockProfiles.json') // TODO: fetch data from backend by use id and parse JSON
          .then(response => response.json())
          .then(data => {
            const profileValue = data[element.friend_id];
            const item = document.createElement('li');
            item.classList.add('friend-list-item');
            item.innerHTML = `
              <div class="d-flex justify-content-center friend-item-picture ">
                <img src="${profileValue.image}" alt="profile picture">
              </div>
              <div class="d-flex align-items-center friend-item-name">
                <div class="online-status ms-0"></div>
                <p class="font-bs-bold fs-xl friend-name" data-bs-toggle="modal" data-bs-target="#profileModal" 
                  onclick="profileFriend(${element.friend_id})">
                  ${profileValue.avatar_name}
                </p>
              </div>
              <div class="friend-item-background"></div>
            `
            blockFriendList.appendChild(item);
          })
          .catch(error => {
            console.error('Error:', error);
          });
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

const id = 0;

// text line.
// const elem = document.querySelector('.bio-box');
// elem.style.setProperty('-webkit-line-clamp', Math.floor(window.innerHeight / 150));

getProfile(id);
getFriendList(id);