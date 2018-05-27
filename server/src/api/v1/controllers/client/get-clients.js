import createError from 'http-errors';

import { Client } from '../../models';
import { validRequest } from '../index';

/** GET /api/clients */
export default async function getClients({ user }) {
  if (!validRequest(user, ['_id'])) {
    throw createError(400);
  }

  const { _id: userId } = user;
  const clients = await Client.find({ userId });

  if (!clients) {
    throw createError(422);
  }

  return clients.map(client => ({
    name: client.name,
    clientId: client.clientId,
    clientSecret: client.clientSecret,
  }));
}
