import express from 'express';

import { postClients, getClients } from './client';

const app = express();

/** CLIENTS */
app.post('/clients', postClients);
app.get('/clients', getClients);

export default app;
