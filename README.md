# Description

This package is used to create a connection to a Cognigy webchat-endpoint.  
It works similar to the `socket-client`, but it will also fetch the webchat config object.

# Usage

```javascript
const WebchatClient = require('webchat-client');

(async () => {
    // create a client instance with a webchat config url
    const client = new WebchatClient('https://webchat.config.url');

    // register a handler for messages
    client.on('output', output => {
        console.log({ output });
    });

    // establish a socket connection (returns a promise)
    await client.connect();
    
    // send a message with text, text and data, data only
    client.sendMessage('hello there');
    client.sendMessage('hello there', { color: 'green' });
    client.sendMessage('', { color: 'green' });
})()
```
