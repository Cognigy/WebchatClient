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
                }
            };

            var client = new Cognigy.CognigyWebClient(options);
            client.connect()
                .then(function() {
                    client.sendMessage("I like pizza", undefined);
                })
                .catch(function(error) {
                    console.log(error);
                });
        </script>
    </body>
</html>
```
