'use strict';

const host = '100.102.4.11:2181';

var Promise = require('promise'),
    fs = require('fs'),
    ch_ps = require('child_process'),
    kafka = require('kafka-node');

function getRunPyPromise(pyProgramPath) {
    return new Promise(function (success, failed) {

        var pyprog = ch_ps.spawn('python', [pyProgramPath]);

        pyprog.stdout.on('data', function (data) {
            success(data);
        });

        pyprog.stderr.on('data', function (data) {
            failed(data);
        });

    });
}

var Kafka = function () {
    return {
        Consumer: function (topicName, clbkSucc, clbkErr) {
            var client = new kafka.Client(host),
                Consumer = kafka.Consumer,
                offset = new kafka.Offset(client);
            offset.fetch([{topic: topicName, partition: 0, time: -1}], function (err, data) {

                var latestOffset = data[topicName]['0'][0];

                console.log("Current offset of topic " + topicName + " is: " + latestOffset);

                var consumer = new Consumer(client, [{
                    topic: topicName,
                    partition: 0,
                    offset: latestOffset
                }], {autoCommit: false, fromOffset: true});
                consumer.on('message', clbkSucc);
                consumer.on('error', clbkErr);
            });
        }
    }
};


function onReceive(message) {
    console.log(message.value);

}

function onError(error) {
    console.log(err);
}

var consumer = Kafka().Consumer('dredd', onReceive, onError);

