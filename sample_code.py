import json
import sys
from pprint import pprint

data = json.loads(sys.argv[1])

measurements = data["measurements"][0]["series"]["Balluff Master: Distance on Port 0"]

if len(measurements) > 0:
   # pprint(measurements[0])
    meas = measurements[0]
    if meas > 200 or meas < 100:
        print 0
    else:
        print 1
