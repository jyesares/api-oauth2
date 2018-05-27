/* global describe, test, expect, beforeEach, afterEach */

import sinon from 'sinon';

import { Client } from '../../../../api/v1/models';

import { getClients } from '../../../../api/v1/controllers';

describe('# client controller - get clients', () => {
  afterEach(() => {
    if (Client.find.restore) Client.find.restore();
  });

  test('should return all clients', async () => {
    const req = { user: { _id: 'abcd' } };
    const stub = sinon.stub(Client, 'find');
    stub.resolves([
      {
        name: 'name',
        clientId: 'clientId',
        clientSecret: 'clientSecret',
        anotherInfo: {},
      },
    ]);

    const clients = await getClients(req);

    expect(clients).toBeInstanceOf(Array);
    clients.map((client) => {
      expect(client).toBeInstanceOf(Object);
      expect(client).toHaveProperty('name');
      expect(client).toHaveProperty('clientId');
      expect(client).toHaveProperty('clientSecret');
    });
  });

  test('should return all clients', async () => {
    const req = { user: { _id: 'abcd' } };
    const stub = sinon.stub(Client, 'find');
    stub.resolves([]);

    const clients = await getClients(req);

    expect(clients).toBeInstanceOf(Array);
    expect(clients).toMatchObject([]);
  });

  test('should call to find method', async () => {
    const req = { user: { _id: 'abcd' } };
    const stub = sinon.stub(Client, 'find');
    stub.resolves([
      {
        name: 'name',
        clientId: 'clientId',
        clientSecret: 'clientSecret',
        anotherInfo: {},
      },
    ]);

    await getClients(req);

    expect(stub.calledOnce).toBe(true);
  });

  test('should call find with user as argument', async () => {
    const req = { user: { _id: 'abcd' } };
    const stub = sinon.stub(Client, 'find');
    stub.resolves([
      {
        name: 'name',
        clientId: 'clientId',
        clientSecret: 'clientSecret',
        anotherInfo: {},
      },
    ]);

    await getClients(req);

    // eslint-disable-next-line
    expect(stub.calledWith({ userId: req.user._id })).toBe(true);
  });

  test('should return bad request error (400) when user has no id', async () => {
    const req = { user: '' };

    try {
      await getClients(req);
    } catch (e) {
      // eslint-disable-next-line
      expect(e).toBeInstanceOf(Error);
      expect(e.status).toBe(400);
    }
  });

  test('should return entity process error (422) when user does not exist', async () => {
    const req = { user: { _id: 'abcd' } };
    const stub = sinon.stub(Client, 'find');
    stub.resolves(null);
    try {
      await getClients(req);
    } catch (e) {
      // eslint-disable-next-line
      expect(e).toBeInstanceOf(Error);
      expect(e.status).toBe(422);
    }
  });
});
