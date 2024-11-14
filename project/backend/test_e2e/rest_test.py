import requests
from faker import Faker
from rich import print

BASE_URL = "http://localhost:8000/i"
fake = Faker()

class TestAuth:


    def test_register(self):
        # Test register endpoint
        payload = {
            "email": fake.email(),
            "username": fake.user_name(),
            "password": "1234"
        }
        
        response = requests.post(f"{BASE_URL}/uac/register/", json=payload)
        assert response.status_code == 201
        data = response.json()
        assert "username" in data
        assert "id" in data
        
    def test_login(self):
        # Create test user first
        username = fake.user_name()
        password = "1234"
        
        register_payload = {
            "email": fake.email(),
            "username": username,
            "password": password
        }
        requests.post(f"{BASE_URL}/uac/register/", json=register_payload)
        
        # Test login
        login_payload = {
            "username": username,
            "password": password
        }
        
        response = requests.post(f"{BASE_URL}/uac/login/", json=login_payload)
        assert response.status_code == 201
        data = response.json()
        assert "token" in data
        
class TestUser:
    
    def __init__(self):
        self.setup_method()

    def setup_method(self):
        # Create test user and get token
        self.username = fake.user_name()
        self.password = "1234"
        
        register_payload = {
            "email": fake.email(), 
            "username": self.username,
            "password": self.password
        }
        requests.post(f"{BASE_URL}/uac/register/", json=register_payload)
        
        login_payload = {
            "username": self.username,
            "password": self.password
        }
        response = requests.post(f"{BASE_URL}/uac/login/", json=login_payload)
        self.token = response.json()["token"]
        self.headers = {"Authorization": f"Bearer {self.token}"}

    def test_get_me(self):
        response = requests.get(f"{BASE_URL}/uac/me/", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        assert data["username"] == self.username

    def test_update_profile(self):
        payload = {
            "display_name": "Test Name",
            "bio": "Test bio"
        }
        response = requests.patch(f"{BASE_URL}/uac/me/", headers=self.headers, json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["display_name"] == payload["display_name"]
        assert data["bio"] == payload["bio"]

class TestGame:
    
    def __init__(self):
        self.setup_method()

    def setup_method(self):
        # Create test user and get token
        self.username = fake.user_name()
        self.password = "1234"
        
        register_payload = {
            "email": fake.email(),
            "username": self.username,
            "password": self.password
        }
        requests.post(f"{BASE_URL}/uac/register/", json=register_payload)
        
        login_payload = {
            "username": self.username,
            "password": self.password
        }
        response = requests.post(f"{BASE_URL}/uac/login/", json=login_payload)
        self.token = response.json()["token"]
        self.headers = {"Authorization": f"Bearer {self.token}"}

    def test_create_room(self):
        payload = {
            "name": "Test Room"
        }
        response = requests.post(f"{BASE_URL}/game/pong/room/", headers=self.headers, json=payload)
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == payload["name"]
        print(data)
        
    def test_get_rooms(self):
        response = requests.get(f"{BASE_URL}/game/pong/room/")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    def test_create_tournament(self):
        payload = {
            "name": "Test Tournament"
        }
        response = requests.post(f"{BASE_URL}/game/tournament/create/", headers=self.headers, json=payload)
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == payload["name"] 

if __name__ == "__main__":
    testAuth: TestAuth = TestAuth()
    testGame: TestGame = TestGame()
    testUser: TestUser = TestUser()
    
    
    testGame.test_create_room()
    