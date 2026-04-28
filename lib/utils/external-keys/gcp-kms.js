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
/* harmony export */   KeetaGCPKMSKeyPairFactory: () => (/* binding */ KeetaGCPKMSKeyPairFactory)
/* harmony export */ });
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * ExternalKeyPair for the Keeta Network which uses Google Cloud KMS
 * for signing operations. This implementation supports ECDSA keys on
 * both SECP256K1 and SECP256R1 curves, with potential for ED25519
 * support in the future.
 */

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

/** @internal */

/** @internal */

/** @internal */

function KeetaGCPKMSKeyPairFactory(packages) {
  let includeTesting = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  if (!packages.KeyManagementServiceClient || !packages.KeetaNet || !packages.crypto) {
    throw new Error('Missing required packages for KeetaGCPKMSKeyPairFactory');
  }
  const KeetaNet = Object.freeze({
    lib: Object.freeze({
      Account: packages.KeetaNet.lib.Account,
      Utils: Object.freeze({
        Helper: Object.freeze({
          bufferToArrayBuffer: packages.KeetaNet.lib.Utils.Helper.bufferToArrayBuffer
        }),
        Buffer: packages.KeetaNet.lib.Utils.Buffer,
        ASN1: packages.KeetaNet.lib.Utils.ASN1
      })
    })
  });
  const crypto = packages.crypto;
  const bufferToArrayBuffer = KeetaNet.lib.Utils.Helper.bufferToArrayBuffer;
  const Buffer = KeetaNet.lib.Utils.Buffer.Buffer;
  const BufferStorage = KeetaNet.lib.Utils.Buffer.BufferStorage;

  /**
   * Build a full KMS key resource name from components.
   */
  async function buildGCPKMSKeyName(config) {
    var _cryptoKey$primary$na, _cryptoKey$primary;
    let lookupVersion = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
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
    const client = new packages.KeyManagementServiceClient({
      projectId: config.projectId
    });
    const [cryptoKey] = await client.getCryptoKey({
      name: base
    });
    const latestVersionNumber = (_cryptoKey$primary$na = (_cryptoKey$primary = cryptoKey.primary) === null || _cryptoKey$primary === void 0 || (_cryptoKey$primary = _cryptoKey$primary.name) === null || _cryptoKey$primary === void 0 ? void 0 : _cryptoKey$primary.split('/').at(-1)) !== null && _cryptoKey$primary$na !== void 0 ? _cryptoKey$primary$na : '1';
    return `${base}/cryptoKeyVersions/${latestVersionNumber}`;
  }

  /**
   * Extract raw EC public key bytes from PEM format.
   */
  function extractPublicKeyFromPem(pem, cryptoPkg) {
    const publicKey = cryptoPkg.createPublicKey(pem);
    const jwk = publicKey.export({
      format: "jwk"
    });
    if (typeof jwk !== 'object' || jwk === null) {
      throw new Error("Invalid JWK format");
    }
    if (!('x' in jwk) || !('y' in jwk) || typeof jwk.x !== 'string' || typeof jwk.y !== 'string') {
      throw new Error("Invalid EC public key in JWK format");
    }
    const xBuf = Buffer.from(jwk.x, "base64url");
    const yBuf = Buffer.from(jwk.y, "base64url");
    const uncompressed = new Uint8Array(65);
    uncompressed[0] = 0x04;
    uncompressed.set(xBuf, 1);
    uncompressed.set(yBuf, 33);
    return uncompressed;
  }

  /**
   * Convert uncompressed public key to compressed format.
   */
  function compressPublicKey(uncompressed) {
    if (uncompressed.length !== 65 || uncompressed[0] !== 0x04) {
      throw new Error("Invalid uncompressed public key format");
    }
    const x = uncompressed.slice(1, 33);
    const y = uncompressed.slice(33, 65);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const prefix = (y[31] & 1) === 0 ? 0x02 : 0x03;
    const compressed = new Uint8Array(33);
    compressed[0] = prefix;
    compressed.set(x, 1);
    return compressed;
  }

  /**
   * Convert DER-encoded ECDSA signature to raw R||S format (64 bytes).
   */
  function derSignatureToRaw(derSig, pkgs) {
    const ValidateASN1 = pkgs.KeetaNet.lib.Utils.ASN1.ValidateASN1;
    const bufferToArrayBufferLocal = pkgs.KeetaNet.lib.Utils.Helper.bufferToArrayBuffer;
    const BufferLocal = pkgs.KeetaNet.lib.Utils.Buffer.Buffer;
    const BufferStorageLocal = pkgs.KeetaNet.lib.Utils.Buffer.BufferStorage;
    const validator = new ValidateASN1({
      type: 'struct',
      fieldNames: ['r', 's'],
      contains: {
        r: ValidateASN1.IsInteger,
        s: ValidateASN1.IsInteger
      }
    });
    const parts = validator.validate(pkgs.KeetaNet.lib.Utils.ASN1.ASN1toJS(bufferToArrayBufferLocal(BufferLocal.from(derSig))));
    const rBuffer = new BufferStorageLocal(parts.contains.r, 32);
    const sBuffer = new BufferStorageLocal(parts.contains.s, 32);
    const r = new Uint8Array(rBuffer.get());
    const s = new Uint8Array(sBuffer.get());
    const rawSig = new Uint8Array(64);
    rawSig.set(r, 0);
    rawSig.set(s, 32);
    return rawSig;
  }

  /**
   * Detect the key algorithm from the algorithm name or curve name.
   */
  function detectKeyAlgorithm(algorithmOrCurve) {
    if (typeof algorithmOrCurve !== 'string' && algorithmOrCurve !== null && algorithmOrCurve !== undefined) {
      algorithmOrCurve = String(algorithmOrCurve);
    }
    const algoStr = algorithmOrCurve;
    switch (algoStr) {
      case 'EC_SIGN_SECP256K1_SHA256':
      case 'secp256k1':
        return KeetaNet.lib.Account.AccountKeyAlgorithm.ECDSA_SECP256K1;
      case 'EC_SIGN_P256_SHA256':
      case 'prime256v1':
      case 'P-256':
        return KeetaNet.lib.Account.AccountKeyAlgorithm.ECDSA_SECP256R1;
      default:
        throw new Error(`Unsupported algorithm or curve: ${String(algoStr)}`);
    }
  }

  /**
   * A KeetaNet ExternalKeyPair implementation backed by Google Cloud KMS.
   */
  class KeetaGCPKMSKeyPair extends KeetaNet.lib.Account.ExternalKeyPair {
    /**
     * Creates a new KeetaGCPKMSKeyPair instance with the given
     * parameters. Generally this constructor should not be called
     * directly, as the preferred way to access a key is through
     * the static @see KeetaGCPKMSKeyPair.lookup method.
     */
    constructor(client, keyVersionName, rawPublicKey, keyType) {
      super({
        sign: async (data, options) => {
          // data is already hashed by the SDK (since rawSignatures = false)
          const digest = {
            sha256: Buffer.from(data)
          };
          const [signResponse] = await client.asymmetricSign({
            name: keyVersionName,
            digest: digest
          });
          if (!signResponse.signature) {
            throw new Error("No signature returned from KMS");
          }
          const derSigBuffer = Buffer.from(signResponse.signature);
          if (options !== null && options !== void 0 && options.forCert) {
            return new BufferStorage(derSigBuffer, derSigBuffer.byteLength);
          }
          const derSig = new Uint8Array(derSigBuffer);
          let signature;
          switch (keyType) {
            case KeetaNet.lib.Account.AccountKeyAlgorithm.ECDSA_SECP256K1:
            case KeetaNet.lib.Account.AccountKeyAlgorithm.ECDSA_SECP256R1:
              signature = KeetaNet.lib.Account.KeyPairs[keyType].signatureFromDER([...derSig]);
              break;
            default:
              throw new Error(`Unsupported key type for signature conversion: ${keyType}`);
          }
          return signature;
        },
        supportsEncryption: false
      }, rawPublicKey, keyType, false);
      this.keyName = keyVersionName;
      Object.freeze(this);
    }

    /**
     * Lookup (or open) an existing GCP KMS key and create a
     * KeetaGCPKMSKeyPair instance for it.
     */
    static async lookup(options) {
      var _options$keyType;
      let keyConfig;
      if (typeof options.key === 'string') {
        keyConfig = parseGCPKMSKeyName(options.key);
      } else {
        keyConfig = options.key;
      }
      const client = new packages.KeyManagementServiceClient({
        projectId: keyConfig.projectId
      });
      const keyVersionName = await buildGCPKMSKeyName(keyConfig);
      const [publicKeyResponse] = await client.getPublicKey({
        name: keyVersionName
      });
      const detectedKeyType = detectKeyAlgorithm(publicKeyResponse.algorithm);
      const keyType = (_options$keyType = options.keyType) !== null && _options$keyType !== void 0 ? _options$keyType : detectedKeyType;
      if (options.keyType !== undefined && options.keyType !== detectedKeyType) {
        throw new Error(`Key type mismatch: expected ${options.keyType}, but KMS key has ${detectedKeyType}`);
      }
      if (!publicKeyResponse.pem) {
        throw new Error("No public key PEM data available from KMS");
      }
      const uncompressedPublicKey = extractPublicKeyFromPem(publicKeyResponse.pem, crypto);
      const compressedPublicKey = compressPublicKey(uncompressedPublicKey);
      return new KeetaGCPKMSKeyPair(client, keyVersionName, bufferToArrayBuffer(Buffer.from(compressedPublicKey)), keyType);
    }
  }
  /** @internal */
  _defineProperty(KeetaGCPKMSKeyPair, "_Testing", {
    parseKeyName: parseGCPKMSKeyName,
    buildKeyName: buildGCPKMSKeyName,
    extractPublicKeyFromPem: extractPublicKeyFromPem,
    derSignatureToRaw: derSignatureToRaw
  });
  if (!includeTesting) {
    /**
     * The _Testing property is only included for testing
     * so remove it if we're not including testing.
     */
    // @ts-ignore
    delete KeetaGCPKMSKeyPair._Testing;
  }
  Object.freeze(KeetaGCPKMSKeyPair);
  Object.freeze(KeetaGCPKMSKeyPair.prototype);
  return KeetaGCPKMSKeyPair;
}
Object.freeze(KeetaGCPKMSKeyPairFactory);
var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;