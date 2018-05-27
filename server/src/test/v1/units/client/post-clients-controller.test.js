/* global describe, test, expect, beforeEach, afterEach */

import sinon from 'sinon';

import { Client, User } from '../../../../api/v1/models';

import { postClients } from '../../../../api/v1/controllers';

describe('# client controller - post clients', () => {
  afterEach(() => {
    if (User.findOne && User.findOne.restore) User.findOne.restore();
    if (Client.prototype.save.restore) Client.prototype.save.restore();
  });

  test('should return a client when posting a client', async () => {
    const req = { body: { app_name: 'App Name', username: 'userA' } };
    const findOneStub = sinon.stub(User, 'findOne');
    const saveStub = sinon.stub(Client.prototype, 'save');
    findOneStub.resolves({
      username: 'userA',
      password: 'passA',
    });
    saveStub.resolves({});

    const client = await postClients(req);

    expect(client).toBeInstanceOf(Object);
    expect(client).toHaveProperty('name');
    expect(client.name).toBe('App Name');
    expect(client).toHaveProperty('clientId');
    expect([client.clientId]).toEqual(expect.arrayContaining([expect.stringMatching(/^([a-zA-Z0-9]){8}$/)]));
    expect(client).toHaveProperty('clientSecret');
    expect([client.clientSecret]).toEqual(expect.arrayContaining([expect.stringMatching(/^([a-zA-Z0-9]){32}$/)]));
  });

  test('should call to findOne method and save', async () => {
    const req = { body: { app_name: 'App Name', username: 'userA' } };
    const findOneStub = sinon.stub(User, 'findOne');
    const saveStub = sinon.stub(Client.prototype, 'save');
    findOneStub.resolves({
      username: 'userA',
      password: 'passA',
    });
    saveStub.resolves({});

    await postClients(req);

    expect(findOneStub.calledOnce).toBe(true);
    expect(saveStub.calledOnce).toBe(true);
  });

  test('should return Bad Request (400) when no provided app name', async () => {
    const req = { body: {} };
    try {
      await postClients(req);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e.status).toBe(400);
    }
  });

  test('should return Unprocessable Entity (422) when username does not exist', async () => {
    const req = { body: { app_name: 'App Name', username: 'userA' } };
    const findOneStub = sinon.stub(User, 'findOne');
    findOneStub.resolves(null);
    try {
      await postClients(req);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e.status).toBe(422);
    }
  });
});
