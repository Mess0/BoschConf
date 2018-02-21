import sys, json
from kafka import KafkaConsumer


# fp = open("C:/Users/Tasso/Documents/BCW18/bla.json", "r")

# join a consumer group for dynamic partition assignment and offset commits

consumer = KafkaConsumer('dreddswitch', group_id = 'Clusters', bootstrap_servers=['100.102.4.11:9092'], auto_offset_reset='earliest')

distance = [0.0]
switch = [0]


for msg in consumer:
    data = json.loads(msg.value)
    for meas in data["measurements"]:
        try:
            val = meas["series"]["Balluff Master: Distance on Port 0"]
            distance = val
            #print(json.dumps(distance))
        except:
            pass

        try:
            val = meas["series"]["Balluff Master: Switch state on Port 0"]
            switch = val
            #print(json.dumps(switch))
        except:
            pass
    print(json.dumps(distance), json.dumps(switch))