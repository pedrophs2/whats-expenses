const client = require('./src/client');
const { handleMessage } = require('./src/steps');

client.on('message', handleMessage);

client.initialize();