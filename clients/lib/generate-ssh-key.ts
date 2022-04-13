import toast from '@lib/toast';

function rsa2text(buffer: ArrayBuffer, isPrivate = 0): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = window.btoa(binary);
  let text = '-----BEGIN ' + (isPrivate ? 'PRIVATE' : 'PUBLIC') + ' KEY-----\n';
  text += base64.replace(/[^\x00-\xff]/g, '$&\x01').replace(/.{64}\x01?/g, '$&\n'); // eslint-disable-line
  text += '\n-----END ' + (isPrivate ? 'PRIVATE' : 'PUBLIC') + ' KEY-----';
  return text;
}

export default async function getRsaKeys(name: string): Promise<{ privateKey: string, publicKey: string } | null> {
  try {
    const key = await window.crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 2048, // can be 1024, 2048, or 4096
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: { name: 'SHA-512' }, // can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
      },
      true, // whether the key is extractable (i.e. can be used in exportKey)
      ['encrypt', 'decrypt'], // must be ["encrypt", "decrypt"] or ["wrapKey", "unwrapKey"]
    );

    if (!key) {
      return null;
    }

    const privateKeyData = await window.crypto.subtle.exportKey(
      'pkcs8',
      key.privateKey as CryptoKey,
    );

    const publicKeyData = await window.crypto.subtle.exportKey(
      'spki',
      key.publicKey as CryptoKey,
    );

    const privateKey = rsa2text(privateKeyData, 1);
    const publicKey = rsa2text(publicKeyData);

    return {
      privateKey,
      publicKey: `${publicKey} ${name}`,
    };
  } catch (error) {
    toast.error(error);
    return null;
  }
}
