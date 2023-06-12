from locust import HttpUser, task, between

class TestVerifikasi(HttpUser):
    wait_time = between(0.5, 3.0)
    host = 'http://104.198.140.39:3000'


    def on_start(self):
        """ on_start is called when a Locust start before any task is scheduled """
        global token_mahasiswa
        
        response = self.client.post("/auth/login",  json = {"username": "raka.maulana@ui.ac.id","password": "d1d655ee"})
        token_mahasiswa = response.json()['token']

    def on_stop(self):
        """ on_stop is called when the TaskSet is stopping """
        pass

    @task(1)
    def verify(self):
        headers = {'Authorization': f'Bearer {token_mahasiswa}'}
        data =  {
            "idIjazah": "adffe2df-6e4e-487e-a39d-f7464eba5241",
            "idTranskrip": "23ff3970-9aee-4ff7-910b-cbb57d06967a"
        }
        
        response = self.client.post("/certificates/identifier/", json = data, headers = headers)
        print(response.json())     

        response = self.client.post("/certificates/verify",  json = response.json())
        print(response.json())
