/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 364:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.canLogForLevel = canLogForLevel;
exports.canLogForTargetLevel = canLogForTargetLevel;
exports.filterLog = filterLog;
const numericLogLevels = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3
};
function canLogForLevel(level, currentLevel) {
    return (numericLogLevels[level] >= numericLogLevels[currentLevel]);
}
function canLogForTargetLevel(level, targetLevel) {
    if (targetLevel === 'ALL') {
        return (true);
    }
    if (targetLevel === 'NONE') {
        return (false);
    }
    return (canLogForLevel(level, targetLevel));
}
function filterLog(target, message) {
    if (!canLogForTargetLevel(message.level, target.logLevel)) {
        return (null);
    }
    if (target.filter && !target.filter.test(message.from)) {
        return (null);
    }
    return ({
        ...message,
        options: {
            userVisible: message.options.userVisible ?? true,
            currentRequestInfo: {
                id: message.options.currentRequestInfo?.id ?? '<NO_REQUEST_ID>',
                ...message.options.currentRequestInfo
            },
            ...message.options
        }
    });
}


/***/ }),

/***/ 22:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _LogTargetConsole_console;
Object.defineProperty(exports, "__esModule", ({ value: true }));
const common_1 = __webpack_require__(364);
const never_1 = __webpack_require__(692);
class LogTargetConsole {
    constructor(config) {
        _LogTargetConsole_console.set(this, void 0);
        this.logLevel = config?.logLevel ?? 'ALL';
        __classPrivateFieldSet(this, _LogTargetConsole_console, config?.console ?? console, "f");
        this.filter = config?.filter ?? null;
    }
    async emitLogs(logs) {
        for (const rawLog of logs) {
            const log = (0, common_1.filterLog)(this, rawLog);
            if (log === null) {
                continue;
            }
            let method;
            switch (log.level) {
                case 'ERROR':
                    method = 'error';
                    break;
                case 'WARN':
                    method = 'warn';
                    break;
                case 'INFO':
                    method = 'info';
                    break;
                case 'DEBUG':
                    method = 'debug';
                    break;
                default:
                    (0, never_1.assertNever)(log.level);
            }
            const requestID = log.options.currentRequestInfo.id;
            __classPrivateFieldGet(this, _LogTargetConsole_console, "f")[method](`[${requestID}] ${log.level} ${log.from}:`, ...log.args);
            if (log.trace !== undefined) {
                __classPrivateFieldGet(this, _LogTargetConsole_console, "f")[method](`[${requestID}] ${log.level} ${log.from} TRACE:`, log.trace);
            }
        }
    }
}
_LogTargetConsole_console = new WeakMap();
exports["default"] = LogTargetConsole;


/***/ }),

/***/ 601:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _LogTargetGCP_instances, _LogTargetGCP_googleCloudLoggingOptions, _LogTargetGCP_googleCloudLogging, _LogTargetGCP_consoleLoggingTarget, _LogTargetGCP_console, _LogTargetGCP_gcpLoggingTarget_get;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Testing = void 0;
const common_1 = __webpack_require__(364);
const logging_1 = __webpack_require__(377);
const target_console_1 = __importDefault(__webpack_require__(22));
const util = __importStar(__webpack_require__(23));
/**
 * Convert a JSONSerializable value to a Google Cloud Platform Logging value
 */
