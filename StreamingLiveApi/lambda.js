//import { createServer, proxy } from 'aws-serverless-express';
//import { init } from './src/app';
const { createServer, proxy } = require('aws-serverless-express');
const { init } = require('./dist/app');


const server = createServer(init);

module.exports.universal = function universal(event, context) {

    return proxy(server, event, context);
}