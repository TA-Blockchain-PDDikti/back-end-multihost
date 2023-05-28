import os

from importlib import reload
import logging
import jaydebeapi
import sshtunnel
import requests
import json
import random
import string

# Extract all envvars
JS_HOST = "kawung.cs.ui.ac.id"
Js_PORT = 12122
JS_USER = "farzana.hadifa"
JS_PW = "IMASEMKFEO"
JS_PKEY = '/home/farzana/Documents/TA/farzana.hadifa_kawung.key' 
DB_SERVER = "localhost"
DB_PORT = 16161
DB_NAME = "pddikti"
DB_USER = "sa"
DB_PW = "MySecretP@ssw0rd"
URL = "http://localhost:3000"

# Where you placed your downloaded SQL Server JDBC .jar
JARS_PATH = '/home/farzana/Documents/sqljdbc_12.2.0.0_enu/sqljdbc_12.2/enu'


# Common SSH Tunnel connection arguments
conn_inputs = {
    'ssh_username': JS_USER,
    'ssh_private_key_password': JS_PW,
    'remote_bind_address': (DB_SERVER, DB_PORT),
    'ssh_pkey': JS_PKEY
}

# Logging File
def logging_file(filename):
    reload(logging)
    logging.basicConfig(format='%(asctime)-4s %(levelname)-6s  %(message)s',
                        datefmt='%H:%M:%S',
                        filename=f"{filename}.txt",
                        filemode='w',
                        level=logging.INFO)

# Helper functiont to execute query
def execute_query(conn, query):
    cursor = conn.cursor()
    cursor.execute(query)
    return cursor.fetchall()

# function to run skenario (Access API)
def skenario( method, endpoint, jsonData, token):
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
        "username": ''.join(random.choice(string.ascii_lowercase) for i in range(10)),
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

