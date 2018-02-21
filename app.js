'use strict';

var kafka = require('kafka-node'),
    client = new kafka.Client('100.102.4.11:2181'),
    Consumer = kafka.Consumer,
    //Producer = kafka.Producer,
    //  producer = new Producer(client),
    //  payloads = [
    //      {topic: 'DREDD', messages: 'DREDD', partition: 0}
    //  ],
    consumer = new Consumer(
        client,
        [
            {topic: 'DREDD', partition: 0}
        ],
        {
            autoCommit: false
        }
    );

//producer.on('ready', function () {
//    producer.send(payloads, function (err, data) {
//        console.log(data);
//    });
//});


//producer.on('error', function (err) {
//    console.log(err);
//});
//

consumer.on('message', function (message) {
    console.log(message.value);
});

consumer.on('error', function (err) {
    console.log(err);
});