import os

from importlib import reload
import logging
import jaydebeapi
import sshtunnel
import json
import csv
import os


# Extract all envvars
JS_HOST = "kawung.cs.ui.ac.id"
Js_PORT = 12122
JS_USER = os.getenv('KW_USER', 'farzana.hadifa')
JS_PW = os.getenv('PARAFRASE', "IMASEMKFEO")
JS_PKEY = '/home/farzana/Documents/TA/farzana.hadifa_kawung.key' 
DB_SERVER = "localhost"
DB_PORT = 16161
DB_NAME = "pddikti"
DB_USER = os.getenv('DB_USER', 'sa')
DB_PW = os.getenv('DB_PASSWORD', "MySecretP@ssw0rd")
print("P",JS_PW)
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

def write_to_csv(filename, data):
    fp = open(f'{filename}.csv', 'w')
    myFile = csv.writer(fp) 
    myFile.writerows(data)
    fp.close()

with sshtunnel.SSHTunnelForwarder((JS_HOST, Js_PORT), **conn_inputs) as tunnel:
    logging_file("access-db-3")
    logging.info('========== SSH Tunnelling To Kawung =========')
    # Set the server and port to be the local SSH tunnel values
    server = tunnel.local_bind_address[0]
    port = tunnel.local_bind_address[1]
    logging.info(f"Server: {server}, port: {port}")

    conn_string = f"""jdbc:sqlserver://{server}:{port};databaseName={DB_NAME};queryTimeout=600;encrypt=true;trustServerCertificate=true;"""
    with jaydebeapi.connect(
        "com.microsoft.sqlserver.jdbc.SQLServerDriver",
        conn_string,
        [DB_USER, DB_PW],
        os.path.join(JARS_PATH, 'mssql-jdbc-12.2.0.jre8.jar')
    ) as conn:
        logging.info(f'======== Connect To Database PDDIKTI {conn_string} =========')

        logging.info("=============== Query SQL ==========")
        # logging.info("=============== Pendidikan Tinggi ==========")
        # query = "SELECT id_sp as id, nm_lemb, email as 'usernameAdmin' FROM dbo.satuan_pendidikan WHERE nm_lemb='Universitas Indonesia'"
        # result = execute_query(conn, query)
        # write_to_csv("pendidikan-tinggi", result)
        # logging.info(f"Export {len(result)} data to csv")

        # logging.info("=============== Prodi ==========")
        # query = "SELECT id_sms, id_sp, nm_lemb FROM dbo.sms where id_sp = '0D1E63E9-CBFB-4546-A242-875C310083A5' and id_jns_sms = '3' and id_jenj_didik = '30'"
        # result = execute_query(conn, query)
        # write_to_csv("prodi", result)
        # logging.info(f"Export {len(result)} data to csv")

        # logging.info("=============== Dosen ==========")
        # query = "SELECT dbo.reg_ptk.id_reg_ptk, dbo.reg_ptk.id_sp, dbo.reg_ptk.id_sms, dbo.sdm.nm_sdm, dbo.sdm.nidn, dbo.sdm.email FROM dbo.reg_ptk INNER JOIN dbo.sdm ON dbo.sdm.id_sdm = dbo.reg_ptk.id_sdm WHERE dbo.sdm.id_jns_sdm = '12' and dbo.reg_ptk.soft_delete !='1' and dbo.reg_ptk.id_sms in ('5028F1E9-E954-4F62-9244-BAB2C3E3A475', '91FAA6C6-376B-4125-A6D1-A1E6FF1EE485','D5D36093-9656-43FE-BFCC-C1ED1873EECB','2D4B55AE-7813-4682-B2E2-88D98EF74369','B48C0C75-A475-49FA-B69C-9B2731FDF272')"
        # result = execute_query(conn, query)
        # write_to_csv("dosen-1", result)
        # logging.info(f"Export {len(result)} data to csv")

        # logging.info("=============== Mahasiswa ==========")
        # query = "SELECT reg.id_reg_pd, reg.id_sp, reg.id_sms, pd.nm_pd , reg.nipd, pd.email, reg.mulai_smt  FROM dbo.reg_pd as reg  INNER JOIN dbo.peserta_didik  as pd ON reg.id_pd = pd.id_pd  WHERE reg.mulai_smt in('20161') and reg.soft_delete !='1' and reg.id_sms in ('5028F1E9-E954-4F62-9244-BAB2C3E3A475', '91FAA6C6-376B-4125-A6D1-A1E6FF1EE485','D5D36093-9656-43FE-BFCC-C1ED1873EECB','2D4B55AE-7813-4682-B2E2-88D98EF74369','B48C0C75-A475-49FA-B69C-9B2731FDF272')"
        # result = execute_query(conn, query)
        # write_to_csv("mahasiswa-1", result)
        # logging.info(f"Export {len(result)} data to csv")


        # logging.info("=============== Jabatan ==========")
        # query = "SELECT  dbo.reg_ptk.id_reg_ptk, dbo.sdm.nm_sdm, dbo.reg_ptk.id_sms , tgs.nm_jab_tgs, jab.sk_tugas_tambah, jab.tst_sk_tambah, jab.tmt_sk_tambah  FROM dbo.reg_ptk INNER JOIN dbo.sdm ON dbo.sdm.id_sdm = dbo.reg_ptk.id_sdm INNER JOIN dbo.tugas_tambahan as jab on jab.id_sdm = dbo.sdm.id_sdm INNER JOIN ref.jab_tgs as tgs on jab.id_jab_tgs = tgs.id_jab_tgs  WHERE dbo.sdm.id_jns_sdm = '12' and dbo.reg_ptk.id_sms in (SELECT id_sms FROM dbo.sms where id_sp = '0D1E63E9-CBFB-4546-A242-875C310083A5' and id_jns_sms = '3' )and tgs.id_jab_tgs != 99 and jab.soft_delete != 1"
        # result = execute_query(conn, query)
        # write_to_csv("dosen-jabatan", result)
        # logging.info(f"Export {len(result)} data to csv")

        # logging.info("=============== Matkul ==========")
        # query = "SELECT id_mk, id_sms, nm_mk, sks_mk, kode_mk  FROM dbo.matkul  WHERE id_sms in ('5028F1E9-E954-4F62-9244-BAB2C3E3A475', 'D5D36093-9656-43FE-BFCC-C1ED1873EECB') and soft_delete != 1"
        # result = execute_query(conn, query)
        # write_to_csv("matkul-4", result)
        # logging.info(f"Export {len(result)} data to csv")
        
        # logging.info("=============== Kelas ==========")
        # query = "SELECT  id_kls, id_mk, id_sms, nm_kls, sks_mk, id_smt FROM dbo.kelas_kuliah WHERE id_smt in ('20161', '20162', '20171', '20172', '20181', '20182', '20191', '20192', '20201') and id_sms in (SELECT id_sms FROM dbo.sms where id_sp = '0D1E63E9-CBFB-4546-A242-875C310083A5' and id_jns_sms = '3' and id_jenj_didik = '30')"
        # result = execute_query(conn, query)
        # write_to_csv("kelas", result)
        # logging.info(f"Export {len(result)} data to csv")
        
        logging.info("=============== Nilai ==========")
        # file = open("pd_list.txt", "r")
        # ids = file.readlines()
        # file.close()

        # query_string = "SELECT nilai.*, ajar.id_reg_ptk FROM nilai_smt_mhs as nilai INNER JOIN akt_ajar_dosen as ajar ON nilai.id_kls = ajar.id_kls WHERE id_reg_pd IN ("

        # for i in range (0,50):
        #     if i != 0:
        #         query_string += ", "
        #     id = ids[i].replace("\n", "")
        #     query_string += id

        # query_string += ") AND nilai_huruf IS NOT NULL AND nilai_indeks IS NOT NULL AND nilai.soft_delete = 0"

        # print(query_string)

        # query = "SELECT npd.id_kls, ajar.id_reg_ptk, npd.id_reg_pd, npd.nilai_angka, npd.nilai_huruf, npd.nilai_indeks FROM dbo.nilai_smt_mhs AS npd INNER JOIN dbo.akt_ajar_dosen AS ajar ON npd.id_kls = ajar.id_kls WHERE npd.nilai_indeks IS NOT NULL AND npd.nilai_huruf IS NOT NULL AND npd.soft_delete !='1' AND npd.id_reg_pd IN (SELECT TOP 50 reg.id_reg_pd FROM dbo.reg_pd AS reg INNER JOIN dbo.peserta_didik AS pd ON reg.id_pd = pd.id_pd WHERE reg.mulai_smt in('20161') AND reg.soft_delete !='1' AND pd.soft_delete !='1' AND reg.id_sms IN ('5028F1E9-E954-4F62-9244-BAB2C3E3A475', 'D5D36093-9656-43FE-BFCC-C1ED1873EECB'))"
        # result = execute_query(conn, query)
        # write_to_csv("nilai-3", result)
        # logging.info(f"Export {len(result)} data to csv")


        # query = "SELECT DISTINCT kls.id_kls, kls.id_sms, kls.id_mk, kls.nm_kls, smt.nm_smt, kls.sks_mk FROM kelas_kuliah AS kls INNER JOIN dbo.nilai_smt_mhs AS npd ON npd.id_kls = kls.id_kls INNER JOIN dbo.akt_ajar_dosen AS ajar ON npd.id_kls = ajar.id_kls INNER JOIN ref.semester AS smt ON kls.id_smt = smt.id_smt WHERE npd.nilai_indeks IS NOT NULL AND npd.nilai_huruf IS NOT NULL AND npd.soft_delete !='1' AND npd.id_reg_pd IN (SELECT TOP 50 reg.id_reg_pd FROM dbo.reg_pd AS reg INNER JOIN dbo.peserta_didik AS pd ON reg.id_pd = pd.id_pd WHERE reg.mulai_smt in('20161') AND reg.soft_delete !='1' AND pd.soft_delete !='1' AND reg.id_sms IN ('5028F1E9-E954-4F62-9244-BAB2C3E3A475', 'D5D36093-9656-43FE-BFCC-C1ED1873EECB'))"
        # result = execute_query(conn, query)
        # write_to_csv("kelas-1", result)
        # logging.info(f"Export {len(result)} data to csv")

        query = "SELECT DISTINCT kls.id_kls, ajar.id_reg_ptk FROM kelas_kuliah AS kls INNER JOIN dbo.nilai_smt_mhs AS npd ON npd.id_kls = kls.id_kls INNER JOIN dbo.akt_ajar_dosen AS ajar ON npd.id_kls = ajar.id_kls WHERE npd.nilai_indeks IS NOT NULL AND npd.nilai_huruf IS NOT NULL AND npd.soft_delete !='1' AND npd.id_reg_pd IN (SELECT TOP 50 reg.id_reg_pd FROM dbo.reg_pd AS reg INNER JOIN dbo.peserta_didik AS pd ON reg.id_pd = pd.id_pd WHERE reg.mulai_smt in('20161') AND reg.soft_delete !='1' AND pd.soft_delete !='1' AND reg.id_sms IN ('5028F1E9-E954-4F62-9244-BAB2C3E3A475', 'D5D36093-9656-43FE-BFCC-C1ED1873EECB'))"
        result = execute_query(conn, query)
        write_to_csv("kelas-dosen", result)
        logging.info(f"Export {len(result)} data to csv")


        # logging.info("=============== Ijazah ==========")
        # query = "SELECT id_sp as id, nm_lemb as 'nama', email as 'usernameAdmin' FROM dbo.satuan_pendidikan WHERE nm_lemb='Universitas Indonesia'"
        # result = execute_query(conn, query)
        # write_to_csv("ijazah", result)
        # logging.info(f"Export {len(result)} data to csv")

        logging.info("=============== Finish Query SQL ==========")


       