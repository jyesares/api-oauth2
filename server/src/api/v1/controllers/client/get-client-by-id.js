import createError from 'http-errors';

import { Client } from '../../models';
import { validRequest } from '../index';

/** GET /api/clients/:id */
export default async function getClientById({ user }, { id: clientId }) {
  if (!validRequest(user, ['_id'])) {
    throw createError(400);
  }
  if (!clientId) {
    throw createError(400);
  }

  const { _id: userId } = user;

  const client = await Client.findOne({ userId, clientId });

  if (!client) {
    throw createError(422);
  }

  return {
    name: client.name,
    clientId: client.clientId,
    clientSecret: client.clientSecret,
  };
}
