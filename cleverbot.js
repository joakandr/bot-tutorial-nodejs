var HTTPS = require('https');
var cool = require('cool-ascii-faces');
var Cleverbot = require('./lib/cleverbot');
var dotenv = require('dotenv');

var cleverBotID = process.env.CLEVERBOT_ID;
var cleverKey = process.env.CLEVERKEY;

cleverbot = new Cleverbot;
cleverbot.configure({
    botapi: cleverKey
});

var pre_request;

function respond() {
    var request = JSON.parse(this.req.chunks[0]);

    if (!pre_request) {
        pre_request = request;
        console.log(request);

        if (request.text && request.name != "Cleverbot") {

            var input = encodeURIComponent(request.text);

            cleverbot.write(input, function (response) {
                console.log('sending ' + input + ' to cleverbot');
                postMessage(response.output);

            });
        } else {
            console.log("don't care");
        }
    } else if (pre_request == request) {
        pre_request = false;
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

        console.log('sending ' + botResponse + ' to groupme');

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