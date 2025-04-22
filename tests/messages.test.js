const request = require('supertest');
const app = require('../server/app');
const { sequelize, User, Message } = require('../server/models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

process.env.JWT_SECRET = 'test-secret'; // ensure this is available
const JWT_SECRET = process.env.JWT_SECRET;

describe('💬 Encrypted Messages API', () => {
  let alice, bob;
  let tokenAlice, tokenBob;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    // Create two users
    const alicePassword = await bcrypt.hash('alicepass', 12);
    const bobPassword = await bcrypt.hash('bobpass', 12);

    alice = await User.create({
      username: 'alice',
      password: alicePassword,
      publicKey: 'alice-public-key',
      encryptedPrivateKey: 'alice-encrypted-key==',
      salt: 'salt==',
      iv: 'iv=='
    });

    bob = await User.create({
      username: 'bob',
      password: bobPassword,
      publicKey: 'bob-public-key',
      encryptedPrivateKey: 'bob-encrypted-key==',
      salt: 'salt==',
      iv: 'iv=='
    });

    tokenAlice = jwt.sign({ userId: alice.id, username: alice.username }, JWT_SECRET, { expiresIn: '1h' });
    tokenBob = jwt.sign({ userId: bob.id, username: bob.username }, JWT_SECRET, { expiresIn: '1h' });
  });

  test('✅ should store an encrypted message from Alice to Bob', async () => {
    const res = await request(app)
      .post('/api/messages/send')
      .set('Authorization', `Bearer ${tokenAlice}`)
      .send({
        content: 'Hello Bob!',
        recipientId: bob.id
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toHaveProperty('content');
    expect(res.body.message.senderId).toBe(alice.id);
    expect(res.body.message.recipientId).toBe(bob.id);
  });

  test('✅ Bob should retrieve messages sent to him (including encrypted)', async () => {
    const res = await request(app)
      .get('/api/messages')
      .set('Authorization', `Bearer ${tokenBob}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.messages)).toBe(true);
    expect(res.body.messages.length).toBeGreaterThan(0);

    const msg = res.body.messages.find(m => m.senderId === alice.id);
    expect(msg).toBeDefined();
    expect(msg).toHaveProperty('content');
    expect(msg.recipientId).toBe(bob.id);
  });

  test('❌ should not send message if content is missing', async () => {
    const res = await request(app)
      .post('/api/messages/send')
      .set('Authorization', `Bearer ${tokenAlice}`)
      .send({ recipientId: bob.id }); // missing content

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Missing content or recipientId');
  });

  test('❌ should not get messages without token', async () => {
    const res = await request(app).get('/api/messages');
    expect(res.statusCode).toBe(401);
  });
});
