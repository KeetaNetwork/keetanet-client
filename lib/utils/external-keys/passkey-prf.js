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
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KeetaPasskeyPRFKeyPairFactory: () => (/* binding */ KeetaPasskeyPRFKeyPairFactory)
/* harmony export */ });
function _classPrivateMethodInitSpec(e, a) { _checkPrivateRedeclaration(e, a), a.add(e); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classPrivateFieldInitSpec(e, t, a) { _checkPrivateRedeclaration(e, t), t.set(e, a); }
function _checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function _classPrivateFieldGet(s, a) { return s.get(_assertClassBrand(s, a)); }
function _classPrivateFieldSet(s, a, r) { return s.set(_assertClassBrand(s, a), r), r; }
function _assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }
/**
 * ExternalKeyPair for the Keeta Network which uses the PRF (Pseudo-Random
 * Function) extension of the WebAuthn API to generate a key pair that can be
 * used for signing and verifying messages. The PRF extension allows for the
 * generation of a key pair that is derived from a secret value, which can be
 * used for authentication and encryption purposes. This implementation uses
 * the WebAuthn API to create a new credential with the PRF extension and then
 * extracts the public key from the generated credential.
 */

/**
 * Options for looking up an existing Passkey PRF key pair.  You can look up
 * a key pair by its key ID, or by its public key string (not supported yet),
 * or you can just look up any key pair (the user will be prompted to select a
 * credential.
 */

/** @internal */

/** @internal */

/** @internal */

