# CognigyWebClient
A bundled version of the CognigyClient which contains everything in a single 
file to get you started quickly. This is meant for integrations within a web browser.

## Installation
Just download the file **cognigy-web-client.js** and integrate it into your project.

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
        <button id=="button">Toggle Record</button>
 
        <script src="./cognigy-web-client.js"></script>
        <script>
            const options = {
                baseUrl: 'server-address',
                user: 'your-username',
                apikey: 'your-apikey',
                flow: 'your-flow-name',
                language: 'en-US',
                handleOutput: function(output) {
                    console.log("Text: " + output.text + "   Data: " + output.data);
                    
                    // use the clients "say" method to "speak" using html5-apis
                    client.say(output.text);
                }
            };
 
            var client = new Cognigy.CognigyWebClient(options);
            client.connect()
                .then(function() {
                    // 1) send an event directly
                    client.sendMessage("I like pizza", undefined);
                    
                    // 2) send a transcript that was recorded using the voice recognition api
                    client.registerOnRecEnd(function(transcript) {
                        // transcript is what does get recorded and translated to text (STT)
                        client.sendMessage(transcript, undefined);
                    });
                })
                .catch(function(error) {
                    console.log(error);
                });
             
            // a bit js code to make our button work
            var button = document.getElementById("button");
            if(button !== null) {
                button.onlick = function() {
                    // toggles the microphone on/off. The transcript output will be send to
                    // the onRecEnd method which you can register using "client.registerOnRecEnd"
                    client.toggleRec();                
                }    
            }
        </script>
    </body>
</html>
```
