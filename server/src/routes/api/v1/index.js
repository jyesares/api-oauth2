import express from 'express';
import passport from 'passport';
import session from 'express-session';
import createError from 'http-errors';

import { loggerHttpRequest, logger } from '../../../config/logger';
import errors from '../../../config/errors.json';
import { setupTimeout, haltOnTimedout } from '../../../config/timeout';

import { postUsersHandler, getUsersHandler } from './users';
import {
  postClientsHandler,
  getClientsHandler,
  getClientByIdHandler,
} from './clients';
import { authorizeHandler, tokenHandler, revokeTokenHandler } from './oauth2';

// load middlewares
import '../../../api/v1/middlewares';

const app = express();

// set timeout
app.use(setupTimeout);

// load logger
app.use(loggerHttpRequest);

// session
app.use(session({
  secret: 'session key',
  saveUninitialized: true,
  resave: true,
}));

// Authentication Strategies
const isAuthenticated = passport.authenticate(
  ['basic', 'client-basic', 'bearer'],
  {
    session: false,
  },
);

/** USERS */
app.post('/users', postUsersHandler);
app.use(haltOnTimedout);
app.get('/users', getUsersHandler);
app.use(haltOnTimedout);

/** CLIENTS */
app.post('/clients', isAuthenticated, postClientsHandler);
app.use(haltOnTimedout);
app.get('/clients', isAuthenticated, getClientsHandler);
app.use(haltOnTimedout);
app.get('/clients/:id', isAuthenticated, getClientByIdHandler);
app.use(haltOnTimedout);

/** OAUTH2 */
app.get('/oauth2/authorize', authorizeHandler);
app.use(haltOnTimedout);
app.post('/oauth2/token', isAuthenticated, tokenHandler);
app.use(haltOnTimedout);
app.post('/oauth2/token/revoke', isAuthenticated, revokeTokenHandler);
app.use(haltOnTimedout);

/** INFO */
app.get('/info', isAuthenticated, (req, res, next) => {
  res.json({ user: { username: req.user.username, authenticated: true } });
});
app.use(haltOnTimedout);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
// eslint-disable-next-line
app.use((err, req, res, next) => {
  const error = errors[err]
    ? createError(errors[err].status, errors[err].message)
    : err;

  // set locals, only providing error in development
  res.locals.message = error.message;
  res.locals.error = req.app.get('env') === 'development' ? error : {};

  logger.error(`${error.status || 500} - ${err} - ${req.originalUrl} - ${req.method} - ${
    req.ip
  }`);

  // render the error page
  res.status(error.status || 500);
  res.send({ message: error.message });
});

export default app;