function KeetaPasskeyPRFKeyPairFactory(packages) {
  var _KeetaPasskeyPRFKeyPair;
  let includeTesting = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  if (!packages.KeetaNet || !packages.navigator || !packages.bip39) {
    throw new Error('Missing required packages for KeetaPasskeyPRFKeyPairFactory');
  }
  const KeetaNet = Object.freeze({
    lib: Object.freeze({
      Account: packages.KeetaNet.lib.Account,
      Utils: Object.freeze({
        Helper: Object.freeze({
          bufferToArrayBuffer: packages.KeetaNet.lib.Utils.Helper.bufferToArrayBuffer,
          crypto: Object.freeze({
            randomBytes: packages.KeetaNet.lib.Utils.Helper.crypto.randomBytes
          })
        }),
        Buffer: packages.KeetaNet.lib.Utils.Buffer
      })
    })
  });
  const navigator = Object.freeze({
    credentials: Object.freeze({
      create: packages.navigator.credentials.create.bind(packages.navigator.credentials),
      get: packages.navigator.credentials.get.bind(packages.navigator.credentials)
    })
  });
  const bip39 = Object.freeze({
    entropyToMnemonic: packages.bip39.entropyToMnemonic.bind(packages.bip39)
  });
  const bufferToArrayBuffer = KeetaNet.lib.Utils.Helper.bufferToArrayBuffer;
  const crypto = KeetaNet.lib.Utils.Helper.crypto;
  const Buffer = KeetaNet.lib.Utils.Buffer.Buffer;

  /**
   * Default salt: SHA2-256('keeta.com/wallet/seed/v1' as UTF-8 bytes)
   */
  const defaultSalt = new Uint8Array([0x25, 0x6D, 0x61, 0xF0, 0x1F, 0x6F, 0xBF, 0x96, 0x44, 0x49, 0x3B, 0xE0, 0x34, 0x1B, 0x4F, 0x0E, 0xBD, 0x8F, 0xD1, 0x4B, 0x1C, 0xFC, 0x6C, 0x1A, 0x10, 0xAE, 0x42, 0x63, 0x06, 0x69, 0x29, 0x0C]);
  function isArrayBufferLike(value) {
    if (typeof value !== 'object' || value === null) {
      return false;
    }
    if (!('byteLength' in value) || !('slice' in value)) {
      return false;
    }
    if (typeof value.byteLength !== 'number' || typeof value.slice !== 'function') {
      return false;
    }
    return true;
  }
  function credentialHasRawId(credential) {
    if (typeof credential !== 'object' || credential === null) {
      return false;
    }
    if (!('rawId' in credential)) {
      return false;
    }
    if (typeof credential.rawId !== 'object' || credential.rawId === null) {
      return false;
    }
    if (!isArrayBufferLike(credential.rawId)) {
      return false;
    }
    return true;
  }
  function credentialToEntropy(credential) {
    if (typeof credential !== 'object' || credential === null) {
      throw new Error('Credential is not an object');
    }
    if (!('getClientExtensionResults' in credential) || typeof credential.getClientExtensionResults !== 'function') {
      throw new Error('Credential does not support getClientExtensionResults');
    }
    const extensions = credential.getClientExtensionResults();
    if (typeof extensions !== 'object' || extensions === null) {
      throw new Error('Credential extensions are not an object');
    }
    if (!('prf' in extensions) || typeof extensions.prf !== 'object' || extensions.prf === null) {
      throw new Error('Credential does not have PRF extension results');
    }
    const prfExtension = extensions.prf;
    if ('enabled' in prfExtension && prfExtension.enabled !== true) {
      throw new Error('PRF extension does not indicate PRF is enabled');
    }
    if (!('results' in prfExtension) || typeof prfExtension.results !== 'object' || prfExtension.results === null) {
      throw new Error('PRF extension results do not contain a valid result');
    }
    const prfResults = prfExtension.results;
    if (!('first' in prfResults) || typeof prfResults.first !== 'object' || prfResults.first === null) {
      throw new Error('PRF extension results do not contain a "first" value');
    }
    if (!isArrayBufferLike(prfResults.first)) {
      throw new Error('PRF extension "first" value is not an ArrayBuffer');
    }
    return Buffer.from(prfResults.first);
  }
  async function entropyToAccount(entropy, index, keyType) {
    const passphrase = bip39.entropyToMnemonic(new Uint8Array(entropy));
    const seed = await KeetaNet.lib.Account.seedFromPassphrase(passphrase);
    const account = KeetaNet.lib.Account.fromSeed(seed, index, keyType);
    return {
      passphrase: passphrase,
      account: account,
      rawPublicKey: account.publicKey.get()
    };
  }

  /**
   * A KeetaNet ExternalKeyPair implementation backed by the WebAuthn API with the PRF extension.
   */
  var _salt = /*#__PURE__*/new WeakMap();
  var _keyID = /*#__PURE__*/new WeakMap();
  var _index = /*#__PURE__*/new WeakMap();
  var _KeetaPasskeyPRFKeyPair_brand = /*#__PURE__*/new WeakSet();
  class KeetaPasskeyPRFKeyPair extends KeetaNet.lib.Account.ExternalKeyPair {
    /**
     * Creates a new KeetaPasskeyPRFKeyPair instance with the
     * given public key, key ID, and key type.  Generally this
     * constructor should not be called directly, as the preferred
     * way to access an existing key pair is through the static
     * @see KeetaPasskeyPRFKeyPair.lookup, or to create a
     * new key pair through the static @see KeetaPasskeyPRFKeyPair.generate method.
     */
    constructor(rawPublicKey, keyID, salt, index, keyType) {
      super({
        sign: async (data, options) => {
          const account = await _assertClassBrand(_KeetaPasskeyPRFKeyPair_brand, this, _lookupBackingAccount).call(this);
          return await account.sign(data, {
            ...options,
            raw: true
          });
        },
        decrypt: async data => {
          const account = await _assertClassBrand(_KeetaPasskeyPRFKeyPair_brand, this, _lookupBackingAccount).call(this);
          return await account.decrypt(data);
        },
        supportsEncryption: true
      }, rawPublicKey, keyType, false);
      _classPrivateMethodInitSpec(this, _KeetaPasskeyPRFKeyPair_brand);
      _classPrivateFieldInitSpec(this, _salt, void 0);
      _classPrivateFieldInitSpec(this, _keyID, void 0);
      _classPrivateFieldInitSpec(this, _index, void 0);
      _classPrivateFieldSet(_keyID, this, keyID);
      _classPrivateFieldSet(_index, this, index);
      _classPrivateFieldSet(_salt, this, new Uint8Array(salt !== null && salt !== void 0 ? salt : defaultSalt));
      this.keyID = keyID;
      Object.freeze(this);
    }

    /**
     * Lookup an existing credential
     *
     * @param keyID The key ID of the credential to lookup.  If null, any credential will be accepted.
     * @param salt The salt to use for the PRF extension.
     * @param keyType The key type to generate from the PRF output.
     * @returns An object containing the key ID, key type, and public key string of the retrieved credential.
     */

    /**
     * Lookup an existing public key by prompting the user to
     * select a credential from their authenticator.
     */
    static async lookup(options) {
      var _options$salt, _options, _options$keyType, _options2, _options$index, _options3;
      options = {
        ...options
      };
      let keyID = null;
      if ('publicKeyString' in options) {
        throw new Error('Lookup by public key string is not supported yet');
      } else if ('keyID' in options) {
        keyID = options.keyID;
      } else {
        keyID = null;
      }
      const salt = (_options$salt = (_options = options) === null || _options === void 0 ? void 0 : _options.salt) !== null && _options$salt !== void 0 ? _options$salt : defaultSalt;
      const keyType = (_options$keyType = (_options2 = options) === null || _options2 === void 0 ? void 0 : _options2.keyType) !== null && _options$keyType !== void 0 ? _options$keyType : KeetaNet.lib.Account.AccountKeyAlgorithm.ECDSA_SECP256K1;
      const index = (_options$index = (_options3 = options) === null || _options3 === void 0 ? void 0 : _options3.index) !== null && _options$index !== void 0 ? _options$index : 0;
      const key = await _lookupByKeyIDWithSalt.call(KeetaPasskeyPRFKeyPair, keyID, salt, index, keyType);
      const keyPair = new KeetaPasskeyPRFKeyPair(key.rawPublicKey, key.keyID, key.salt, key.index, key.keyType);
      return keyPair;
    }

    /**
     * Generate a new key pair by prompting the user to create a
     * new Passkey credential with the PRF extension, and then
     * extracting
     */
    static async generate(options) {
      var _options$salt2, _options$keyType2, _options$index2, _options$rp$name, _options$user$id;
      const salt = new Uint8Array(bufferToArrayBuffer(Buffer.from((_options$salt2 = options === null || options === void 0 ? void 0 : options.salt) !== null && _options$salt2 !== void 0 ? _options$salt2 : defaultSalt)));
      const keyType = (_options$keyType2 = options === null || options === void 0 ? void 0 : options.keyType) !== null && _options$keyType2 !== void 0 ? _options$keyType2 : KeetaNet.lib.Account.AccountKeyAlgorithm.ECDSA_SECP256K1;
      const index = (_options$index2 = options === null || options === void 0 ? void 0 : options.index) !== null && _options$index2 !== void 0 ? _options$index2 : 0;
      const challenge = bufferToArrayBuffer(crypto.randomBytes(32));
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: challenge,
          pubKeyCredParams: [{
            type: 'public-key',
            alg: -7 /* ES256 */
          }, {
            type: 'public-key',
            alg: -257 /* RS256 */
          }],
          rp: {
            name: (_options$rp$name = options.rp.name) !== null && _options$rp$name !== void 0 ? _options$rp$name : 'Keeta Network',
            id: options.rp.id
          },
          user: {
            displayName: options.user.displayName,
            name: options.user.name,
            id: (_options$user$id = options.user.id) !== null && _options$user$id !== void 0 ? _options$user$id : bufferToArrayBuffer(crypto.randomBytes(16))
          },
          extensions: {
            // @ts-ignore
            prf: {
              eval: {
                first: salt
              }
            }
          }
        }
      });
      if (credential === null) {
        throw new Error('Failed to create credential');
      }
      if (!credentialHasRawId(credential)) {
        throw new Error('Created credential does not have a raw ID');
      }
      const entropy = credentialToEntropy(credential);
      const {
        rawPublicKey
      } = await entropyToAccount(entropy, index, keyType);
      const keyID = Buffer.from(credential.rawId).toString('base64');
      return new KeetaPasskeyPRFKeyPair(rawPublicKey, keyID, salt, index, keyType);
    }
    async exportPassphrase() {
      const keyInfo = await _assertClassBrand(_KeetaPasskeyPRFKeyPair_brand, this, _lookupKeyInfo).call(this);
      return keyInfo.passphrase;
    }
  }
  _KeetaPasskeyPRFKeyPair = KeetaPasskeyPRFKeyPair;
  async function _lookupByKeyIDWithSalt(keyID, salt, index, keyType) {
    const challenge = bufferToArrayBuffer(crypto.randomBytes(32));
    let allowCredentials = undefined;
    if (keyID !== null) {
      allowCredentials = [{
        type: 'public-key',
        id: bufferToArrayBuffer(Buffer.from(keyID, 'base64'))
      }];
    }
    const credential = await navigator.credentials.get({
      publicKey: {
        challenge: challenge,
        allowCredentials: allowCredentials,
        extensions: {
          /*
           * This extension is standardized
           * by the NodeJS DOM library
           */
          // @ts-ignore
          prf: {
            eval: {
              first: bufferToArrayBuffer(Buffer.from(salt))
            }
          }
        },
        userVerification: 'required'
      }
    });
    if (credential === null) {
      throw new Error('Failed to retrieve credential with assertion');
    }
    if (!credentialHasRawId(credential)) {
      throw new Error('Retrieved credential does not have a raw ID');
    }
    const checkKeyID = Buffer.from(credential.rawId);
    if (keyID !== null) {
      if (checkKeyID.toString('base64') !== keyID) {
        throw new Error('Retrieved credential does not match the expected key ID');
      }
    } else {
      keyID = checkKeyID.toString('base64');
    }
    const entropy = credentialToEntropy(credential);
    const convertedData = await entropyToAccount(entropy, index, keyType);

    /* Should we check the challenge is correctly signed ? */

    return {
      keyID: keyID,
      keyType: keyType,
      index: index,
      salt: salt,
      ...convertedData
    };
  }
  async function _lookupKeyInfo() {
    const keyInfo = await _lookupByKeyIDWithSalt.call(_KeetaPasskeyPRFKeyPair, _classPrivateFieldGet(_keyID, this), _classPrivateFieldGet(_salt, this), _classPrivateFieldGet(_index, this), this.keyType);
    return keyInfo;
  }
  async function _lookupBackingAccount() {
    const keyInfo = await _assertClassBrand(_KeetaPasskeyPRFKeyPair_brand, this, _lookupKeyInfo).call(this);
    return keyInfo.account;
  }
  /** @internal */
  _defineProperty(KeetaPasskeyPRFKeyPair, "_Testing", {
    entropyToAccount: entropyToAccount
  });
  if (!includeTesting) {
    /**
     * The _Testing property is only included for testing
     * so remove it if we're not including testing.
     */
    // @ts-ignore
    delete KeetaPasskeyPRFKeyPair._Testing;
  }
  Object.freeze(KeetaPasskeyPRFKeyPair);
  Object.freeze(KeetaPasskeyPRFKeyPair.prototype);
  return KeetaPasskeyPRFKeyPair;
}
Object.freeze(KeetaPasskeyPRFKeyPairFactory);
var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;