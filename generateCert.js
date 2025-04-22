const selfsigned = require('selfsigned');
const fs = require('fs');

const attrs = [{ name: 'commonName', value: 'localhost' }];
const pems = selfsigned.generate(attrs, { days: 365 });

fs.mkdirSync('cert', { recursive: true });
fs.writeFileSync('cert/key.pem', pems.private);
fs.writeFileSync('cert/cert.pem', pems.cert);