import json
from pprint import pprintdata = json.load(open('package-lock.json'))pprint(data["name"]) #from pprint import pprintdata = json.load(open('test_Data.json'))pprint(data["om_points"])