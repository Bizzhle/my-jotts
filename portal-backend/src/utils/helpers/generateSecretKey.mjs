import * as crypto from 'crypto';
import * as fs from 'fs';

const generateSecret = () => crypto.randomBytes(64).toString('hex');

// const saveSecret = (secret) => {
//   const secrets = JSON.parse(fs.readFileSync('secrets.json', 'utf-8'));
//   const expiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
//   secrets.push({ secret, expiryDate });
//   fs.writeFileSync('secrets.json', JSON.stringify(secrets, null, 2));
// };

const secret = generateSecret();
saveSecret(secret);
console.log('New secret generated');
