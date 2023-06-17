file = open("pd_list.txt", "r")
ids = file.readlines()
file.close()

query_string = "SELECT * FROM nilai_smt_mhs WHERE id_reg_pd IN ("

for i in range (0,50):
    if i != 0:
        query_string += ", "
    id = ids[i].replace("\n", "")
    query_string += id

query_string += ") AND nilai_huruf IS NOT NULL AND nilai_indeks IS NOT NULL AND soft_delete = 0"

print(query_string)

