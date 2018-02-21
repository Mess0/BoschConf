import sys, json


fp = open("example.json", "r")
data = json.load(fp)
for distance in data["measurements"][0]["series"]["Dredd Balluff master: Distance on Port 0"]:
    print(json.dumps(distance))
