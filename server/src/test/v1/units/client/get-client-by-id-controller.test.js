/* global describe, test, expect, beforeEach, afterEach */

import sinon from 'sinon';

import { Client } from '../../../../api/v1/models';

import { getClientById } from '../../../../api/v1/controllers';

describe('# client controller - get client by id', () => {
  afterEach(() => {
    if (Client.findOne.restore) Client.findOne.restore();
  });

  test('should return a client', async () => {
    const req = { user: { _id: 'abcd' }, params: { id: 'abcd' } };
    const stub = sinon.stub(Client, 'findOne');
    stub.resolves({
      name: 'name',
      clientId: 'clientId',
      clientSecret: 'clientSecret',
      anotherInfo: {},
    });

    const client = await getClientById(req, req.params);

    expect(client).toBeInstanceOf(Object);
    expect(client).toHaveProperty('name');
    expect(client).toHaveProperty('clientId');
    expect(client).toHaveProperty('clientSecret');
  });

  test('should call to findOne method', async () => {
    const req = { user: { _id: 'abcd' }, params: { id: 'abcd' } };
    const stub = sinon.stub(Client, 'findOne');
    stub.resolves({
      name: 'name',
      clientId: 'clientId',
      clientSecret: 'clientSecret',
      anotherInfo: {},
    });

    await getClientById(req, req.params);

    expect(stub.calledOnce).toBe(true);
  });

  test('should call findOne with user and params as arguments', async () => {
    const req = { user: { _id: 'abcd' }, params: { id: 'abcd' } };
    const stub = sinon.stub(Client, 'findOne');
    stub.resolves({
      name: 'name',
      clientId: 'clientId',
      clientSecret: 'clientSecret',
      anotherInfo: {},
    });

    await getClientById(req, req.params);

    // eslint-disable-next-line
    expect(
      stub.calledWith({ userId: req.user._id, clientId: req.params.id })).toBe(true);
  });

  test('should return bad request error (400) when user has no id', async () => {
    const req = { user: {}, params: { id: 'abcd' } };

    try {
      await getClientById(req, req.params);
    } catch (e) {
      // eslint-disable-next-line
      expect(e).toBeInstanceOf(Error);
      expect(e.status).toBe(400);
    }
  });

  test('should return entity process error (422) when user does not exist', async () => {
    const req = { user: { _id: 'abcd' }, params: { id: 'abcd' } };
    const stub = sinon.stub(Client, 'findOne');
    stub.resolves(null);
    try {
      await getClientById(req, req.params);
    } catch (e) {
      // eslint-disable-next-line
      expect(e).toBeInstanceOf(Error);
      expect(e.status).toBe(422);
    }
  });
});
