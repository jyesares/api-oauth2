import passport from 'passport';
import { Strategy as BearerStrategy } from 'passport-http-bearer';

import { Token, User } from '../../../api/v1/models';

// import logger from '../../../routes/api/v1/logger';

function isValidToken(token) {
  const now = Date.now();
  const diff = Math.floor((now - token.createdAt) / 1000);
  const tokenExpirationMiliseconds = token.expiresIn;

  if (diff < tokenExpirationMiliseconds) return true;
  return false;
}

passport.use(
  'bearer',
  new BearerStrategy(async (accessToken, done) => {
    let token;
    let user;
    try {
      token = await Token.findOne({ accessToken });
    } catch (e) {
      // error database request
      return done(e);
    }
    // token not found
    if (!token) {
      return done('TOKEN_NOT_FOUND');
    }

    // token found
    // check expiration of token
    if (!isValidToken(token)) {
      return done(null, false);
    }

    try {
      user = await User.findOne({ _id: token.userId });
    } catch (e) {
      // error database request
      return done(e);
    }

    // userId of token found
    return done(null, user);
  }),
);
