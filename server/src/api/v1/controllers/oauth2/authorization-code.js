import createError from 'http-errors';

import { Code } from '../../models';
import { validRequest } from '../index';

export default async function authorizationCodeMethod(body, client) {
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
