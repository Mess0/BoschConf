import json
import sys
from pprint import pprint

data = json.loads(sys.argv[1])
#data = json.load(open('kafka_data.json'))

pprint(data["measurements"][0]["series"]["Balluff Master: Distance on Port 0"])
