import express from 'express';

import { postClientsHandler, getClientsHandler } from './clients';
import { authorizeHandler, tokenHandler } from './oauth2';

const app = express();

/** CLIENTS */
app.post('/clients', postClientsHandler);
app.get('/clients', getClientsHandler);

/** OAUTH2 */
app.get('/oauth2/authorize', authorizeHandler);
app.post('/oauth2/token', tokenHandler);

export default app;
