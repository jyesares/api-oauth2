import express from 'express';

import login from './login';
import logout from './logout';

import postClients from './client';

const app = express();

app.use('/login', login);
app.use('/logout', logout);

app.post('/clients', postClients);

export default app;