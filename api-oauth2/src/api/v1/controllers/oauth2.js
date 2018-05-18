import jwt from 'jsonwebtoken';

import Code from '../models/code';
import Token from '../models/token';

/** AUTHORIZE */
function getRandomInt(limit) {
  return Math.floor(Math.random() * limit);
}

function uniqueId(codeLength) {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charsLen = chars.length;
  const arrayOfUndefined = new Array(codeLength).fill('');
  const buf = arrayOfUndefined.map(() => chars[getRandomInt(charsLen)]);
  return buf.join('');
}

async function authorize(req) {
  const {
    query: {
      response_type: responseType,
      client_id: clientId,
      redirect_uri: redirectUri,
      scope,
      state,
    },
  } = req;

  const code = new Code({
    value: uniqueId(16),
    clientId,
    redirectUri: encodeURIComponent(redirectUri),
  });

  await code.save();
  return { code };
}

/** TOKEN */

function signToken(user, secret) {
  return jwt.sign(
    {
      iss: 'jyesares',
      sub: user.id,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 1),
    },
    secret,
  );
}
async function token(req) {
  const {
    body: {
      grant_type: grantType,
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
    },
  } = req;

  const accessToken = signToken({ id: '1' }, process.env.JWT_SECRET);
  const refreshToken = signToken({ id: '2' }, process.env.JWT_SECRET);
  const expiresIn = 60 * 60;
  const tokenType = 'Bearer';

  const tokenInstance = new Token({
    accessToken,
    refreshToken,
    expiresIn,
    tokenType,
    clientId,
  });

  await tokenInstance.save();

  return {
    access_token: accessToken,
    token_type: tokenType,
    expires_in: expiresIn,
    refresh_token: refreshToken,
  };
}

export { authorize, token };
