const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://localhost:1883')

var state = ''
var connected = false

client.on('connect', () => {
    client.subscribe('fan/connected')
    client.subscribe('fan/state')
})

client.on('message', (topic, message) => {
    switch (topic) {
        case 'fan/connected':
            return handleFanConnected(message)
        case 'fan/state':
            return handleFanState(message)
    }
    console.log('No handler for topic %s', topic)
})

function handleFanConnected (message) {
    console.log('fan connected status %s', message)
    connected = (message.toString() === 'true')
}

function handleFanState (message) {
    state = message
    console.log('fan state update to %s', message)
}

function turnOnFan () {
    // can only turn on fan if we're connected to mqtt and fan isn't already on
    if (connected && state !== 'on') {
        // Ask the fan to turn on.
        client.publish('fan/on', 'true')
        client.publish('fan/on_home', 'true')

    }
}
function turnOffFan () {
    // can only turn off fan if we're connected to mqtt and fan isn't already off
    if (connected && state !== 'off') {
        // Ask the fan to turn off
        client.publish('fan/off', 'true')
    }
}

//--- For Demo Purposes Only ----//

// simulate turning on fan
setTimeout(() => {
    console.log('turn on fan')
    turnOnFan()
}, 5000)

// simulate urning off fan
setTimeout(() => {
    console.log('turn off fan')
    turnOffFan()
}, 20000)