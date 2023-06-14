import os

from importlib import reload
import logging
import requests
import json
import random
import string
import csv

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

logging_file("insert-mahasiswa")
logging.info('=============== Enroll Admin Network ==========')
#init()
logging.info('=============== Login Admin PDDIKTI ==========')
tokenAdminPddikti = login("admin.pddikti@gmail.com", "98d33c91")
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
#     emailDosen = row[5] if row[5] != None else f"{''.join(random.choice(string.ascii_lowercase) for i in range(10))}@gamil.com"
#     data = {
#         "id": row[0],
#         "idSp": row[1],
#         "idSms": row[2],
#         "nama": row[3],
#         "nidn": row[4],
#         "username": emailDosen
#     }
#     res_skenario = skenario( "POST", "data/dosen", data, tokenAdminPT)
# fp.close()


logging.info("=============== Create Mahasiswa ==========")
fp = open('mahasiswa.csv', 'r')
read_data = csv.reader(fp)
for row in read_data:
    emailMahasiswa = row[5] if row[5] != None else f"{''.join(random.choice(string.ascii_lowercase) for i in range(10))}@gamil.com"
    if emailMahasiswa not in ('dina@cs.ui.ac.id', 'santo@cs.ui.ac.id', 'bettyp@cs.ui.ac.id', 'chan@cs.ui.ac.id','nizar@cs.ui.ac.id', 'kasiyah@cs.ui.ac.id','wisnuj@cs.ui.ac.id','alfan@cs.ui.ac.id','saptawijaya@cs.ui.ac.id'):
        data = {
                "id": row[0],
                "idSp": row[1],
                "idSms": row[2],
                "nama": row[3],
                "nipd": row[4],
                "username": emailMahasiswa
            }
        res_skenario = skenario( "POST", "data/mahasiswa", data, tokenAdminPT)
        logging.info(res_skenario, data)
fp.close()

# logging.info("=============== Create Matkul ==========")
# fp = open('matkul.csv', 'r')
# read_data = csv.reader(fp)
# for row in read_data:
#     data = {
#         "id": row[0],
#         "idSms": row[1],
#         "idSp": row[2],
#         "nama": row[3],
#         "sks": row[4],
#         "kodeMk":row[5],
#         "jenjangPendidikan": "S1"  
#     }
#     skenario("POST", "data/matkul", data, tokenAdminPddikti)
# fp.close()

# logging.info("=============== Create Kelas ==========")
# fp = open('kelas.csv', 'r')
# read_data = csv.reader(fp)
# for row in read_data:
#     data = {
#         "id": row[0],
#         "idMk": row[1],
#         "idSms": row[2],
#         "nama": row[3],
#         "sks": row[4],
#         "semester": row[5]  
#     }
#     res_skenario = skenario("POST", "data/kelas", data, tokenAdminPddikti)
# fp.close()


# logging.info('=============== Skenario 3 : Read Pendidikan Tinggi, Prodi, Dosen, Mahasiswa, Matkul, Kelas  ==========')
# idUI = '0D1E63E9-CBFB-4546-A242-875C310083A5'
# logging.info("Read Pendidikan Tinggi")
# result = skenario('GET', f'data/pendidikan-tinggi/{idUI}', {}, tokenAdminPddikti)
# logging.info(result)
# logging.info("Read Prodi")
# result = skenario('GET', f'data/prodi/pt/{idUI}', {}, tokenAdminPT)
# logging.info(result['result'][:5])
# logging.info("Read Dosen")
# result = skenario('GET', f'data/dosen/pt/{idUI}', {}, tokenAdminPT)
# logging.info(result['data'][:5])
# logging.info("Read Mahasiswa")
# result = skenario('GET', f'data/mahasiswa/pt/{idUI}', {}, tokenAdminPT)
# logging.info(result['data'][:5])
# logging.info("Read Matkul")
# result = skenario('GET', f'data/matkul/pt/{idUI}', {}, tokenAdminPT)
# logging.info(result['data'][:5])
# logging.info("Read Kelas")
# result = skenario('GET', f'data/kelas/pt/{idUI}', {}, tokenAdminPT)
# logging.info(result['result'][:5])

# tokenDosen = ''
# tokenMahasiswa = ''
# logging.info('=============== Skenario 3 : Dosen menambahkan nilai mahasiswa ke sistem Gradechain  ==========')
# data = {}
# result = skenario('POST', 'data/academicRecord/', data, tokenDosen)
# logging.info(result)
# logging.info('=============== Skenario 3 : Melihat nilai beserta sign-nya  ==========')
# result = skenario('GET', 'data/academicRecord/', data, tokenMahasiswa)
# logging.info('=============== Skenario 4 : Menerbitkan Ijazah dan transkrip  ==========')
# logging.info('=============== Skenario 4 : Ijazah dan transkrip di tanda tangani  ==========')

# logging.info('=============== Skenario 3 : Mendapatkan identifier  ==========')
# idIjazah = ''
# result = skenario('POST', f'data/academicRecord/identifier/', data, tokenMahasiswa)
# logging.info('=============== Skenario 3 : Memverifikasi ijazah menggunakan identifier  ==========')
# data = {}
# result = skenario('POST', f'data/academicRecord/', data)


