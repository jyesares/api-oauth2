/* global describe, test, expect, beforeEach, afterEach */

import sinon from 'sinon';

import { Token, Code } from '../../../../api/v1/models';
import { token } from '../../../../api/v1/controllers';

process.env.JWT_SECRET = 'secret';

describe('# oauth2 controller - token', () => {
  afterEach(() => {
    if (Code.prototype.remove.restore) Code.prototype.remove.restore();
    if (Code.findOne.restore) Code.findOne.restore();
    if (Token.findOne.restore) Token.findOne.restore();
    if (Token.prototype.save.restore) Token.prototype.save.restore();
    if (Token.prototype.remove.restore) Token.prototype.remove.restore();
  });

  test('should return object with access_token, refresh_token, token_type and expires_in properties when grant type authorization code', async () => {
    const req = {
      body: {
        grant_type: 'authorization_code',
        code: 'codeA',
        redirect_uri: 'http://localhost',
        client_id: 'clientIdA',
      },
      user: {
        clientId: 'clientIdA',
      },
    };
    const acmFindOneStub = sinon.stub(Code, 'findOne');
    acmFindOneStub.resolves({
      value: 'codeA',
      clientId: 'clientIdA',
      redirectUri: encodeURIComponent('http://localhost'),
      userId: 'userIdA',
      remove: () => {},
    });

    const tokenSaveStub = sinon.stub(Token.prototype, 'save');
    tokenSaveStub.resolves({});

    const tokenReceived = await token(req);

    expect(tokenReceived).toBeInstanceOf(Object);
    expect(tokenReceived).toHaveProperty('access_token');
    expect(tokenReceived).toHaveProperty('expires_in');
    expect(tokenReceived.expires_in).toBe(300);
    expect(tokenReceived).toHaveProperty('token_type');
    expect(tokenReceived.token_type).toBe('Bearer');
    expect(tokenReceived).toHaveProperty('refresh_token');
  });

  test('should return object with access_token, refresh_token, token_type and expires_in properties when grant type is refresh token', async () => {
    const req = {
      body: {
        grant_type: 'refresh_token',
        refresh_token: 'refreshTokenA',
      },
      user: {
        clientId: 'clientIdA',
      },
    };
    const rtmFindOneStub = sinon.stub(Token, 'findOne');
    rtmFindOneStub.resolves({
      value: 'codeA',
      clientId: 'clientIdA',
      redirectUri: encodeURIComponent('http://localhost'),
      userId: 'userIdA',
      remove: () => {},
    });

    const tokenSaveStub = sinon.stub(Token.prototype, 'save');
    tokenSaveStub.resolves({});

    const tokenReceived = await token(req);

    expect(tokenReceived).toBeInstanceOf(Object);
    expect(tokenReceived).toHaveProperty('access_token');
    expect(tokenReceived).toHaveProperty('expires_in');
    expect(tokenReceived.expires_in).toBe(300);
    expect(tokenReceived).toHaveProperty('token_type');
    expect(tokenReceived.token_type).toBe('Bearer');
    expect(tokenReceived).toHaveProperty('refresh_token');
  });

  test('should return Bad Request Error (400) if body is empty', async () => {
    const req = {
      body: {},
      user: {
        clientId: 'clientIdA',
      },
    };

    try {
      await token(req);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e.status).toBe(400);
    }
  });

  test('should return Bad Request Error (400) if body does not contain all required properties', async () => {
    const req = {
      body: {
        code: 'codeA',
        redirect_uri: 'http://localhost',
        client_id: 'clientIdA',
      },
      user: {
        clientId: 'clientIdA',
      },
    };

    try {
      await token(req);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e.status).toBe(400);
    }
  });

  test('should return Bad Request Error (400) grant type not allowed', async () => {
    const req = {
      body: {
        grant_type: 'secret',
        code: 'codeA',
        redirect_uri: 'http://localhost',
        client_id: 'clientIdA',
      },
    };

    try {
      await token(req);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e.status).toBe(400);
    }
  });
});
