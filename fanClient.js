const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://localhost:1883')
console.log("called connect")

//states on, off, turning on, turning off
var state = 'off'

client.on('connect', () => {
    console.log("connected")
    client.subscribe('fan/on')
    client.subscribe('fan/on_home')
    client.subscribe('fan/off')
    // Inform controllers that fan is connected
    client.publish('fan/connected', 'true')
    sendStateUpdate()
})

client.on('reconnect', () => {
    console.log(`|| Client -  - Connection to Broker Reconnected.`);
})

client.on('error', (err) => {
    console.log(`|| Client -  - Connection to Broker Not Ok - ${err}!`)
});

client.on('close', () => {
    console.log(`|| Client -  - Client Disconnected / Not able to connect to broker :( !`);
});

function sendStateUpdate () {
    console.log('sending state %s', state)
    client.publish('fan/state', state)
}

client.on('message', (topic, message) => {
    console.log('received message %s %s', topic, message)
    switch (topic) {
        case 'fan/on':
            return handleTurnOnFan(message)
        case 'fan/off':
            return handleTurnOffFan(message)
    }
})

function handleTurnOnFan (message) {
    if (state !== 'on' && state !== 'turning on') {
        console.log('turning on fan')
        state = 'turning on'
        sendStateUpdate()

        // simulate fan turned on after 5 seconds (would be listening to hardware)
        setTimeout(() => {
            state = 'on'
            sendStateUpdate()
        }, 5000)
    }
}

function handleTurnOffFan (message) {
    if (state !== 'off' && state !== 'turning off') {
        console.log('turning on fan')
        state = 'turning off'
        sendStateUpdate()

        // simulate fan turned off after 5 seconds (would be listening to hardware)
        setTimeout(() => {
            state = 'off'
            sendStateUpdate()
        }, 5000)
    }
}