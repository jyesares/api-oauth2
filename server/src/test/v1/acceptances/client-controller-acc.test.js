// /* global describe, test, expect, beforeEach, afterEach */

// import sinon from 'sinon';
// import mongoose from 'mongoose';

// import { getClients } from '../../../api/v1/controllers/client';

// import Client from '../../../api/v1/models/client';

// describe('# client controller', () =>
//   describe('* getClients', () => {
//     // beforeEach(() => {
//     //   sinon.stub(Client, 'find');
//     // });

//     // afterEach(() => {
//     //   Client.find.restore();
//     // });

//     test('should return all clients', async () => {
//       // const clientsDB = sinon.fake.returns({ })
//       // const clients = await getClients({ user: { _id: 'abcd' } });

//       const user = { user: { _id: 'abcd' } };

//       const stub = sinon.stub(Client, 'find');
//       stub.resolves([
//         {
//           name: 'name',
//           clientId: 'clientId',
//           clientSecret: 'clientSecret',
//           anotherInfo: {},
//         },
//       ]);

//       const clients = await getClients(user);

//       expect(clients).toBeInstanceOf(Array);
//       clients.map((client) => {
//         expect(client).toBeInstanceOf(Object);
//         expect(client).toBeInstanceOf(Object);
//         expect(client).toHaveProperty('name');
//         expect(client).toHaveProperty('clientId');
//         expect(client).toHaveProperty('clientSecret');
//       });
//     });
//   }));

test();
