import bcrypt from 'bcrypt';
import crypto from 'crypto';

const StringHelper = {
  generateToken(length, lowCase = true, highCase = true, numbers = true) {
    let result = '';
    let characters = lowCase ? 'abcdefghijklmnopqrstuvwxyz' : '';
    characters = highCase ? `${characters}ABCDEFGHIJKLMNOPQRSTUVWXYZ` : characters;
    characters = numbers ? `${characters}0123456789` : characters;
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(crypto.randomInt(charactersLength));
    }
    return result;
  },

  safeCompare(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string') return false;
    const bufferA = Buffer.from(a);
    const bufferB = Buffer.from(b);
    if (bufferA.length !== bufferB.length) return false;
    return crypto.timingSafeEqual(bufferA, bufferB);
  },

  async generateBcrypt(stringToEncrypt) {
    return bcrypt.hash(stringToEncrypt, 13);
  },

  async compareBcrypt(plainText, hash) {
    return bcrypt.compare(plainText, hash);
  },

  createHash: elements => {
    const stringToHash = Array.isArray(elements) ? elements.join('') : `${elements}`;
    return crypto.createHash('sha1').update(stringToHash).digest('base64');
  },
};

export default StringHelper;
