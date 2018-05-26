import passport from 'passport';
import { BasicStrategy } from 'passport-http';

import { User, Client } from '../../../api/v1/models';

passport.use(
  'basic',
  new BasicStrategy(async (username, password, done) => {
    let user;
    try {
      user = await User.findOne({ username });
    } catch (e) {
      return done(e);
    }

    if (!user) return done(null, false);

    const passwordValid = user.verifyPassword(password);
    if (!passwordValid) {
      return done(null, false);
    }

    return done(null, user);
  }),
);

passport.use(
  'client-basic',
  new BasicStrategy(async (clientId, clientSecret, done) => {
    let client;
    try {
      client = await Client.findOne({ clientId });
    } catch (e) {
      // error database request
      return done(e);
    }

    // user found
    if (client) {
      const secretValid = client.verifySecret(clientSecret);
      if (secretValid) {
        // pass matches
        return done(null, client);
      }
      // pass does not match
      return done(null, false);
    }

    // user not found
    return done(null, false);
  }),
);
