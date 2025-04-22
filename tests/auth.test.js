const request = require('supertest');
const app = require('../server/app');
const { sequelize, User } = require('../server/models');
const bcrypt = require('bcrypt');

// Set JWT_SECRET for tests
process.env.JWT_SECRET = 'test-secret';

describe('🔐 Auth API', () => {
  const testUser = {
    username: 'testuser',
    password: 'supersecret',
    publicKey: 'mock-public-key',
    encryptedPrivateKey: 'mock-encrypted-key==',
    salt: 'mock-salt==',
    iv: 'mock-iv=='
  };

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    const hashed = await bcrypt.hash(testUser.password, 12);
    await User.create({
      username: testUser.username,
      password: hashed,
      publicKey: testUser.publicKey,
      encryptedPrivateKey: testUser.encryptedPrivateKey,
      salt: testUser.salt,
      iv: testUser.iv
    });
  });

  describe('POST /auth/login', () => {
    test('✅ logs in successfully with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: testUser.username, password: testUser.password });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('publicKey', testUser.publicKey);
    });

    test('❌ fails with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: testUser.username, password: 'wrongpassword' });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error', 'Invalid credentials');
    });

    test('❌ fails with non-existent user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'ghost', password: 'whatever' });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error', 'Invalid credentials');
    });
  });

  describe('POST /auth/register', () => {
    const newUser = {
      username: 'newuser',
      password: 'newpass123',
      publicKey: 'new-key',
      encryptedPrivateKey: 'enc-key==',
      salt: 'salt==',
      iv: 'iv=='
    };

    test('✅ registers a new user', async () => {
      const res = await request(app).post('/api/auth/register').send(newUser);
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('message', 'User registered');
      expect(res.body).toHaveProperty('userId');
    });

    test('❌ fails to register duplicate user', async () => {
      const res = await request(app).post('/api/auth/register').send(newUser);
      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('error');
    });

    test('❌ fails with missing fields', async () => {
      const res = await request(app).post('/api/auth/register').send({
        username: 'incomplete',
        password: '123'
        // missing publicKey etc.
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Missing fields');
    });
  });
});
