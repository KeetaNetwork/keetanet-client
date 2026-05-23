/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  KeetaGCPKMSWrappedKeyPairFactory: () => (/* binding */ KeetaGCPKMSWrappedKeyPairFactory)
});

;// ./src/lib/utils/external-keys/gcp-kms.common.ts
/**
 * Parse a full KMS key name into its components.
 * Example: projects/<project_name>/locations/<location>/keyRings/<keyRingName>/cryptoKeys/<keyName>
 */
function parseGCPKMSKeyName(fullName) {
  const pattern = /^projects\/([^/]+)\/locations\/([^/]+)\/keyRings\/([^/]+)\/cryptoKeys\/([^/]+)(?:\/cryptoKeyVersions\/(\d+))?$/;
  const match = fullName.match(pattern);
  if (!match) {
    throw new Error(`Invalid KMS key name format: ${fullName}`);
  }
  const projectId = match[1];
  const locationId = match[2];
  const keyRingId = match[3];
  const keyId = match[4];
  const versionId = match[5];
  if (!projectId || !locationId || !keyRingId || !keyId) {
    throw new Error(`Invalid KMS key name format: ${fullName}`);
  }
  return {
    projectId,
    locationId,
    keyRingId,
    keyId,
    versionId
  };
}

/**
 * Build a full KMS key resource name from components.
 */
async function buildGCPKMSKeyNameBase(gcpKMSClientClass, config) {
  var _cryptoKey$primary$na, _cryptoKey$primary;
  let lookupVersion = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  const base = `projects/${config.projectId}/locations/${config.locationId}/keyRings/${config.keyRingId}/cryptoKeys/${config.keyId}`;
  if (config.versionId) {
    return `${base}/cryptoKeyVersions/${config.versionId}`;
  }

  /*
   * Just omit the version if it's not requested
   */
  if (!lookupVersion) {
    return base;
  }

  /*
   * If the versionID is missing, get the latest
   * version from KMS.
   */
  const client = new gcpKMSClientClass({
    projectId: config.projectId
  });
  const [cryptoKey] = await client.getCryptoKey({
    name: base
  });
  const latestVersionNumber = (_cryptoKey$primary$na = (_cryptoKey$primary = cryptoKey.primary) === null || _cryptoKey$primary === void 0 || (_cryptoKey$primary = _cryptoKey$primary.name) === null || _cryptoKey$primary === void 0 ? void 0 : _cryptoKey$primary.split('/').at(-1)) !== null && _cryptoKey$primary$na !== void 0 ? _cryptoKey$primary$na : '1';
  return `${base}/cryptoKeyVersions/${latestVersionNumber}`;
}
;// ./src/lib/utils/external-keys/gcp-kms-wrapped.ts
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * ExternalKeyPair for the Keeta Network which uses Google Cloud KMS
 * to wrap private key operations. This allows users to leverage GCP KMS for
 * decrypting an encrypted private key and performing signing and encryption
 * operations without exposing the private key material to the application.
 *
 * Internally, it uses RSA keys on GCP KMS to support decrypting the
 * supplied encrypted keying material.
 */



/** @internal */

/** @internal */

/** @internal */