with sshtunnel.SSHTunnelForwarder((JS_HOST, Js_PORT), **conn_inputs) as tunnel:
    logging_file("input-data")
    logging.info('========== SSH Tunnelling To Kawung =========')
    # Set the server and port to be the local SSH tunnel values
    server = tunnel.local_bind_address[0]
    port = tunnel.local_bind_address[1]
    logging.info(f"Server: {server}, port: {port}")

    conn_string = f"""jdbc:sqlserver://{server}:{port};databaseName={DB_NAME};queryTimeout=60;encrypt=true;trustServerCertificate=true;"""
    with jaydebeapi.connect(
        "com.microsoft.sqlserver.jdbc.SQLServerDriver",
        conn_string,
        [DB_USER, DB_PW],
        os.path.join(JARS_PATH, 'mssql-jdbc-12.2.0.jre8.jar')
    ) as conn:
        logging.info(f'======== Connect To Database PDDIKTI {conn_string} =========')
        query2 = "SELECT id_sms, id_sp, nm_lemb as 'nama' FROM dbo.sms where id_sp = '0D1E63E9-CBFB-4546-A242-875C310083A5' and id_jns_sms = '3' FOR JSON AUTO"
    
        logging.info('=============== Enroll Admin Network ==========')
        #init()
        logging.info('=============== Skenario 1 : Register Admin PDDIKTI ==========')
        tokenAdminPddikti = adminPddikti()
        logging.info('=============== Skenario 2 : Create Pendidikan Tinggi, Prodi, Dosen, Mahasiswa, Matkul, Kelas  ==========')
   
        logging.info("=============== Create PT ==========")
        query = "SELECT id_sp as id, nm_lemb as 'nama', email as 'usernameAdmin' FROM dbo.satuan_pendidikan WHERE nm_lemb='Universitas Indonesia' FOR JSON AUTO"
        result = execute_query(conn, query)
        data = json.loads(result[0][0])[0]
        
        data['usernameAdmin'] = "adminmm22" 

        res_skenario = skenario("POST", "data/pendidikan-tinggi", data, tokenAdminPddikti)
        logging.info('res',res_skenario)
        tokenAdminPT = login(data['usernameAdmin'],res_skenario['accountPassword'])
        print(tokenAdminPT)
        logging.info("Menambahkan Pendidikan Tinggi Universitas Indonesia ke sistem Gradechain")

        # logging.info("=============== Create Prodi ==========")
        # query = "SELECT id_sms, id_sp, nm_lemb FROM dbo.sms where id_sp = '0D1E63E9-CBFB-4546-A242-875C310083A5' and id_jns_sms = '3' and id_jenj_didik = '30'"
        # result = execute_query(conn, query)
        # print(len(result))
        # for res in result:
        #     data = {
        #         "id": res[0],
        #         "idSp": res[1],
        #         "nama": res[2],
        #         "jenjangPendidikan": 'S1'
        #     }
        #     skenario( "POST", "data/prodi", data, tokenAdminPT)
        # logging.info(f"===============  Menambahkan {len(result)} Prodi ke sistem Gradechain ==========")

        # logging.info("=============== Create Dosen ==========")
        # query = "SELECT id_reg_ptk, id_sms, id_sp, nm_lemb FROM dbo.reg_ptk where id_sp = '0D1E63E9-CBFB-4546-A242-875C310083A5' and id_jns_sms = '3' and id_jenj_didik = '30'"
        # result = execute_query(conn, query)
        # for res in result:
        #     data ={
        #         "id":res[0],
        #         "idSms": res[1],
        #         "idSp": res[2],
        #         "nama": res[3],
        #         "username": ''.join(random.choice(string.ascii_lowercase) for i in range(10))
                
        #     }
        #     skenario( "POST", "data/res", data, tokenAdminPT)
        # logging.info(f"===============  Menambahkan {len(result)} res==========")

        # logging.info("=============== Create Mahasiswa ==========")
        # query = "SELECT id_sms, id_sp, nm_lemb FROM dbo.sms where id_sp = '0D1E63E9-CBFB-4546-A242-875C310083A5' and id_jns_sms = '3' and id_jenj_didik = '30'"
        # result = execute_query(conn, query)
        # for res in result:
        #     data = {
        #         "id": res[0],
        #         "idSp": res[1],
        #         "idSms": res[2],
        #         "nama": res[3],
        #         "nipd":res[4],
        #         "username": ''.join(random.choice(string.ascii_lowercase) for i in range(10))
        #     }
        #     skenario( "POST", "data/res", data, tokenAdminPT)
        # logging.info(f"===============  Menambahkan {len(result)} res==========")
 
        logging.info('=============== Skenario 3 : Read Pendidikan Tinggi, Prodi, Dosen, Mahasiswa, Matkul, Kelas  ==========')
        idUI = '0D1E63E9-CBFB-4546-A242-875C310083A5'
        logging.info("Read Pendidikan Tinggi")
        result = skenario('GET', f'data/pendidikan-tinggi/{idUI}', {}, tokenAdminPddikti)
        logging.info(result)
        logging.info("Read Prodi")
        result = skenario('GET', f'data/prodi/pt/{idUI}', {}, tokenAdminPT)
        logging.info(result['result'][:5])
        logging.info("Read Dosen")
        result = skenario('GET', f'data/dosen/pt/{idUI}', {}, tokenAdminPT)
        logging.info(result['result'][:5])
        logging.info("Read Mahasiswa")
        result = skenario('GET', f'data/mahasiswa/pt/{idUI}', {}, tokenAdminPT)
        logging.info(result['result'][:5])
        logging.info("Read Matkul")
        result = skenario('GET', f'data/matkul/pt/{idUI}', {}, tokenAdminPT)
        logging.info(result['result'][:5])
        logging.info("Read Kelas")
        result = skenario('GET', f'data/kelas/pt/{idUI}', {}, tokenAdminPddikti)
        logging.info(result['result'][:5])

        logging.info('=============== Skenario 3 : Dosen menambahkan nilai mahasiswa ke sistem Gradechain  ==========')
        data = {}
        result = skenario('POST', f'data/academicRecord/', data, tokenAdminPddikti)
        logging.info(result)
        logging.info('=============== Skenario 3 : Melihat nilai beserta sign-nya  ==========')
        logging.info('=============== Skenario 4 : Ijazah dan transkrip di approve oleh yang berhak  ==========')
        logging.info('=============== Skenario 3 : Mendapatkan identifier  ==========')
        data = {}
        result = skenario('POST', f'data/academicRecord/', data, tokenAdminPddikti)
        logging.info('=============== Skenario 3 : Memverifikasi ijazah menggunakan identifier  ==========')
        data = {}
        result = skenario('POST', f'data/academicRecord/', data, tokenAdminPddikti)


        