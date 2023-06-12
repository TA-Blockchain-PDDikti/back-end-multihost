from locust import HttpUser, task, between

class TestAdministrasiNilai(HttpUser):
    wait_time = between(0.5, 3.0)
    host = 'http://104.198.140.39:3000'


    def on_start(self):
        """ on_start is called when a Locust start before any task is scheduled """
        global token_dosen
        global token_mahasiswa
      
        response = self.client.post("/auth/login",  json= {"username": "sony.syahputra@cs.ui.ac.id","password": "76b7dbac"})
        print("res",response.json())
        token_dosen = response.json()['token']
        response = self.client.post("/auth/login",  json = {"username": "raka.maulana@ui.ac.id","password": "d1d655ee"})
        token_mahasiswa = response.json()['token']

    def on_stop(self):
        """ on_stop is called when the TaskSet is stopping """
        pass


    @task(1)
    def tambah_nilai(self):
        data = { 
        "idKls":"8b8d5ff0-eb2b-44da-85d3-582df382361c", 
        "idPtk":"72c3be29-fd42-40b7-8460-621441702375", 
        "idPd":"2c800999-c8cf-4f24-8a18-46a8d5a305ce", 
        "nilaiAngka": 93,
        "nilaiHuruf": "A", 
        "nilaiIndex": 4.0
        }

        headers = {'Authorization': f'Bearer {token_dosen}'}
        response = self.client.post("/academicRecords",  json = data, headers = headers )
        print(response.json())

      
    @task(2)
    def lihat_nilai(self):
        headers = {'Authorization': f'Bearer {token_mahasiswa}'}
        response = self.client.get("/academicRecords/mahasiswa/e232bc1f-01fc-452c-ba4e-0656b959a98b", headers = headers)
        print(response.json())