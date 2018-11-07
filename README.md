# CognigyWebClient
Repo for the cognigy web client which can be used to connect to the Cognigy.AI platform from a web browser.

This repository supports the two following options:
* install the cognigy web-client from npm and integrate it within your own build-pipeline
e.g. using webpack, rollup and others
* simply use the "cognigy-web-client.js" and integrate it within your web page. This file
does already contain all dependencies, so your ready to go.

## Installation
### Version for integrating into your own build-pipeline
```
npm i @cognigy/cognigy-web-client --save
```

### Version for integrating in a web page
* Download the ``cognigy-web-client.js`` within the ``/static`` folde
* Add this javascript file to your webpage and load it: ``<script src="./cognigy-web-client.js"></script>``


## Example
This is a minimal example of how to integrate the congigy-web-client into a web-page.
Just see the html-example below.

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Title</title>
    </head>
    <body>
        <h1>See your dev-console for the magic that happens.</h1>
        <button id="button">Toggle Record</button>
 
        <script src="./cognigy-web-client.js"></script>
        <script>
            window.onload = function() {
                const options = {
                    /** Required fields */
                    baseUrl: 'server-address',
                    URLToken: 'endoint-url-token',
                    userId: 'your-username',
                    sessionId: 'unique-session-Id',
                    channel: 'my-website',
                    forceWebsockets: false,
                    handleOutput: function(output) {
                        console.log("Text: " + output.text + "   Data: " + output.data);

                        /** use the clients voice synthesis api to 'speak' */
                        client.say(output.text);
                    },

                    /** Optional fields */
                    keepMarkup: true,
                    reconnection: true,
                    interval: 1000,
                    expiresIn: 5000,
                    passthroughIp: "127.0.0.1",
                    handleError: (error) => { console.log(error); },
                    handleException: (error) => { console.log(error); },
                    handlePing: (finalPing) => { console.log("On final ping"); }
                };

                const speechOptions = {
                    /** Required fields */
                    language: 'en-US',
                    
                    /** Optional fields */
                    voiceName: "voice-name",
                    voiceRate: 20,
                    voicePitch: 20,
                }

                const client = new Cognigy.CognigyWebClient(options);
                client.connect()
                    .then(function() {
                        /** Send the event directly */
                        client.sendMessage("I like pizza", undefined);

                        /** Send a transcript that was recorded using the voice recognition api from your browser */
                        client.registerOnRecEnd(function(transcript) {
                            client.sendMessage(transcript, undefined);
                        });
                    })
                    .catch(function(error) {
                        console.log(error);
                    });

                /** a bit js code to make our button work */
                const button = document.getElementById("button");
                if(button !== null) {
                    button.onclick = function() {
                        /** toggles the microphone on/off. The transcript output will be send to the onRecEnd method which you can register using 'client.registerOnRecEnd' */
                        client.toggleRec();
                    }
                }
            }
        </script>
    </body>
</html>
```
