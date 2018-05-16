import express from 'express';

import createToken from './oauth';

const app = express();

function login(req, res, next) {
  try {
    res.json(createToken(req.body));
  } catch (e) {
    next(e);
  }
}

app.post('/', login);

export default app;