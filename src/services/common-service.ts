import { createCipheriv, createDecipheriv } from 'crypto';
import bcrypt from 'bcrypt';

import { env } from '../../env';
import { ZodError } from 'zod';

export class CommonService {
  static async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  static async verifyPassword(password: string, hash: string) {
    const isMatch = await bcrypt.compare(password, hash);
    if (!isMatch)
      throw new Error('логин или пароль некорректны');
  }

  static encrypt(text: string): string {
    const keyBuffer = Buffer.from(env.KEY, 'hex');
    const ivBuffer = Buffer.from(env.IV, 'hex');

    let cipher = createCipheriv(env.ALGORITHM, keyBuffer, ivBuffer);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
  }

  static decrypt(encryptedData: string): string {
    const ivBuffer = Buffer.from(env.IV, 'hex');
    const keyBuffer = Buffer.from(env.KEY, 'hex');

    const encryptedText = Buffer.from(encryptedData, 'hex');
    let decipher = createDecipheriv(env.ALGORITHM, keyBuffer, ivBuffer);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
}
