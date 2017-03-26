var HTTPS = require('https');
var cool = require('cool-ascii-faces');
var Cleverbot = require('./lib/cleverbot');

var cleverBotID = process.env.CLEVERBOT_ID;
var cleverKey = process.env.CLEVERKEY;

cleverbot = new Cleverbot;
cleverbot.configure({
    botapi: cleverKey
});

function respond() {
    var request = JSON.parse(this.req.chunks[0]);

    if (request.text) {

        var input = encodeURIComponent(request.text);

        this.res.writeHead(200);
        cleverbot.write(input, function (response) {
            console.log(response.output);
            postMessage(response.output);
            this.res.end();
        });
    }
};

function postMessage(response) {
    var botResponse, options, body, botReq;

    botResponse = response;

    options = {
        hostname: 'api.groupme.com',
        path: '/v3/bots/post',
        method: 'POST'
    };

    body = {
        "bot_id": cleverBotID,
        "text": botResponse
    };

    console.log('sending ' + botResponse + ' to ' + botID);

    botReq = HTTPS.request(options, function (res) {
        if (res.statusCode == 202) {
            //neat
        } else {
            console.log('rejecting bad status code ' + res.statusCode);
        }
    });

    botReq.on('error', function (err) {
        console.log('error posting message ' + JSON.stringify(err));
    });
    botReq.on('timeout', function (err) {
        console.log('timeout posting message ' + JSON.stringify(err));
    });
    botReq.end(JSON.stringify(body));
}


exports.respond = respond;
