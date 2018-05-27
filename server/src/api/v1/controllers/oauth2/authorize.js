import createError from 'http-errors';

import { Client, Code } from '../../models';
import { uniqueId, validRequest } from '../index';

// Create OAuth2 server
// const server = oauth2orize.createServer();

// Register de/serialization functions.
// Store in session several http request between authorize and token
// eslint-disable-next-line
// server.serializeClient((client, cb) => cb(null, client._id));
// server.deserializeClient(async (id, cb) => {
//   let client;
//   try {
//     client = await Client.findOne({ _id: id });
//   } catch (e) {
//     logger.error(e);
//     return cb(e);
//   }

//   if (!client) {
//     const e = new Error('client not found');
//     logger.info(e);
//     return cb(e);
//   }

//   return cb(null, client);
// });

/** AUTHORIZE */
export default async function authorize({ query }) {
  if (!validRequest(query, ['response_type', 'client_id', 'redirect_uri'])) {
    throw createError(400);
  }
  const {
    response_type: responseType,
    client_id: clientId,
    redirect_uri: redirectUri,
  } = query;

  if (responseType !== 'code') {
    // throw new Error('method not allowed');
    throw createError(422);
  }

  const client = await Client.findOne({ clientId });

  if (!client) {
    // throw new Error('client not found');
    throw createError(500);
  }

  const code = new Code({
    value: uniqueId(16),
    clientId,
    redirectUri: encodeURIComponent(redirectUri),
    userId: client.userId,
  });

  try {
    await code.save();
  } catch (e) {
    throw createError(500);
  }

  return {
    code: code.value,
    redirect_uri: decodeURIComponent(code.redirectUri),
    clientId: code.clientId,
  };
}
