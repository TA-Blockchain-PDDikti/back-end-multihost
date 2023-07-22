import os

from importlib import reload
import logging
import requests
import json
import random
import string
import csv
import pandas as pd

URL = "http://104.198.140.39:3000"

# Logging File
def logging_file(filename):
    reload(logging)
    logging.basicConfig(format='%(asctime)-4s %(levelname)-6s  %(message)s',
                        datefmt='%H:%M:%S',
                        filename=f"{filename}.txt",
                        filemode='w',
                        level=logging.INFO)
  
# function to run skenario (Access API)
def skenario( method, endpoint, jsonData, token = ''):
    headers = {'Authorization': f'Bearer {token}'}

    if method == 'POST':
        x = requests.post(f"{URL}/{endpoint}", json=jsonData, headers=headers)
    elif method == 'PUT':
        x = requests.put(f"{URL}/{endpoint}", json=jsonData, headers=headers)
    elif method == 'GET':
        x = requests.get(f"{URL}/{endpoint}", headers=headers)
    elif method == 'DELETE':
        x = requests.delete(f"{URL}/{endpoint}", headers=headers)

    return json.loads(x.text)

"""
Function to:
1. Enroll admin
2. register admin pddikti
"""
def init():
    data = {
    "username": "admin",
    "password":"adminpw",
    "organizationName":"Kemdikbud"
    }
    enroll =  requests.post(f"{URL}/auth/enroll", json=data)
    logging.info(enroll.text)

    data = {
    "username": "admin",
    "password":"adminpw",
    "organizationName":"HE1"
    }
    enroll =  requests.post(f"{URL}/auth/enroll", json=data)
    logging.info(enroll.text)


def adminPddikti():
    try :
        data = {
        "username": f"{''.join(random.choice(string.ascii_lowercase) for i in range(10))}@gmail.com",
        "organizationName":"Kemdikbud",
        "role": "admin pddikti"
        }
        register =  requests.post(f"{URL}/auth/register", json=data)
        logging.info(register.text)

        print(json.loads(register.text), type(json.loads(register.text)))
        return login(data['username'], json.loads(register.text)['password'])
    except:
        adminPddikti()

def login(username, password):
    data = {
        "username": username,
        "password": password
    }

    login =  requests.post(f"{URL}/auth/login", json=data)
    logging.info(login.text)
    return json.loads(login.text)['token']

logging_file("assign-mahasiswa")
logging.info('=============== Enroll Admin Network ==========')
#init()
logging.info('=============== Login Admin PDDIKTI ==========')
#tokenAdminPddikti = login("admin.pddikti@gmail.com", "98d33c91")
logging.info('=============== Skenario 2 : Create Pendidikan Tinggi, Prodi, Dosen, Mahasiswa, Matkul, Kelas  ==========')

# logging.info("=============== Create PT ==========")
# fp = open('pendidikan-tinggi.csv', 'r')
# read_data = csv.reader(fp)
# for row in read_data:
#     data = {
#         "id": row[0],
#         "nama": row[1],
#         "usernameAdmin": row[2]
#     }
#     res_skenario = skenario("POST", "data/pendidikan-tinggi", data, tokenAdminPddikti)
#     logging.info(res_skenario)
# fp.close()
tokenAdminPT = login('humas-ui@ui.ac.id','7450803b')
print(tokenAdminPT)

# logging.info("=============== Create Prodi ==========")
# fp = open('prodi.csv', 'r')
# read_data = csv.reader(fp)
# for row in read_data:
#     data = {
#         "id": row[0],
#         "idSp": row[1],
#         "nama": row[2],
#         "jenjangPendidikan": 'S1'
#     }
#     res_skenario = skenario( "POST", "data/prodi", data, tokenAdminPT)
#     logging.info(res_skenario)
# fp.close()

