import jwt from 'jsonwebtoken';

export default function signToken(clientId, secret) {
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