function KeetaGCPKMSWrappedKeyPairFactory(packages) {
  let includeTesting = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  if (!packages.KeyManagementServiceClient || !packages.KeetaNet) {
    throw new Error('Missing required packages for KeetaGCPKMSWrappedKeyPairFactory');
  }
  const KeetaNet = Object.freeze({
    lib: Object.freeze({
      Account: packages.KeetaNet.lib.Account,
      Utils: Object.freeze({
        Helper: Object.freeze({
          bufferToArrayBuffer: packages.KeetaNet.lib.Utils.Helper.bufferToArrayBuffer
        }),
        Buffer: packages.KeetaNet.lib.Utils.Buffer
      })
    })
  });
  const bufferToArrayBuffer = KeetaNet.lib.Utils.Helper.bufferToArrayBuffer;
  const Buffer = KeetaNet.lib.Utils.Buffer.Buffer;
  const crypto = packages.crypto;
  function keyTypeToAccountKeyAlgorithm(keyType) {
    if (typeof keyType === 'number') {
      if (!(keyType in KeetaNet.lib.Account.AccountKeyAlgorithm)) {
        throw new Error(`Invalid keyType value: ${keyType}`);
      }
      return keyType;
    } else if (typeof keyType === 'string') {
      if (Number(keyType).toString() === keyType) {
        throw new Error(`Invalid keyType value: ${keyType}, expected a string key type name, not a number in string form`);
      }
      if (!(keyType in KeetaNet.lib.Account.AccountKeyAlgorithm)) {
        throw new Error(`Invalid keyType value: ${keyType}`);
      }
      const retval = KeetaNet.lib.Account.AccountKeyAlgorithm[keyType];
      if (typeof retval !== 'number') {
        throw new Error(`Invalid keyType value: ${keyType}, expected a string key type name that maps to a number`);
      }
      return retval;
    } else {
      throw new Error(`Invalid keyType value: ${keyType}`);
    }
  }
  function keyTypeToAccountKeyAlgorithmString(keyType) {
    const keyTypeNumber = keyTypeToAccountKeyAlgorithm(keyType);
    const keyTypeString = KeetaNet.lib.Account.AccountKeyAlgorithm[keyTypeNumber];
    return keyTypeString;
  }
  async function buildGCPKMSKeyName(config) {
    let lookupVersion = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    return await buildGCPKMSKeyNameBase(packages.KeyManagementServiceClient, config, lookupVersion);
  }

  /**
   * A KeyPair implementation for the Keeta Network which uses the
   * Google Cloud KMS to decrypt private keying material so that
   * signing and encryption operations can be performed without exposing
   * the private key material to the application.
   */
  class KeetaGCPKMSWrappedKeyPair {
    static createAccountFromSeed(seed, index, keyType) {
      if (KeetaNet.lib.Account.isIdentifierKeyType(keyType)) {
        throw new Error('May only construct accounts from keying material for signing keys, not identifier keys');
      }
      const account = KeetaNet.lib.Account.fromSeed(seed, index !== null && index !== void 0 ? index : 0, keyType);
      return account;
    }
    static async lookupKey(options) {
      let keyConfig;
      if (typeof options.kmsKey === 'string') {
        keyConfig = parseGCPKMSKeyName(options.kmsKey);
      } else {
        keyConfig = options.kmsKey;
      }
      let cleanupClient = true;
      const client = new packages.KeyManagementServiceClient({
        projectId: keyConfig.projectId
      });
      try {
        const keyVersionName = await buildGCPKMSKeyName(keyConfig);
        const [publicKeyResponse] = await client.getPublicKey({
          name: keyVersionName
        });
        const publicKeyPEM = publicKeyResponse.pem;
        if (!publicKeyPEM) {
          throw new Error('No public key PEM returned from KMS');
        }
        let padding;
        if (publicKeyResponse.algorithm === 'RSA_DECRYPT_OAEP_4096_SHA512') {
          padding = {
            type: 'OAEP',
            hash: 'sha512'
          };
        } else if (publicKeyResponse.algorithm === 'RSA_DECRYPT_OAEP_4096_SHA256') {
          padding = {
            type: 'OAEP',
            hash: 'sha256'
          };
        } else {
          throw new Error(`Unsupported KMS key algorithm: ${publicKeyResponse.algorithm}`);
        }
        cleanupClient = false;
        return {
          client,
          keyVersionName,
          publicKeyPEM,
          padding
        };
      } finally {
        if (cleanupClient) {
          await client.close();
        }
      }
    }

    /**
     * Encrypt a private key material with the KMS key and return
     * the encryptedSeed that can be stored and later
     * decrypted with the same KMS key.
     */
    static async encryptSeed(input, options) {
      if (crypto === undefined) {
        throw new Error('Crypto module is required for encrypting seed with KMS public key');
      }
      const keyType = keyTypeToAccountKeyAlgorithm(options.keyType);

      /*
       * Verify we can create an account from this keying material
       *
       * This will throw if the input data is incorrect or invalid
       */
      this.createAccountFromSeed(input, options.index, keyType);

      /*
       * Lookup the KMS key
       */
      const {
        client,
        publicKeyPEM,
        padding
      } = await this.lookupKey(options);
      await client.close();
      const publicKey = crypto.createPublicKey(publicKeyPEM);
      const encryptedSeed = crypto.publicEncrypt({
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: padding.hash
      }, Buffer.from(input));
      return bufferToArrayBuffer(encryptedSeed);
    }

    /**
     * Lookup (or open) an existing GCP KMS key and create a
     * Account instance for it.
     */
    static async lookup(options) {
      const keyType = keyTypeToAccountKeyAlgorithm(options.keyType);
      const {
        client,
        keyVersionName
      } = await this.lookupKey(options);
      let decryptResponse;
      try {
        /* Decrypt the encrypted keying material using the KMS key */
        const decryptResponseWrapper = await client.asymmetricDecrypt({
          name: keyVersionName,
          ciphertext: Buffer.from(options.encryptedSeed)
        });
        decryptResponse = decryptResponseWrapper[0];
      } finally {
        await client.close();
      }
      const seed = decryptResponse.plaintext;
      let seedBuffer;
      if (Buffer.isBuffer(seed)) {
        seedBuffer = seed;
      } else if (seed instanceof Uint8Array) {
        seedBuffer = Buffer.from(seed);
      } else if (typeof seed === 'string') {
        seedBuffer = Buffer.from(seed, 'base64');
      } else {
        throw new Error('Decryption failed, no plaintext returned from KMS');
      }
      const account = this.createAccountFromSeed(bufferToArrayBuffer(seedBuffer), options.index, keyType);
      return account;
    }

    /**
     * Allow looking up an existing KMS key and creating a
     * Account instance from it using a JSON representation
     * of the options.
     *
     * Base64 encoding is used for the encryptedSeed in the
     * JSON representation since ArrayBuffers cannot be directly
     * represented in JSON.
     */

    static async lookupFromJSON(input) {
      if (typeof input !== 'object' || input === null) {
        throw new Error('Invalid input, expected an object');
      }
      if (!('kmsKey' in input)) {
        throw new Error('Missing kmsKey in input');
      }
      const kmsKeyInput = input.kmsKey;
      let kmsKey;
      if (typeof kmsKeyInput !== 'string' && (typeof kmsKeyInput !== 'object' || kmsKeyInput === null)) {
        throw new Error('Invalid kmsKey in input, expected a string or object');
      }
      if (typeof kmsKeyInput === 'object') {
        if (!('projectId' in kmsKeyInput) || typeof kmsKeyInput.projectId !== 'string') {
          throw new Error('Invalid or missing projectId in kmsKey');
        }
        if (!('locationId' in kmsKeyInput) || typeof kmsKeyInput.locationId !== 'string') {
          throw new Error('Invalid or missing locationId in kmsKey');
        }
        if (!('keyRingId' in kmsKeyInput) || typeof kmsKeyInput.keyRingId !== 'string') {
          throw new Error('Invalid or missing keyRingId in kmsKey');
        }
        if (!('keyId' in kmsKeyInput) || typeof kmsKeyInput.keyId !== 'string') {
          throw new Error('Invalid or missing keyId in kmsKey');
        }
        let kmsKeyInputVersionIdObject;
        if ('versionId' in kmsKeyInput) {
          if (typeof kmsKeyInput.versionId !== 'string') {
            throw new Error('Invalid versionId in kmsKey, expected a string');
          }
          if (kmsKeyInput.versionId === '') {
            throw new Error('Invalid versionId in kmsKey, cannot be an empty string');
          }
          kmsKeyInputVersionIdObject = {
            versionId: kmsKeyInput.versionId
          };
        } else {
          kmsKeyInputVersionIdObject = {};
        }
        kmsKey = {
          projectId: kmsKeyInput.projectId,
          locationId: kmsKeyInput.locationId,
          keyRingId: kmsKeyInput.keyRingId,
          keyId: kmsKeyInput.keyId,
          ...kmsKeyInputVersionIdObject
        };
      } else {
        kmsKey = kmsKeyInput;
      }
      if (!('keyType' in input) || typeof input.keyType !== 'string' && typeof input.keyType !== 'number') {
        throw new Error('Invalid or missing keyType in input');
      }
      if (!('encryptedSeed' in input) || typeof input.encryptedSeed !== 'string') {
        throw new Error('Invalid or missing encryptedSeed in input');
      }
      if (!('type' in input) || input.type !== 'gcpkmswrapped') {
        throw new Error('Invalid or missing type in input, expected "gcpkmswrapped"');
      }
      let index = 0;
      if ('index' in input) {
        if (typeof input.index !== 'number' || !Number.isInteger(input.index) || input.index < 0) {
          throw new Error('Invalid index in input, must be a non-negative integer');
        }
        index = input.index;
      }
      const encryptedSeed = input.encryptedSeed;
      const keyTypeString = input.keyType;
      if (!(keyTypeString in KeetaNet.lib.Account.AccountKeyAlgorithm)) {
        throw new Error(`Invalid keyType value: ${keyTypeString}`);
      }
      let keyType;
      if (Number.isNaN(Number(keyTypeString))) {
        // @ts-ignore
        keyType = KeetaNet.lib.Account.AccountKeyAlgorithm[keyTypeString];
      } else {
        keyType = Number(keyTypeString);
      }
      if (typeof keyType !== 'number') {
        throw new Error(`Invalid keyType value: ${keyTypeString}`);
      }
      const options = {
        kmsKey: kmsKey,
        keyType: keyType,
        encryptedSeed: bufferToArrayBuffer(Buffer.from(encryptedSeed, 'base64')),
        index: index
      };
      return await this.lookup(options);
    }
    static async lookupFromString(input) {
      const parsed = JSON.parse(input);
      return await this.lookupFromJSON(parsed);
    }
    static async getJSONFromOptions(options) {
      var _options$index;
      let kmsKey = options.kmsKey;
      if (typeof kmsKey !== 'string') {
        kmsKey = await buildGCPKMSKeyName(kmsKey);
      }
      const keyTypeString = keyTypeToAccountKeyAlgorithmString(options.keyType);
      const json = {
        type: 'gcpkmswrapped',
        kmsKey: kmsKey,
        keyType: keyTypeString,
        encryptedSeed: Buffer.from(options.encryptedSeed).toString('base64'),
        index: (_options$index = options.index) !== null && _options$index !== void 0 ? _options$index : 0
      };
      return json;
    }
    static async getStringFromOptions(options) {
      const json = await this.getJSONFromOptions(options);
      return JSON.stringify(json);
    }
  }
  /** @internal */
  _defineProperty(KeetaGCPKMSWrappedKeyPair, "_Testing", {});
  if (!includeTesting) {
    /**
     * The _Testing property is only included for testing
     * so remove it if we're not including testing.
     */
    // @ts-ignore
    delete KeetaGCPKMSWrappedKeyPair._Testing;
  }
  Object.freeze(KeetaGCPKMSWrappedKeyPair);
  Object.freeze(KeetaGCPKMSWrappedKeyPair.prototype);
  return KeetaGCPKMSWrappedKeyPair;
}
Object.freeze(KeetaGCPKMSWrappedKeyPairFactory);
var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;