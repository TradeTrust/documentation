---
id: remarks-encryption-decryption
title: Remarks Encryption/Decryption
sidebar_label: Remarks Encryption/Decryption
---

The tradetrust CLI now supports **encrypted remarks** for enhanced security when executing commands. This guide explains how to use the updated title-escrow command with encrypted remarks and highlights the changes introduced in this version.

#### Key highlights of Remarks feature:

**_Remarks are optional:_** Users can choose to include remarks or leave the field blank.
Encryption for Security: If provided, remarks are encrypted using the specified encryption key for confidentiality and stored securely in the endorsement chain.
This feature improves traceability and transparency while maintaining privacy, ensuring only authorized parties can decrypt and view the remarks.

##### Encryption with ChaCha20

The ChaCha20 encryption algorithm is used to secure remarks. It is a stream cipher known for its:

_High Performance:_ Optimized for speed and efficiency.
Strong Security: Resistant to cryptographic attacks.
Simplicity: Uses a key and nonce to produce a stream of encrypted output.
How It Works:

_Key:_ A 32-byte encryption key is derived to ensure security.
Nonce: A 12-byte unique value is used to ensure the encryption output varies, even if the same key and message are used.
Encryption Process: ChaCha20 generates a pseudorandom stream of bytes that is XORed with the message to produce the ciphertext.

### **Encryption**

> The `encrypt` function encrypts plaintext messages using the **ChaCha20** encryption algorithm, ensuring the security and integrity of the input data. It supports custom keys and nonces, returning the encrypted message in hexadecimal format.

#### Function Signature

function encrypt(message: string, key: string, nonce?: string): string;

#### Description

The `encrypt` function is a utility for encrypting text messages using **ChaCha20**, a stream cipher known for its speed and security. This function ensures that the key meets the 32-byte requirement and that a valid 12-byte nonce is either supplied or generated.

The output is a hexadecimal string representing the encrypted data.

#### Parameters

- `message` (string): The plaintext message to encrypt.
- `key` (string): The encryption key, which will be transformed into a 32-byte key.
- `nonce` (string, optional): A 12-byte nonce for encryption. If omitted, a new nonce will be generated automatically.

#### Returns

- `string`: The encrypted message encoded in hexadecimal format.

#### Errors

- Runtime errors: Issues during key transformation, nonce generation, or encryption.

#### Usage

#### Example 1: Basic Encryption

```ts
import { encrypt } from "@trustvc/trustvc";

const message = "Hello, ChaCha20!";
const key = "my-secret-key";
const encryptedMessage = encrypt(message, key);

console.log(`Encrypted Message: ${encryptedMessage}`);
```

#### Example 2: Encryption with a Custom Nonce

```ts
import { encrypt } from "@trustvc/trustvc";

const message = "Secure this message.";
const key = "another-secret-key";
const nonce = "123456789012"; // Custom 12-byte nonce

const encryptedMessage = encrypt(message, key, nonce);
console.log(`Encrypted Message with Nonce: ${encryptedMessage}`);
```

#### Internal Dependencies

The function uses the following utilities:

1. `stringToUint8Array`: Converts strings to `Uint8Array`.
2. `generate32ByteKey`: Ensures the key is exactly 32 bytes.
3. `generate12ByteNonce`: Produces a valid 12-byte nonce if none is provided.

It also relies on the `ts-chacha20` library for encryption operations.

#### Output Format

- The encrypted message is returned as a **hexadecimal string**.

#### Notes

1. Always ensure the key and nonce are securely stored and not reused.
2. ChaCha20 requires a unique nonce for each encryption to maintain security.
3. Hexadecimal encoding is used by default for simplicity and readability.

---

### **Decryption**

> The `decrypt` function decrypts messages encrypted with the **ChaCha20** algorithm. It converts the input from a hexadecimal format back into plaintext using the provided key and nonce.

#### Function Signature

```ts
function decrypt(encryptedMessage: string, key: string, nonce?: string): string;
```

#### Description

The `decrypt` function is a utility for decrypting hexadecimal-encoded messages that were encrypted using the **ChaCha20** stream cipher. It ensures the key meets the 32-byte requirement and validates or generates a 12-byte nonce if not supplied.

The function returns the original plaintext message in UTF-8 format.

#### Parameters

- `encryptedMessage` (string): The encrypted message, in hexadecimal format.
- `key` (string): The decryption key, which will be transformed into a 32-byte key. Defaults to `DEFAULT_KEY` if an empty key is provided.
- `nonce` (string, optional): A 12-byte nonce used during encryption. If omitted, one will be generated.

#### Returns

- `string`: The decrypted plaintext message in UTF-8 format.

#### Errors

The function throws an error if:

- The key is invalid or transformation fails.
- The decryption process encounters unexpected issues.

#### Usage

#### Example 1: Basic Decryption

```ts
import { decrypt } from "@trustvc/trustvc";

const encryptedMessage = "e8b7c7e9...";
const key = "my-secret-key";
const decryptedMessage = decrypt(encryptedMessage, key);

console.log(`Decrypted Message: ${decryptedMessage}`);
```

#### Example 2: Decryption with a Custom Nonce

```ts
import { decrypt } from "@trustvc/trustvc";

const encryptedMessage = "f3a7e9b2...";
const key = "another-secret-key";
const nonce = "123456789012"; // Custom 12-byte nonce

const decryptedMessage = decrypt(encryptedMessage, key, nonce);
console.log(`Decrypted Message with Nonce: ${decryptedMessage}`);
```

#### Internal Dependencies

The function uses the following utilities:

1. `stringToUint8Array`: Converts strings to `Uint8Array`.
2. `generate32ByteKey`: Ensures the key is exactly 32 bytes.
3. `generate12ByteNonce`: Produces a valid 12-byte nonce if none is provided.

It also relies on the `ts-chacha20` library for decryption operations.

#### Output Format

- The function accepts the encrypted message in **hexadecimal format** and returns the decrypted message in **UTF-8 format**.

#### Notes

1. Always use the same key and nonce pair that were used during encryption for successful decryption.
2. If a custom nonce is not provided, the function will generate a new one, which may not match the original encryption nonce and will result in decryption failure.
3. The default key, `DEFAULT_KEY`, should only be used for fallback scenarios and not in production environments.
4. Suggestion: If available, consider using the value of the key Id inside the document as the encryption key. This can simplify key management and enhance the security of your encryption process.

---
