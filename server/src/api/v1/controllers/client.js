import createError from 'http-errors';

import { Client, User } from '../models';
import { validRequest, uniqueIdUtil as uniqueId } from './index';

/** POST /api/clients */
async function postClients({ body }) {
  if (!validRequest(body, ['app_name', 'username'])) {
    throw createError(400);
  }

  const { app_name: appName, username } = body;

  const user = await User.findOne({ username });
  if (!user) {
    // user not found
    throw createError(422);
  }

  const clientId = uniqueId(8);
  const clientSecret = uniqueId(32);

  const client = new Client({
    name: appName,
    clientId,
    clientSecret,
    userId: user._id, //eslint-disable-line
  });

  try {
    await client.save();
  } catch (e) {
    throw createError(422);
  }
  return {
    name: client.name,
    clientId: client.clientId,
    clientSecret: client.clientSecret,
  };
}

/** GET /api/clients */
async function getClients({ user }) {
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

/** GET /api/clients */
async function getClientById({ user }, { id: clientId }) {
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

export { postClients, getClients, getClientById };
