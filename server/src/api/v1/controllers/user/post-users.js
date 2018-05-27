import createError from 'http-errors';

import { User } from '../../models';
import { validRequest } from '../index';

/** POST /api/users */
export default async function postUsers({ body }) {
  if (!validRequest(body, ['username', 'password'])) {
    throw createError(400);
  }

  const { username, password } = body;

  const user = new User({ username, password });
  try {
    await user.save();
  } catch (e) {
    throw createError(422);
  }

  return { username: user.username, password: user.password };
}
