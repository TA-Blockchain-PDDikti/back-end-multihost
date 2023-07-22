from locust import HttpUser, task, between

class TestAdministrasiNilai(HttpUser):
    wait_time = between(0.5, 3.0)
    host = 'http://104.198.140.39:3000'


    def on_start(self):
        """ on_start is called when a Locust start before any task is scheduled """
        global token_dosen
        global token_mahasiswa
        global token_admin

        response = self.client.post("/auth/login",  json = {"username": "admin.pt@ui.ac.id","password": "e9a8e93c"})
        token_admin = response.json()['token']
        response = self.client.post("/auth/login",  json= {"username": "sony.syahputra@cs.ui.ac.id","password": "76b7dbac"})
        print("res",response.json())
        token_dosen = response.json()['token']
        response = self.client.post("/auth/login",  json = {"username": "raka.maulana@ui.ac.id","password": "d1d655ee"})
        token_mahasiswa = response.json()['token']

        
    def on_stop(self):
        """ on_stop is called when the TaskSet is stopping """
        pass

    @task(1)
    def approve(self):
        dataLulusan = { "dataLulusan":[{
                "idSp": "9f9fc18b-d3e1-4a85-89b3-dd6cc63ffa40",
                "idSms" : "ee8b28d1-752d-4edc-a9ab-5aa831de7893",
                "idPd" : "efc56aaf-4ea6-4b71-96e6-d019b27b1408",
                "jenjangPendidikan" : "S1",
                "nomorIjazah" : "1233frtyy",
                "tanggalLulus" : "12 Juli 2022",
                "totalMutu":  10.2,
                "totalSks":  3,
                "ipk": 3.4
            }
            ]
        }
        response = self.client.post("/certificates/",  json = dataLulusan, headers = {'Authorization': f'Bearer {token_admin}'} )
        print(response.json())
        
        ijazah = {
            "idApprover": "7e0574a4-fbf0-478c-8e21-3848998fb807",
            "lstIjazah": ["7ffb3316-28bb-4045-8116-13b649a4db06"]
        }
        transkrip = {
            "idApprover": "19a4ab3a-9fd6-49ec-931d-6954c143416b",
            "lstTranskrip": ["673c7da7-e451-498d-ab69-8e1aba47645d"]
        }

        # headers = {'Authorization': f'Bearer {token_dosen}'}
        # response = self.client.post("/certificates/approve/ijazah",  json = ijazah, headers = headers )
        # print(response.json())
        # response = self.client.post("/certificates/approve/transkrip",  json = transkrip, headers = headers )
        # print(response.json())


    
    @task(2)
    def hello_world(self):
        headers = {'Authorization': f'Bearer {token_mahasiswa}'}
        response = self.client.get("/certificates/ijazah/mahasiswa/e232bc1f-01fc-452c-ba4e-0656b959a98b", headers = headers)
        print(response.json())
        response = self.client.get("/certificates/transkrip/mahasiswa/e232bc1f-01fc-452c-ba4e-0656b959a98b", headers = headers)
        print(response.json())