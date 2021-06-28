/* eslint-disable no-process-exit, require-await */
'use strict';

import fastify from 'fastify';
import sensible from 'fastify-sensible';
import helmet from 'fastify-helmet';
import rawBody from 'fastify-raw-body';

const {
  PORT = 8000,
  HOST = '0.0.0.0',
} = process.env;

const server = fastify({
  logger: true,
  ignoreTrailingSlash: true,
});

const webhookHandler = function (request, reply) {
  console.log(request.rawBody)

  reply.send('ok')
}

server.register(sensible);
server.register(helmet);
server.register(rawBody, {
  global: false,
  runFirst: true,
});

server.route({
  method: 'POST',
  url: '/webhook',
  config: {
    rawBody: true,
  },
  handler: webhookHandler,
});

server.route({
  method: 'HEAD',
  url: '/webhook',
  config: {
    rawBody: true,
  },
  handler: async () => 'ok',
});

const start = async () => {
  try {
    await server.listen(PORT, HOST);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