function convertJSONToGCPLoggingValue(value, depthLimit) {
    /**
     * Ensure we do not recurse too deeply
     */
    if (depthLimit <= 0) {
        return ({
            stringValue: '[depth limit reached]'
        });
    }
    depthLimit--;
    switch (typeof value) {
        case 'undefined':
            return ({
                stringValue: String(value)
            });
        case 'bigint':
            return ({
                stringValue: '0x' + value.toString(16).toUpperCase()
            });
        case 'string':
            return ({
                stringValue: value
            });
        case 'number':
            return ({
                numberValue: value
            });
        case 'boolean':
            return ({
                boolValue: value
            });
        case 'object': {
            if (value === null) {
                return ({
                    nullValue: 'NULL_VALUE'
                });
            }
            if (Array.isArray(value)) {
                return ({
                    listValue: {
                        values: value.map(function (itemValue) {
                            return (convertJSONToGCPLoggingValue(itemValue, depthLimit));
                        })
                    }
                });
            }
            let properties = Object.getOwnPropertyNames(value);
            if (properties.length === 0) {
                if ('toJSON' in value && typeof value.toJSON === 'function') {
                    /*
                     * If the object has a toJSON() function, use it to get a JSON
                     * representation of the object -- we don't know what the return
                     * value is so we have to cast it to unknown and let the conversion
                     * function handle it.
                     */
                    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
                    const jsonValue = value.toJSON();
                    return (convertJSONToGCPLoggingValue(jsonValue, depthLimit));
                }
                properties = Object.keys(value);
            }
            if (properties.length === 0) {
                const maybeStringValue = String(value);
                if (maybeStringValue !== '[object Object]') {
                    return ({ stringValue: String(value) });
                }
            }
            return ({
                structValue: {
                    fields: Object.fromEntries(properties.map(function (itemKey) {
                        let itemValue = undefined;
                        if (itemKey in value) {
                            /*
                             * We know this is an object because of the typeof check
                             * above, so we can safely index into it with the key
                             * we just validated is present.
                             */
                            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
                            itemValue = value[itemKey];
                        }
                        return ([itemKey, convertJSONToGCPLoggingValue(itemValue, depthLimit)]);
                    }))
                }
            });
        }
        default:
            return ({ stringValue: String(value) });
    }
}
/**
 *  Convert an arbitrary value to a Google Cloud Platform Logging value
 */
function convertToGCPLoggingValue(value) {
    const retval = convertJSONToGCPLoggingValue(value, 10);
    return (retval);
}
/**
 * Convert an array of arbitrary values to a string suitable for Google Cloud
 * Platform Logging textPayload
 *
 * Truncates the resulting string to 300 characters.
 *
 * Limits the depth of object traversal to 10 levels to avoid
 * overly deep recursion.
 */
