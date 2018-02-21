import json
from pprint import pprint

data = json.load(open('test_Data.json'))

pprint(data["measurements"][0]["series"]["distance"])
