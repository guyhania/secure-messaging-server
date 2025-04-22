# 🔒 Secure Chat App (Node.js + React + End-to-End Encryption)

A secure, real-time messaging application built with **Node.js**, **React**, and **RSA/AES encryption**. Messages are encrypted per-recipient and decrypted client-side, with live updates using **Server-Sent Events (SSE)** 

---

## 🧠 Features

- ✅ User registration & login with JWT
- ✅ RSA keypair per user (public stored, private AES-encrypted)
- ✅ End-to-end encrypted messaging using `crypto.subtle`
- ✅ Real-time message delivery with Server-Sent Events
- ✅ Online user tracking (no WebSockets)
- ✅ AES encryption of private key with password-based key
- ✅ SSE broadcasting to online recipients only
- ✅ Audit logging (Winston)
- ✅ PostgreSQL + Sequelize ORM

---

## 🧱 Tech Stack

| Layer       | Stack                          |
|-------------|--------------------------------|
| Frontend    | React + TypeScript + Tailwind |
| Backend     | Node.js + Express             |
| Realtime    | Server-Sent Events (SSE)      |
| Encryption  | RSA-OAEP & AES-GCM (Web Crypto API) |
| Auth        | JWT + bcrypt                  |
| ORM         | Sequelize                     |
| DB          | PostgreSQL                    |
| Logging     | Winston                       |
| Concurrency | PM2                           |

## Notes
- To Meet the 10K Connections Target
  * Enable PM2 Cluster Mode using: pm2 start server/app.js -i max
  * If the app is deployed in the cloud we can deploy multiple instances using: ( Kubernetes (k8s),Docker Swarm,WS ECS)
- Points to improve:
    - Set up Nginx or HAProxy in front of Node.js for load balancing between PM2 processes
    - Set Typescript in the server
    - Add Rate Limiting using express-rate-limit
    - Add Password Reset Flow
    - Add testss

---
## 🚀 Getting Started

### 🛠 Prerequisites

- Node.js (v18+)
- PostgreSQL (create a DB called `secure_messaging_dev`)
- OpenSSL (for generating HTTPS certs)

---

###  Backend Setup

```bash
git clone https://github.com/yourname/secure-chat-app.git
cd secure-messaging-server
npm install

1. Configure .env:
    PORT=3000
    JWT_SECRET=your_jwt_secret
    DB_USER=your_pg_user
    DB_PASS=your_pg_password
    DB_NAME=secure_messaging_dev

2. Generate self-signed TLS certificate:
    mkdir cert
    openssl req -nodes -new -x509 -keyout cert/key.pem -out cert/cert.pem

3. Run migrations and seed:
    npx sequelize-cli db:migrate --config server/config/config.js
    npm run seed

4. Start HTTPS server:
    npm run dev

### Frontend Setup
```bash

cd secure-messaging-client
npm install

1. Create .env in root:
    VITE_API_BASE_URL=https://localhost:3000/api
2. Start dev server: 
    npm run dev
