const fs = require('fs');
const https = require('https');
const app = require('./app');

const PORT = process.env.PORT || 3000;

const options = {
  key: fs.readFileSync('./cert/key.pem'),
  cert: fs.readFileSync('./cert/cert.pem'),
};

https.createServer(options, app).listen(PORT, () => {
  console.log(`🔒 HTTPS Server running at https://localhost:${PORT}`);
});
