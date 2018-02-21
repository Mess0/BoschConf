import sys, json
from kafka import KafkaConsumer


# fp = open("example.json", "r")

# join a consumer group for dynamic partition assignment and offset commits

consumer = KafkaConsumer('dredd', group_id = 'Clusters', bootstrap_servers=['100.102.4.11:9092'], auto_offset_reset='earliest')


for msg in consumer:
    data = json.loads(msg.value)
    for distance in data["measurements"][0]["series"]["Balluff Master: Distance on Port 0"]:
        print(json.dumps(distance))
