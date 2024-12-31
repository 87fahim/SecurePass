import * as crypto from "crypto";

export default class Encrypter {
  static algorithm = "aes256";
  static key = crypto.scryptSync('60482418eb47135921965d6d5bc9ee55', "salt", 32);

  static encrypt(clearText) {
    const iv = crypto.randomBytes(16);
    try {
      const cipher = crypto.createCipheriv(
        Encrypter.algorithm,
        Encrypter.key,
        iv
      );
      console.log("ENCRYPTING: ", clearText, this.key, iv)
      const encrypted = cipher.update(clearText, "utf8", "hex");
      return [
        
        Buffer.from(iv).toString("hex"),
        encrypted + cipher.final("hex"),
      ].join("|");
    } catch (error) {
      return error;
    }
  }

  static decrypt(encryptedText) {
    try {
      const [ iv, encrypted] = encryptedText.split("|");
      if (!iv) throw new Error("IV not found");
      const decipher = crypto.createDecipheriv(
        Encrypter.algorithm,
        Encrypter.key,
        Buffer.from(iv, "hex")
      );
      return decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8");
    } catch (error) {
      return error;
    }
  }
}