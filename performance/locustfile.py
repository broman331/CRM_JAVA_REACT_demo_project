from locust import HttpUser, task, between

class WebsiteUser(HttpUser):
    wait_time = between(1, 5)

    def on_start(self):
        """Login on start"""
        response = self.client.post("/api/auth/login", json={
            "email": "admin@example.com",
            "password": "admin123"
        })
        if response.status_code == 200:
            self.token = response.json().get("token")
            self.client.headers.update({"Authorization": f"Bearer {self.token}"})

    @task(3)
    def view_dashboard(self):
        self.client.get("/api/dashboard/stats")
        self.client.get("/api/analytics/revenue")
        self.client.get("/api/analytics/pipeline")

    @task(2)
    def view_contacts(self):
        self.client.get("/api/contacts")

    @task(1)
    def view_deals(self):
        self.client.get("/api/deals")

    @task(1)
    def search_contacts(self):
        self.client.get("/api/contacts?search=firstName:John")
