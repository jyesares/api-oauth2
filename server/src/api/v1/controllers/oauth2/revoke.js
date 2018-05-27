import createError from 'http-errors';

import { Token } from '../../models';
import { validRequest } from '../index';

export default async function revoke({ body, user: client }) {
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
      throw createError(400);
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
