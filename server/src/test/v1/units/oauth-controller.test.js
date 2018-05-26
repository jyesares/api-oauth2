/* global describe, test, expect, beforeEach, afterEach */

import sinon from 'sinon';

import { Client, Code, Token } from '../../../api/v1/models';
import { authorize, token, revoke } from '../../../api/v1/controllers';

describe('# oauth2 controller', () => {
  describe('* postUsers', () => {
    afterEach(() => {
      if (Client.findOne.restore) Client.findOne.restore();
      if (Code.prototype.save.restore) Code.prototype.save.restore();
    });

    test('should return empty object', async () => {
      const req = {
        query: {
          response_type: 'code',
          client_id: 'userIdA',
          redirect_uri: 'http://localhost',
        },
      };
      const findOneStub = sinon.stub(Client, 'findOne');
      findOneStub.resolves({
        userId: 'userIdA',
      });
      const saveStub = sinon.stub(Code.prototype, 'save');
      saveStub.resolves({});

      const code = await authorize(req);
      expect(code).toBeInstanceOf(Object);
      expect(code).toHaveProperty('code');
      expect(code).toHaveProperty('redirect_uri');
      expect(code).toHaveProperty('clientId');
    });
  });
});
