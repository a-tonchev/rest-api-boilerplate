const crypto = require('crypto');

const algorithm = 'aes-256-ctr';
const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
const iv = crypto.randomBytes(16);

const test = '2sdCMER2SaNWv5z';

const encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

const decrypt = (hashString) => {
  try {
    const [ivValue, text] = hashString.split(':');
    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(ivValue, 'hex'));
    const decrypted = Buffer.concat([decipher.update(Buffer.from(text, 'hex')), decipher.final()]);

    return decrypted.toString();
  } catch (e) {
    console.log('ERROR on decryption!');
    return '';
  }
};

const data = encrypt(test);
console.log('encrypted: ', data);

console.log('#####');

console.log('decrypted: ', decrypt(data));
