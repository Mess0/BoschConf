'use strict';

var kafka = require('kafka-node'),
    client = new kafka.Client('100.102.4.11:2181'),
    Consumer = kafka.Consumer,
    consumer = new Consumer(
        client,
        [
            {topic: 'AI_Factory', partition: 0}
        ],
        {
            autoCommit: false
        }
    );

consumer.on('message', function (message) {
    console.log(message.value);
});

consumer.on('error', function (err) {
    console.log(err);
});