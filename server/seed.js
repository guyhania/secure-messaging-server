require('dotenv').config();
const bcrypt = require('bcrypt');
const { encrypt } = require('./utils/crypto');
const { sequelize, User, Message } = require('./models');

(async () => {
  try {
    console.log('🔄 Seeding database...');
    await sequelize.sync({ force: true }); // Wipe and recreate tables

    const usersData = [
      { username: 'alice', password: 'pass123', publicKey: 'alice-key' },
      { username: 'bob', password: 'pass456', publicKey: 'bob-key' }
    ];


    const users = await Promise.all(usersData.map(async u => {
      const hash = await bcrypt.hash(u.password, 12);

      // Simulate private key encryption with the same password
      const fakePrivateKey = await crypto.subtle.generateKey(
        {
          name: 'RSA-OAEP',
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256',
        },
        true,
        ['encrypt', 'decrypt']
      );


      return await User.create({
        ...u,
        password: hash,
        encryptedPrivateKey: 'fakeEncryptedKey==',
        salt: 'fakeSalt==',
        iv: 'fakeIV=='
      });
    }));

    const messagesData = [
      { senderId: users[0].id, recipientId: users[1].id, content: 'Hello from Alice' },
      { senderId: users[1].id, recipientId: users[0].id, content: 'Hi Alice, this is Bob' }
    ];

    await Promise.all(messagesData.map(async m => {
      const encrypted = encrypt(m.content); // or real encryption
      await Message.create({
        ...m,
        content: encrypted,
        timestamp: new Date()
      });
    }));

    console.log('✅ Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
})();
