#for x in range(0, 1000):
#    print "%d" % (x)

import json

data = {}  
data['sensor'] = [] 
#
# data['sensor'].append({  
#     'y': 'x'
# })
# data['sensor'].append({  
#     'y': 'x'
# })
# data['sensor'].append({  
#     'y': 'x'
# })

from math import*
Fs=8000
f=500
sample=1000
a=[0]*sample
for n in range(sample):
    a[n]=sin(2*pi*f*n/Fs)
    print "%f" % (a[n])
    data['sensor'].append({  
    	'y': a[n]
	})

with open('data.json', 'w') as outfile:
    json.dump(data, outfile)
