import sys
from impala.dbapi import connect
from impala.util import as_pandas
host = sys.argv[1]
port = int(sys.argv[2])
query = sys.argv[3]
# query = "INSERT INTO ll_mwa_iot.pulsation (device_code,suction_time,flush_time,suction_realtime,flush_realtime) VALUES ('d_006',55,10,51,7)"
user = sys.argv[4]
password = sys.argv[5]
conn = connect(host=host, port=port, user=user, password=password)  #(host='10.147.254.162', port=21050)
cursor = conn.cursor(user=user)
cursor.execute(query)
#for row in cursor:
#    print(row)

#df = as_pandas(cursor)
#print(df)

#data = df.to_json(orient='index')
#print(data)

# names = [metadata[0] for metadata in cursor.description]
#print(names)

# print('[')
# i = 1
# for row in cursor:
# 	if i > 1 : print(',')
# 	print(dict(zip(names, row)))
# 	i = i+1

# print(']')