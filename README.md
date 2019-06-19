# Cognigy Webchat Client

This package is used to create a connection to Cognigy.AI via a Webchat Endpoint.  
You can read about setting up a Webchat Endpoint in [our platform documentation](https://docs.cognigy.com/docs/deploy-a-webchat-20-endpoint).  
Internally, this package builds up opon the [SocketClient](https://github.com/Cognigy/SocketClient).

## Installation
Install this module using the following `npm` command
```
npm install @cognigy/webchat-client
```

## Usage

```javascript
const WebchatClient = require('webchat-client');

(async () => {
    // create a client instance with a webchat config url
    const client = new WebchatClient('https://webchat.config.url');

    // register a handler for messages
    client.on('output', output => {
        console.log("Text: " + output.text + "   Data: " + output.data);
    });

    // establish a socket connection (returns a promise)
    await client.connect();
    
    // send a message with text, text and data, data only
    client.sendMessage('hello there');
    client.sendMessage('hello there', { color: 'green' });
    client.sendMessage('', { color: 'green' });
})()
```

## Internal Socket Events
You can subscribe to the following events from the `WebchatClient`:

```javascript
client.on('finalPing', () => {
    console.log('bot is done processing a message');
});
```

You can read about the events you can subscribe to in the [SocketClient repository](https://github.com/Cognigy/SocketClient#socket-events)

## Options
You can pass a second argument to `WebchatClient` to set additional options as follows:

```javascript
const client = new WebchatClient('https://webchat.config.url', {
    userId: 'user1234'
});
```

| Name | Type | Default | Description '
| - | - | - | - |
| `channel` | string | `"webchat-client"` | the name of the channel (can be used for analytics purposes)
| `forceWebsockets` | boolean | `true` on IE and Safari, otherwise `false` | if this is enabled, there will be no fallback to http polling


You can read about the rest of the options you can pass in the [SocketClient repository](https://github.com/Cognigy/SocketClient#socket-events).