# logging.info("=============== Create Dosen ==========")
# fp = open('dosen.csv', 'r')
# read_data = csv.reader(fp)
# for row in read_data:
#     print(row[5] != "")
#     emailDosen = row[5] if row[5] != "" else f"{''.join(random.choice(string.ascii_lowercase) for i in range(10))}@gmail.com"
#     print(emailDosen)
#     data = {
#         "id": row[0],
#         "idSp": row[1],
#         "idSms": row[2],
#         "nama": row[3],
#         "nidn": row[4],
#         "jabatan": "",
#         "nomorSk": "",
#         "username": emailDosen
#     }
#     res_skenario = skenario( "POST", "data/dosen", data, tokenAdminPT)
#     logging.info(res_skenario)
# fp.close()


# logging.info("=============== Create Mahasiswa ==========")
# fp = open('mahasiswa.csv', 'r')
# read_data = csv.reader(fp)
# for row in read_data:
#     emailMahasiswa = row[5] if row[5] != None else f"{''.join(random.choice(string.ascii_lowercase) for i in range(10))}@gmail.com"
#     if emailMahasiswa not in ('dina@cs.ui.ac.id', 'santo@cs.ui.ac.id', 'bettyp@cs.ui.ac.id', 'chan@cs.ui.ac.id','nizar@cs.ui.ac.id', 'kasiyah@cs.ui.ac.id','wisnuj@cs.ui.ac.id','alfan@cs.ui.ac.id','saptawijaya@cs.ui.ac.id', 'ari.kuncoro@ie.ui.ac.id'):
#         data = {
#                 "id": row[0],
#                 "idSp": row[1],
#                 "idSms": row[2],
#                 "nama": row[3],
#                 "nipd": row[4],
#                 "username": emailMahasiswa
#             }
#         res_skenario = skenario( "POST", "data/mahasiswa", data, tokenAdminPT)
#         logging.info(res_skenario, data)
# fp.close()

# logging.info("=============== Create Matkul ==========")
# fp = open('matkul-1.csv', 'r')
# read_data = csv.reader(fp)
# for row in read_data:
#     data = {
#         "id": row[0],
#         "idSms": row[1],
#         "idSp": '0D1E63E9-CBFB-4546-A242-875C310083A5',
#         "nama": row[2],
#         "sks": int(float(row[3])),
#         "kodeMk":row[4],
#         "jenjangPendidikan": "S1"  
#     }
#     res_skenario = skenario("POST", "data/matkul", data, tokenAdminPT)
#     logging.info(res_skenario)
# fp.close()

# logging.info("=============== Create Kelas ==========")
# fp = open('kelas-1.csv', 'r')
# read_data = csv.reader(fp)
# for row in read_data:
#     data = {
#             "idSms": row[1],
#             "idMk": row[2],
#             "nama": row[3],
#             "sks": int(float(row[5])),
#             "semester": row[4]  
#         }
    
#     res_skenario = skenario("PUT", f"data/kelas/{row[0]}", data, tokenAdminPT)
#     logging.info(res_skenario)
# fp.close()

# tokenDosen = ''
# tokenMahasiswa = ''
# logging.info('=============== Skenario 3 : Dosen menambahkan nilai mahasiswa ke sistem Gradechain  ==========')
# data = {}
# result = skenario('POST', 'data/academicRecord/', data, tokenDosen)

# fp = open('user.txt', 'r')
# read_data = fp.readlines()
# user = {}
# for row in read_data:
#     split_row = row.split('~')
#     user[split_row[0]] = split_row[2].strip()

# fp.close()

# fp = open('nilai-3.csv', 'r')
# read_data = csv.reader(fp)
# for row in read_data:
#     nilai = float(row[3]) if row[3] != "" else -1
#     print(nilai)
#     data = { 
#         "idKls":row[0],
#         "idPtk":row[1], 
#         "idPd":row[2], 
#         "nilaiAngka": nilai,
#         "nilaiHuruf": row[4], 
#         "nilaiIndex": float(row[5])
#         }
#     try:
#         get_dosen = skenario('GET', f'data/dosen/{row[1]}', {}, tokenAdminPT)
#         print(get_dosen)
#         username = get_dosen['username']
#     except:
#         continue
#     tokenDosen = login(username, user[username])
#     res_skenario = skenario('POST', 'academicRecords/', data, tokenDosen)
#     logging.info(res_skenario)
# fp.close()

