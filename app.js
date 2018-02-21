'use strict';

const host = '100.102.4.11:2181';

var Promise = require('promise');

function getRunPyPromise(pyProgramPath) {
    return new Promise(function (success, failed) {

        var ch_ps = require('child_process');
        var pyprog = ch_ps.spawn('python', [pyProgramPath]);

        pyprog.stdout.on('data', function (data) {
            success(data);
        });

        pyprog.stderr.on('data', function (data) {
            failed(data);
        });

    });
}

var kafka = require('kafka-node'),
    client = new kafka.Client(host),
    Consumer = kafka.Consumer,
    consumer = new Consumer(
        client,
        [
            {topic: 'dredd', partition: 0}
        ],
        {
            autoCommit: false
        }
    );

consumer.on('message', function (message) {

    getRunPyPromise('./python1.py').then(function (fromPy) {
        console.log(fromPy.toString());
    }, function (err) {
        console.log(err);
    });

    console.log(message.value);
});

consumer.on('error', function (err) {
    console.log(err);
});

