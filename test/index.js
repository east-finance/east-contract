"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var js_sdk_1 = require("@wavesenterprise/js-sdk");
var node_fetch_1 = __importDefault(require("node-fetch"));
var nodeAddress = 'http://localhost/node-0';
var seedPhrase = 'examples seed phrase';
var fetch = function (url, options) {
    var headers = {};
    return node_fetch_1.default(url, __assign(__assign({}, options), { headers: __assign(__assign({}, headers), { 'x-api-key': 'we' }) }));
};
Promise.resolve().then(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, chainId, minimumFee, wavesApiConfig, Waves, seed, txBody, tx, signed, signedJSON, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, fetch(nodeAddress + "/node/config")];
            case 1: return [4 /*yield*/, (_b.sent()).json()];
            case 2:
                _a = _b.sent(), chainId = _a.chainId, minimumFee = _a.minimumFee;
                wavesApiConfig = __assign(__assign({}, js_sdk_1.MAINNET_CONFIG), { nodeAddress: nodeAddress, crypto: 'waves', networkByte: chainId.charCodeAt(0), minimumFee: minimumFee });
                Waves = js_sdk_1.create({
                    initialConfiguration: wavesApiConfig,
                    fetchInstance: fetch
                });
                seed = Waves.Seed.fromExistingPhrase(seedPhrase);
                txBody = {
                    image: 'east-contract',
                    imageHash: 'a01af68c2598fa46bc20dadc41125e5efc9ecbf6398efdbd0f7ad155c7c2dd2d',
                    contractName: 'Sample GRPC contract',
                    timestamp: Date.now(),
                    params: [],
                };
                tx = Waves.API.Transactions.CreateContract.V2(txBody);
                _b.label = 3;
            case 3:
                _b.trys.push([3, 5, , 6]);
                return [4 /*yield*/, tx.getSignedTx(seed.keyPair)];
            case 4:
                signed = _b.sent();
                signedJSON = JSON.stringify(signed);
                console.log('signed: ', signedJSON);
                return [3 /*break*/, 6];
            case 5:
                err_1 = _b.sent();
                console.log('Broadcast error:', err_1);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
