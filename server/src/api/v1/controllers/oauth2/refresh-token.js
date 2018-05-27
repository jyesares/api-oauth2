import createError from 'http-errors';

import { Token } from '../../models';
import { validRequest } from '../index';

export default async function refreshTokenMethod(body, client) {
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
