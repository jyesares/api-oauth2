import createError from 'http-errors';

import { User } from '../../models';

/** GET /api/users */
export default async function getUsers() {
  const users = await User.find({});
  if (!users) {
    throw createError(500);
  }
  return users.map(user => ({
    username: user.username,
    password: user.password,
  }));
}