function convertToGCPLoggingString(value) {
    const output = value.map(function (item) {
        if (typeof item === 'string') {
            return (item);
        }
        return (util.inspect(item, { depth: 10, maxArrayLength: 20, breakLength: 120, compact: true, maxStringLength: 300 }));
    }).join(' ');
    if (output.length > 300) {
        return (output.slice(0, 297) + '...');
    }
    return (output);
}
class LogTargetGCP {
    constructor(config) {
        _LogTargetGCP_instances.add(this);
        /**
         * The options for this instance of the GCP Logging target.
         */
        _LogTargetGCP_googleCloudLoggingOptions.set(this, void 0);
        /**
         * Google Cloud Platform Logging instance and log writer
         */
        _LogTargetGCP_googleCloudLogging.set(this, void 0);
        /**
         * The fallback console logging target.
         */
        _LogTargetGCP_consoleLoggingTarget.set(this, void 0);
        _LogTargetGCP_console.set(this, void 0);
        this.logLevel = config.logLevel ?? 'DEBUG';
        this.filter = config.filter ?? null;
        __classPrivateFieldSet(this, _LogTargetGCP_console, config.console ?? console, "f");
        __classPrivateFieldSet(this, _LogTargetGCP_consoleLoggingTarget, new target_console_1.default({
            logLevel: config.logLevel,
            console: config.console
        }), "f");
        __classPrivateFieldSet(this, _LogTargetGCP_googleCloudLoggingOptions, {
            environment: config.environment,
            product: config.product,
            vendor: config.vendor
        }, "f");
        const instance = config.destination ?? new logging_1.Logging({});
        __classPrivateFieldSet(this, _LogTargetGCP_googleCloudLogging, {
            instance: instance,
            log: instance.log(__classPrivateFieldGet(this, _LogTargetGCP_instances, "a", _LogTargetGCP_gcpLoggingTarget_get))
        }, "f");
    }
    /**
     * This function tries to log a test message to GCP Logging, and if it fails,
     * it runs the provided `elseRun` function.
     *
     * This is useful for logging initialization, to ensure that GCP Logging
     * is working, and if not, to fall back to another logging method.
     */
    async test(canRun, elseRun) {
        const gcpLogging = __classPrivateFieldGet(this, _LogTargetGCP_googleCloudLogging, "f");
        const [vendor, product] = __classPrivateFieldGet(this, _LogTargetGCP_instances, "a", _LogTargetGCP_gcpLoggingTarget_get).split('/');
        const environment = __classPrivateFieldGet(this, _LogTargetGCP_googleCloudLoggingOptions, "f").environment;
        try {
            await gcpLogging.log.write(gcpLogging.instance.entry({
                jsonPayload: {
                    fields: {
                        message: {
                            stringValue: '[LogTargetGCP] Test log message'
                        }
                    }
                },
                resource: {
                    type: 'global'
                },
                labels: {
                    vendor: vendor,
                    product: product,
                    environment: environment
                },
                severity: 'DEBUG'
            }));
            await canRun();
        }
        catch (tryLogError) {
            await elseRun(tryLogError);
        }
    }
    async emitLogs(input) {
        const gcpLogging = __classPrivateFieldGet(this, _LogTargetGCP_googleCloudLogging, "f");
        const logs = input.map((log) => {
            return ((0, common_1.filterLog)(this, log));
        }).filter(function (log) {
            return (log !== null);
        });
        if (logs.length === 0) {
            return;
        }
        const [vendor, product] = __classPrivateFieldGet(this, _LogTargetGCP_instances, "a", _LogTargetGCP_gcpLoggingTarget_get).split('/');
        const environment = __classPrivateFieldGet(this, _LogTargetGCP_googleCloudLoggingOptions, "f").environment;
        const logEntries = logs.map(function (log) {
            const addLogFields = {};
            if (log.trace !== undefined) {
                addLogFields.trace = {
                    stringValue: log.trace
                };
            }
            return (gcpLogging.instance.entry({
                jsonPayload: {
                    fields: {
                        message: {
                            stringValue: convertToGCPLoggingString([`[${log.from}]`, ...log.args])
                        },
                        currentRequest: convertToGCPLoggingValue(log.options.currentRequestInfo.id),
                        userVisible: {
                            boolValue: log.options.userVisible
                        },
                        from: {
                            stringValue: log.from
                        },
                        args: convertToGCPLoggingValue(log.args),
                        ...addLogFields
                    }
                },
                resource: {
                    type: 'global'
                },
                labels: {
                    vendor: vendor,
                    product: product,
                    environment: environment
                },
                severity: log.level
            }));
        });
        try {
            await gcpLogging.log.write(logEntries);
        }
        catch (logWritingError) {
            __classPrivateFieldGet(this, _LogTargetGCP_console, "f").error('Logs.emitLogs(): Failed to write logs to Google Cloud Logging -- falling back to console logging', logWritingError);
            await __classPrivateFieldGet(this, _LogTargetGCP_consoleLoggingTarget, "f").emitLogs(logs);
        }
    }
}
_LogTargetGCP_googleCloudLoggingOptions = new WeakMap(), _LogTargetGCP_googleCloudLogging = new WeakMap(), _LogTargetGCP_consoleLoggingTarget = new WeakMap(), _LogTargetGCP_console = new WeakMap(), _LogTargetGCP_instances = new WeakSet(), _LogTargetGCP_gcpLoggingTarget_get = function _LogTargetGCP_gcpLoggingTarget_get() {
    return (`${__classPrivateFieldGet(this, _LogTargetGCP_googleCloudLoggingOptions, "f").vendor}/${__classPrivateFieldGet(this, _LogTargetGCP_googleCloudLoggingOptions, "f").product}`);
};
/** @internal */
exports.Testing = {
    convertToGCPLoggingValue,
    convertToGCPLoggingString
};
exports["default"] = LogTargetGCP;


/***/ }),

/***/ 692:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.assertNever = assertNever;
/**
 * Asserts that the provided value is never.
 *
 * This is useful for static type checking to ensure that all possible values
 * are handled.
 */
function assertNever(value) {
    /**
     * If we got to this point, it means that the value is not never and
     * so can be logged
     */
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    throw (new Error(`Unexpected value: ${value}`));
}


/***/ }),

/***/ 377:
/***/ ((module) => {

module.exports = require("@google-cloud/logging");

/***/ }),

/***/ 23:
/***/ ((module) => {

module.exports = require("util");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(601);
/******/ 	var __webpack_export_target__ = exports;
/******/ 	for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
/******/ 	if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ 	
/******/ })()
;