/* global describe, test, expect, beforeEach, afterEach */

import sinon from 'sinon';

import { User } from '../../../../api/v1/models';

import { getUsers } from '../../../../api/v1/controllers';

describe('# user controller - get users', () => {
  afterEach(() => {
    if (User.find.restore) User.find.restore();
  });

  test('should return all users', async () => {
    const stub = sinon.stub(User, 'find');
    stub.resolves([
      {
        username: 'userA',
        password: 'passA',
      },
    ]);

    const users = await getUsers();

    expect(users).toBeInstanceOf(Array);
    users.map((user) => {
      expect(user).toBeInstanceOf(Object);
      expect(user).toHaveProperty('username');
      expect(user).toHaveProperty('password');
    });
  });

  test('should return empty array if no users in database', async () => {
    const stub = sinon.stub(User, 'find');
    stub.resolves([]);

    const users = await getUsers();

    expect(users).toBeInstanceOf(Array);
    expect(users.length).toBe(0);
  });

  test('should call to find method', async () => {
    const stub = sinon.stub(User, 'find');
    stub.resolves([
      {
        username: 'userA',
        password: 'passA',
      },
    ]);

    await getUsers();

    expect(stub.calledOnce).toBe(true);
  });

  test('should return internal server error (500) when database request fails', async () => {
    const stub = sinon.stub(User, 'find');
    stub.resolves(null);
    try {
      await getUsers();
    } catch (e) {
      // eslint-disable-next-line
      expect(e).toBeInstanceOf(Error);
      expect(e.status).toBe(500);
    }
  });
});
