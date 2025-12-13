import JSEncrypt from 'jsencrypt';
import CryptoJS from 'crypto-js';

const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;
export const decryptResponse = (encrypted = {
  encryptedKey: '',
  iv: '',
  data: ''
}) => {
  try {
    if (!privateKey) {
      throw new Error("PRIVATE_KEY is not defined in environment variables.");
    }
    const decryptor = new JSEncrypt();
    decryptor.setPrivateKey(privateKey);

    const decryptedKeyBase64 = decryptor.decrypt(encrypted.encryptedKey);
    if (!decryptedKeyBase64) throw new Error('RSA decryption failed');

    const key = CryptoJS.enc.Base64.parse(decryptedKeyBase64);
    const iv = CryptoJS.enc.Base64.parse(encrypted.iv);
    const encryptedData = encrypted.data;

    const decrypted = CryptoJS.AES.decrypt(encryptedData, key, { iv });
    const jsonStr = decrypted.toString(CryptoJS.enc.Utf8);

    return JSON.parse(jsonStr);
  } catch (err) {
    console.error('Failed to decrypt response:', err);
    return null;
  }
};