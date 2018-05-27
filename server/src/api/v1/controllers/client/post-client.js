import createError from 'http-errors';

import { Client, User } from '../../models';
import { validRequest, uniqueId } from '../index';

/** POST /api/clients */
export default async function postClients({ body }) {
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
