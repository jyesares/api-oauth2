import createError from 'http-errors';

import { User } from '../models';

import { validRequest } from './index';

/** POST /api/users */
async function postUsers({ body }) {
  if (!validRequest(body, ['username', 'password'])) throw createError(400);

  const user = new User({ ...body });
  try {
    await user.save();
  } catch (e) {
    throw createError(422);
  }

  return { username: user.username, password: user.password };
}

/** GET /api/users */
async function getUsers() {
  const users = await User.find({});
  return users.map(user => ({
    username: user.username,
    password: user.password,
  }));
}

export { postUsers, getUsers };
