import crypto from "crypto";

const keyLength = 64,
  saltLength = 32,
  encoding = "base64";

export function hashPassword(password: string) {
  return new Promise<string>((resolve, reject) => {
    const salt = crypto.randomBytes(saltLength);
    crypto.scrypt(password, salt, keyLength, (err, derivedKey) => {
      if (err) reject(err);
      else
        resolve(`${salt.toString(encoding)}:${derivedKey.toString(encoding)}`);
    });
  });
}

export function comparePassword(password: string, hash: string) {
  return new Promise<boolean>((resolve, reject) => {
    const [salt, key] = hash.split(":") as [string, string];
    const saltBuffer = Buffer.from(salt, encoding);
    const keyBuffer = Buffer.from(key, encoding);
    crypto.scrypt(password, saltBuffer, keyLength, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(crypto.timingSafeEqual(keyBuffer, derivedKey));
    });
  });
}
