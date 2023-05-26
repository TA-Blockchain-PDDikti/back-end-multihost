import os

from importlib import reload
import logging
import jaydebeapi
import sshtunnel
import requests
import json

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
    logging.basicConfig(format='%(asctime)-4s %(levelname)-6s %(threadName)s:%(lineno)-3d %(message)s',
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
def skenario(no, endpoit, jsonData, token):
    logging.info(f"========= Run Skenario {no} =========")
    logging.info(f"Used Data: {jsonData}")
    headers = {'Authorization': f'Bearer {token}'}
    x = requests.post(f"{URL}/{endpoit}", json=jsonData, headers=headers)
    logging.info(f"========== Response API ========== {x.text}")
    logging.info(f"Status Code: {x.status_code}, \n Result: {x.text}")
    logging.info(f"========== Finish Skenario {no} =========")

# Enroll admin, register and login admin pddikti
def init():
    data = {
    "username": "admin",
    "password":"adminpw",
    "organizationName":"he1"
    }
    enroll =  requests.post(f"{URL}/auth/enroll", json=data)
    logging.info(enroll.text)

    data = {
    "username": "adminpddikti",
    "organizationName":"kemdikbud",
    "role": "admin pddikti"
    }
    register =  requests.post(f"{URL}/auth/register", json=data)
    logging.info(register.text)

    data = {
        "username": "adminpddikti",
        "password": register.text.password
    }

    login =  requests.post(f"{URL}/auth/login", json=data)
    logging.info(login.text)
    return login.text.token

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
        query1 = "SELECT id_sp as id, nm_lemb as 'nama', email as 'usernameAdmin' FROM dbo.satuan_pendidikan WHERE nm_lemb='Universitas Indonesia' FOR JSON AUTO;"
        query2 = "SELECT id_sms, id_sp, nm_lemb as 'nama' FROM dbo.sms where id_sp = 'Universitas Indonesia' and id_jns_sms = 3 FOR JSON AUT0;"
    
        logging.info("=============== Run SQL Query ==========")
        result1 = execute_query(conn, query1)
        logging.info("=============== Done Query ==========")
        data1 = json.loads(result1[0][0])[0]
        tokenAdminPddikti = init()
        skenario(1,"data/pendidikan-tinggi", data1, tokenAdminPddikti)

        logging.info("=============== Run SQL Query ==========")
        result1 = execute_query(conn, query1)
        logging.info("=============== Done Query ==========")
        data1 = json.loads(result1[0][0])[0]
        tokenAdminPddikti = init()
        skenario(1,"data/pendidikan-tinggi", data1, tokenAdminPddikti)

        logging.info("=============== Run SQL Query ==========")
        result1 = execute_query(conn, query1)
        logging.info("=============== Done Query ==========")
        data1 = json.loads(result1[0][0])[0]
        tokenAdminPddikti = init()
        skenario(1,"data/pendidikan-tinggi", data1, tokenAdminPddikti)

        logging.info("=============== Run SQL Query ==========")
        result1 = execute_query(conn, query1)
        logging.info("=============== Done Query ==========")
        data1 = json.loads(result1[0][0])[0]
        tokenAdminPddikti = init()
        skenario(1,"data/pendidikan-tinggi", data1, tokenAdminPddikti)
        