import jwt from 'jsonwebtoken';

import customError from '../custom-error';

function createToken(body) {
  const {
    authorization_code, code, redirect_uri, client_id
  } = body;
  const requireFields = [username, password];

  if (requireFields.some(element => !element || element.length === 0)) {
    throw customError('INVALID_REQUEST');
  }

  const payload = { username, password, iat: Date.now() };
  const accessToken = jwt.sign(payload, 'secret');

  return {
    access_token: accessToken,
    token_type: 'bearer',
    expires_in: '300',
    refresh_token: accessToken
  };
}

function verifyToken(token) {
  let decoded;
  try {
    decoded = jwt.verify(token, 'secret');
  } catch (e) {
    throw e;
  }
}

export default createToken;