# result = skenario('POST', f'data/academicRecord/', data)
# idIjazah =['011991b0-8d82-48c9-976b-6915ba0db213', '152a5de6-5d69-42dc-a5b8-208424a1e894', '1fca3d1e-00b7-4416-b3d7-d1d6527d5e1f',  '2d0eb717-79cc-45cd-9884-a8b6fd408601',  '4246cd67-791b-4311-875f-a3d7db2029a0', '4e865d5a-fe21-41a7-be4f-83713059b1df',  '62fe218c-65fd-4f7c-8fc7-077cc3628d96', '63fbc5d8-b77b-4aca-afb8-22d6ed235a5c', '6baa6593-03a2-4d67-a2ba-27190f01cc74', '78e65b61-9b14-449e-bf90-c28dbcb05db1',  '9f419bf2-fe4e-47a1-884d-5b70ec57bf20', 'ccc524e6-ba89-43b9-8e4d-72d64bd1fd20', 'd2668a88-25b1-427f-a5b6-03aac9485489', 'ec9ed38f-de8e-44cb-8d93-d887be26f793']
# for id in idIjazah:
#     print(id)
#     res_skenario = skenario('DELETE', f'data/prodi/{id}', {}, tokenAdminPT)
#     logging.info(res_skenario)

# logging.info("=============== Assign Dosen ==========")
# df = pd.read_csv('kelas-dosen.csv', header=None)
# df.columns=['id_kelas', 'id_dosen']
# kelas = df['id_kelas'].unique()
# print(len(kelas), len(df['id_dosen']))
# kelas_dosen = {}
# for id in kelas:
#     dosen = df.groupby('id_kelas').get_group(id)['id_dosen']
  
#     arr_dosen = []
#     for x in dosen:
#         get_ptk  = skenario("GET", f"data/dosen/{x}", {}, tokenAdminPT)
#         try:
#             get_ptk['id']
#             arr_dosen.append(x)
#         except:
#             continue
#     logging.info(arr_dosen)   
#     str_dosen = json.dumps(arr_dosen, separators=(',', ':'))
#     data = {
#              "idKls": id,
#              "ptk": str_dosen.replace('"',''),
#          }
    
#     res_skenario = skenario("POST", f"data/kelas/dosen/", data, tokenAdminPT)
#     logging.info(res_skenario)


logging.info("=============== Assign Mahasiswa ==========")
df = pd.read_csv('nilai-3.csv', header=None)
#df.columns=['id_kelas', 'id_dosen']
kelas = df[0].unique()
print(kelas)
#print(len(kelas), len(df['id_dosen']))
kelas_dosen = {}
for id in kelas:
    mahasiswa = df.groupby(0).get_group(id)[2]
    arr_mahasiswa = [x for x in mahasiswa.unique() ]
   
    logging.info(arr_mahasiswa)   
    str_mahasiswa = json.dumps(arr_mahasiswa, separators=(',', ':'))
    data = {
             "idKls": id,
             "pd": str_mahasiswa.replace('"',''),
         }
    
    res_skenario = skenario("POST", f"data/kelas/mahasiswa/", data, tokenAdminPT)
    logging.info(res_skenario)

# for idKls, ptk in kelas_dosen.items():
#     print(idKls, ptk)
#     data = {
#             "idKls": idKls,
#             "ptk": ptk,
#         }
    
#     res_skenario = skenario("POST", f"data/kelas/dosen/", data, tokenAdminPT)
    # logging.info(res_skenario)

# fp = open('kelas-1.csv', 'r')
# read_data = csv.reader(fp)
# for row in read_data:
#     data = {
#             "idSms": row[1],
#             "idMk": row[2],
#             "nama": row[3],
#             "sks": int(float(row[5])),
#             "semester": row[4]  
#         }
    
#     res_skenario = skenario("PUT", f"data/kelas/{row[0]}", data, tokenAdminPT)
#     logging.info(res_skenario)
# fp.close()
