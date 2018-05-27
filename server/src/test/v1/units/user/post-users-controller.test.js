/* global describe, test, expect, beforeEach, afterEach */

import sinon from 'sinon';

import { User } from '../../../../api/v1/models';

import { postUsers } from '../../../../api/v1/controllers';

describe('# user controller - post users', () => {
  afterEach(() => {
    if (User.prototype.save.restore) User.prototype.save.restore();
  });

  test('should return a user when posting a user', async () => {
    const req = { body: { username: 'userA', password: 'passA' } };
    const stub = sinon.stub(User.prototype, 'save');
    stub.resolves({});

    const user = await postUsers(req);

    expect(user).toBeInstanceOf(Object);
    expect(user).toHaveProperty('username');
    expect(user.username).toBe('userA');
    expect(user).toHaveProperty('password');
    expect(user.password).toBe('passA');
  });

  test('should call to save method', async () => {
    const req = { body: { username: 'userA', password: 'passA' } };
    const stub = sinon.stub(User.prototype, 'save');
    stub.resolves({});

    await postUsers(req);

    expect(stub.calledOnce).toBe(true);
  });

  test('should return Bad Request (400) when no provided username or password', async () => {
    const req = { body: {} };
    try {
      await postUsers(req);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e.status).toBe(400);
    }
  });

  test('should return Unprocessable Entity (422) when username does not exist', async () => {
    const req = { body: { username: 'userA', password: 'passA' } };
    const stub = sinon.stub(User.prototype, 'save');
    stub.resolves(null);
    try {
      await postUsers(req);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e.status).toBe(422);
    }
  });
});
