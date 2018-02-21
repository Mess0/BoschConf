'use strict';

const host = '100.102.4.11:2181';

var Promise = require('promise'),
    fs = require('fs'),
    ch_ps = require('child_process'),
    kafka = require('kafka-node');

function getRunPyPromise(pyProgramPath, arg) {
    return new Promise(function (success, failed) {

        var pyprog = ch_ps.spawn('python', [pyProgramPath, arg]);

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

                //console.log("Current offset of topic " + topicName + " is: " + latestOffset);

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

const balluffMaster = "dredd_balluff_master";
//const kafkaDataPath = "kafka_data.json";


function onReceive(message) {
    var msg = JSON.parse(message.value);
    if (msg.device.deviceID === balluffMaster) {
        //console.log("Received data from " + balluffMaster + ":");
        //console.log(msg);
        //var stream = fs.createWriteStream(kafkaDataPath);
        //stream.write(JSON.stringify(msg));
        //stream.end();

        getRunPyPromise('./sample_code.py', JSON.stringify(msg)).then(function (fromPy) {
            console.log(fromPy.toString());
        }, function (err) {
            console.log(err);
        });

    } else {
        console.error("Received data from unknown node (" + msg.device.deviceID + ").");
        console.error(msg);
    }

}

function onError(error) {
    console.error(error);
}

var consumer = Kafka().Consumer('dredd', onReceive, onError);

