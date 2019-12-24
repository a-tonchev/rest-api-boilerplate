import bcrypt from 'bcrypt';

export default class StringHelper {
  static generateToken(length, lowCase = true, highCase = true, numbers = true) {
    let result = '';
    let characters = lowCase ? 'abcdefghijklmnopqrstuvwxyz' : '';
    characters = highCase ? `${characters}ABCDEFGHIJKLMNOPQRSTUVWXYZ` : characters;
    characters = numbers ? `${characters}0123456789` : characters;
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  static async generateBcrypt(stringToEncrypt) {
    return bcrypt.hash(stringToEncrypt, 13);
  }

  static async compareBcrypt(plainText, hash) {
    return bcrypt.compare(plainText, hash);
  }
}
