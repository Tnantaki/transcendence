<h1 align="center">Transcendence</h1>

## 📖 Description
> This project aims to develop a single page application with the following features:
> - Account Management System: Users can create, manage, and update their accounts.
> - Friend List: Users can add and manage friends within the application.
> - Online Multiplayer Pong Game: Users can play a real-time, online multiplayer version of the classic Pong game.
> - Match History: Users can view the history of their matches, including scores and opponents.
## Previews
### Account Pages
| ![.](images/account_login.png) <br> <center>**Login Page**</center> | ![.](images/account_signup.png) <br> <center>**Signup Page**</center> |
| :-: | :-: |
| ![.](images/account_main.png) <br> <center>**Main Page**</center> | ![.](images/account_profile.png) <br> <center>**Profile Page**</center> |
| ![.](images/account_edit_profile.png) <br> <center>**Edit Profile Page**</center> | ![.](images/pong_game.png) <br> <center>**Pong game Page**</center>|

---
## 🛠️Built with
* Django: Python web framework for creating back-end APIs.
* Bootstrap: Library for making responsive front-end designs.
* PostgreSQL: Object-relational database management system.
* NGINX: HTTP server for serving web pages.

---
## 📝How to Run Server
1. config environment variable at project/backend/.env (or leave it as a default)
2. use make at /project/makefile run `docker compose up --build`
3. access website via `https://localhost:4443`

---
## ELK
1. uncomment in
    - docker-compose.yaml (include elk compose)
    - docker-compose.yaml (backend service - depends_on: logstash)
    - settings.py (LOGGING)
2. access Kibana
    - url: https://localhost:{kibana-port}
    - user: elastic
    - password: es1234