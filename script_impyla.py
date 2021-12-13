import sys
from impala.dbapi import connect
from impala.util import as_pandas
host = sys.argv[1]
port = int(sys.argv[2])
query = sys.argv[3]
user = sys.argv[4]
password = sys.argv[5]
conn = connect(host=host, port=port)  #(host='10.147.254.162', port=21050)
cursor = conn.cursor()
cursor.execute(query)
#for row in cursor:
#    print(row)

#df = as_pandas(cursor)
#print(df)

#data = df.to_json(orient='index')
#print(data)

names = [metadata[0] for metadata in cursor.description]
#print(names)

print('[')
i = 1
for row in cursor:
	if i > 1 : print(',')
	print(dict(zip(names, row)))
	i = i+1

print(']')