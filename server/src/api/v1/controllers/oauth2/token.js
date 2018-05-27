import createError from 'http-errors';

import { Token } from '../../models';
import {
  authorizationCodeMethod,
  refreshTokenMethod,
  tokenUtil as signToken,
} from './index';
import { validRequest } from '../index';

// passport return results in user property of req
export default async function token({ body, user: client }) {
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
      throw createError(400);
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
