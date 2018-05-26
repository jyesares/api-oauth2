import jwt from 'jsonwebtoken';
import createError from 'http-errors';

import { Client, Code, Token } from '../models';

import { validRequest, uniqueId } from './index';

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
async function authorize({ query }) {
  if (!validRequest(query, ['response_type', 'client_id', 'redirect_uri'])) {
    throw createError(400);
  }
  const {
    response_type: responseType,
    client_id: clientId,
    redirect_uri: redirectUri,
  } = query;

  if (!responseType || responseType !== 'code') {
    throw new Error('method not allowed');
  }
  if (!clientId) {
    throw new Error('clientId not provided');
  }
  if (!redirectUri) {
    throw new Error('redirectUri not provided');
  }

  const client = await Client.findOne({ clientId });

  if (!client) {
    throw new Error('client not found');
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
    throw createError(422);
  }

  return {
    code: code.value,
    redirect_uri: decodeURIComponent(code.redirectUri),
    clientId: code.clientId,
  };
}

/** TOKEN */
function signToken(clientId, secret) {
  return jwt.sign(
    {
      iss: 'jyesares',
      sub: clientId,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 1),
    },
    secret,
  );
}

async function authorizationCodeMethod(body, client) {
  if (!validRequest(body, ['code', 'redirect_uri', 'client_id'])) {
    throw createError(400);
  }
  const { code, redirect_uri: redirectUri, client_id: clientId } = body;

  const authCode = await Code.findOne({ value: code });
  if (!authCode) {
    throw new Error('code not found');
  }

  if (encodeURIComponent(redirectUri) !== authCode.redirectUri) {
    throw new Error('redirectUri does not match');
  }
  if (clientId !== authCode.clientId) {
    throw new Error('clientId does not match');
  }

  if (clientId !== client.clientId) {
    throw new Error('clientId provided and owner does not match');
  }

  try {
    await authCode.remove();
  } catch (e) {
    throw createError(500);
  }

  return {
    clientId,
    userId: authCode.userId,
  };
}

async function refreshTokenMethod(body, client) {
  if (!validRequest(body, ['refresh_token'])) throw createError(400);
  const { refresh_token: refreshToken } = body;

  const tokenReceived = await Token.findOne({
    refreshToken,
  });
  if (!tokenReceived) {
    throw new Error('refresh_token not found');
  }

  if (tokenReceived.clientId !== client.clientId) {
    throw new Error('ClientId mismatch');
  }

  try {
    await tokenReceived.remove();
  } catch (e) {
    throw createError(500);
  }

  return {
    clientId: tokenReceived.clientId,
    userId: tokenReceived.userId,
  };
}

// passport return results in user property of req
async function token({ body, user: client }) {
  if (!validRequest(body, ['grant_type'])) throw createError(400);

  const { grant_type: grantType } = body;

  switch (grantType) {
    case 'authorization_code':
      await authorizationCodeMethod(body, client);
      break;

    case 'refresh_token':
      await refreshTokenMethod(body, client);
      break;
    default:
      throw new Error('method not allowed');
  }

  const accessToken = signToken(client.clientId, process.env.JWT_SECRET);
  const refreshToken = signToken(client.clientId, process.env.JWT_SECRET);
  const expiresIn = 5 * 60; // 5 minutes
  const tokenType = 'Bearer';

  const tokenInstance = new Token({
    accessToken,
    refreshToken,
    expiresIn,
    tokenType,
    clientId: client.clientId,
    userId: client.userId,
    createdAt: Date.now(),
  });

  try {
    await tokenInstance.save();
  } catch (e) {
    throw createError(422);
  }

  return {
    access_token: accessToken,
    token_type: tokenType,
    expires_in: expiresIn,
    refresh_token: refreshToken,
  };
}

async function revoke({ body, user: client }) {
  if (!validRequest(body, ['token', 'token_type_hint'])) {
    throw createError(400);
  }

  const { token: tokenToRevoke, token_type_hint: tokenTypeHint } = body;
  let tokenToFind;
  let tokenInstance;

  switch (tokenTypeHint) {
    case 'access_token':
      tokenToFind = { accessToken: tokenToRevoke };
      break;
    case 'refresh_token':
      tokenToFind = { refreshToken: tokenToRevoke };
      break;
    default:
      throw new Error('method not allowed');
  }

  try {
    tokenInstance = await Token.findOne(tokenToFind);
  } catch (e) {
    throw createError(500);
  }

  if (!tokenInstance) {
    throw createError(304);
  }

  if (tokenInstance.clientId !== client.clientId) {
    throw createError(401);
  }

  try {
    await tokenInstance.remove();
  } catch (e) {
    throw createError(500);
  }

  return {};
}

export { authorize, token, revoke };
