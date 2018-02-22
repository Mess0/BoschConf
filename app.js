'use strict';

const host = '100.102.4.11:2181';

const Promise = require('promise'),
    ch_ps = require('child_process'),
    kafka = require('kafka-node'),
    net = require('net'),
    express = require('express'),
    http = require('http'),
    url = require('url'),
    WebSocket = require('ws');

const app = express();

const server = http.createServer(app);
const wss = new WebSocket.Server({server});

function getRunPyPromise(pyProgramPath, arg) {
    return new Promise(function (success, failed) {

        const pyprog = ch_ps.spawn('python', [pyProgramPath, arg]);

        pyprog.stdout.on('data', function (data) {
            success(data);
        });

        pyprog.stderr.on('data', function (data) {
            failed(data);
        });

    });
}

const Kafka = function () {
    return {
        Consumer: function (topicName, clbkSucc, clbkErr) {
            const client = new kafka.Client(host),
                Consumer = kafka.Consumer,
                offset = new kafka.Offset(client);
            offset.fetch([{topic: topicName, partition: 0, time: -1}], function (err, data) {

                const latestOffset = data[topicName]['0'][0];

                //console.log("Current offset of topic " + topicName + " is: " + latestOffset);

                const consumer = new Consumer(client, [{
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

let measurements = [];
const measurementsLimit = 2000;

function onReceive(message) {
    const msg = JSON.parse(message.value);
    if (msg.device.deviceID === balluffMaster) {
        // data["measurements"][0]["series"]["Balluff Master: Distance on Port 0"]
        const ts = msg.measurements[0].ts;
        const measurement = msg.measurements[0].series["Balluff Master: Distance on Port 0"][0];
        getRunPyPromise('./sample_code.py', JSON.stringify(msg)).then(function (fromPy) {
            //getRunPyPromise('./DecisionTree.py', measurement).then(function (fromPy) {
            //  console.log(fromPy.toString());
            //console.log(fromPy.toString());
            const decision = fromPy.toString().trim();
            //let measurement = parseFloat(n);
            //console.log(decision);
            const result = {'ts': ts, 'measurement': measurement, 'decision': decision};
            // If limit reached, remove first item of array
            if (measurements.length > measurementsLimit)
                measurements.shift();
            measurements.push(result);
            // Turn on camera - stay 10 sec. --> turn it off
            // Broadcast measurement to all nodes
            wss.clients.forEach(function each(client) {
                // Send measurement if client is ready
                if (client.readyState === WebSocket.OPEN) client.send(JSON.stringify(result));
                else console.error("Client not ready to receive data.");
            });
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

const consumer = Kafka().Consumer('dredd', onReceive, onError);


//const client = net.createConnection("./socket");
//
//client.on("connect", function () {
//    console.log("Connected");
//});
//
//client.on("data", function (data) {
//    console.log(data);
//});

wss.on('connection', function connection(ws, req) {
    console.log("Connection established.");
});

const port = process.env.PORT || 8080;

const router = express.Router();

router.get('/', function (req, res) {
    if (measurements.length > 0)
        res.json({'measurements': measurements});
    else
        res.status(404).send('Not found');
});

app.use('/api', router);

app.listen(port);

console.log('httpd listening on port ' + port);

server.listen(8888, function listening() {
    console.log('wsd listening on %d', server.address().port);
});