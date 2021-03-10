/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.wavesenterprise = (function() {

    /**
     * Namespace wavesenterprise.
     * @exports wavesenterprise
     * @namespace
     */
    var wavesenterprise = {};

    wavesenterprise.ContractService = (function() {

        /**
         * Constructs a new ContractService service.
         * @memberof wavesenterprise
         * @classdesc Represents a ContractService
         * @extends $protobuf.rpc.Service
         * @constructor
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         */
        function ContractService(rpcImpl, requestDelimited, responseDelimited) {
            $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
        }

        (ContractService.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = ContractService;

        /**
         * Creates new ContractService service using the specified rpc implementation.
         * @function create
         * @memberof wavesenterprise.ContractService
         * @static
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         * @returns {ContractService} RPC service. Useful where requests and/or responses are streamed.
         */
        ContractService.create = function create(rpcImpl, requestDelimited, responseDelimited) {
            return new this(rpcImpl, requestDelimited, responseDelimited);
        };

        /**
         * Callback as used by {@link wavesenterprise.ContractService#connect}.
         * @memberof wavesenterprise.ContractService
         * @typedef ConnectCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {wavesenterprise.ContractTransactionResponse} [response] ContractTransactionResponse
         */

        /**
         * Calls Connect.
         * @function connect
         * @memberof wavesenterprise.ContractService
         * @instance
         * @param {wavesenterprise.IConnectionRequest} request ConnectionRequest message or plain object
         * @param {wavesenterprise.ContractService.ConnectCallback} callback Node-style callback called with the error, if any, and ContractTransactionResponse
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(ContractService.prototype.connect = function connect(request, callback) {
            return this.rpcCall(connect, $root.wavesenterprise.ConnectionRequest, $root.wavesenterprise.ContractTransactionResponse, request, callback);
        }, "name", { value: "Connect" });

        /**
         * Calls Connect.
         * @function connect
         * @memberof wavesenterprise.ContractService
         * @instance
         * @param {wavesenterprise.IConnectionRequest} request ConnectionRequest message or plain object
         * @returns {Promise<wavesenterprise.ContractTransactionResponse>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link wavesenterprise.ContractService#commitExecutionSuccess}.
         * @memberof wavesenterprise.ContractService
         * @typedef CommitExecutionSuccessCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {wavesenterprise.CommitExecutionResponse} [response] CommitExecutionResponse
         */

        /**
         * Calls CommitExecutionSuccess.
         * @function commitExecutionSuccess
         * @memberof wavesenterprise.ContractService
         * @instance
         * @param {wavesenterprise.IExecutionSuccessRequest} request ExecutionSuccessRequest message or plain object
         * @param {wavesenterprise.ContractService.CommitExecutionSuccessCallback} callback Node-style callback called with the error, if any, and CommitExecutionResponse
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(ContractService.prototype.commitExecutionSuccess = function commitExecutionSuccess(request, callback) {
            return this.rpcCall(commitExecutionSuccess, $root.wavesenterprise.ExecutionSuccessRequest, $root.wavesenterprise.CommitExecutionResponse, request, callback);
        }, "name", { value: "CommitExecutionSuccess" });

        /**
         * Calls CommitExecutionSuccess.
         * @function commitExecutionSuccess
         * @memberof wavesenterprise.ContractService
         * @instance
         * @param {wavesenterprise.IExecutionSuccessRequest} request ExecutionSuccessRequest message or plain object
         * @returns {Promise<wavesenterprise.CommitExecutionResponse>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link wavesenterprise.ContractService#commitExecutionError}.
         * @memberof wavesenterprise.ContractService
         * @typedef CommitExecutionErrorCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {wavesenterprise.CommitExecutionResponse} [response] CommitExecutionResponse
         */

        /**
         * Calls CommitExecutionError.
         * @function commitExecutionError
         * @memberof wavesenterprise.ContractService
         * @instance
         * @param {wavesenterprise.IExecutionErrorRequest} request ExecutionErrorRequest message or plain object
         * @param {wavesenterprise.ContractService.CommitExecutionErrorCallback} callback Node-style callback called with the error, if any, and CommitExecutionResponse
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(ContractService.prototype.commitExecutionError = function commitExecutionError(request, callback) {
            return this.rpcCall(commitExecutionError, $root.wavesenterprise.ExecutionErrorRequest, $root.wavesenterprise.CommitExecutionResponse, request, callback);
        }, "name", { value: "CommitExecutionError" });

        /**
         * Calls CommitExecutionError.
         * @function commitExecutionError
         * @memberof wavesenterprise.ContractService
         * @instance
         * @param {wavesenterprise.IExecutionErrorRequest} request ExecutionErrorRequest message or plain object
         * @returns {Promise<wavesenterprise.CommitExecutionResponse>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link wavesenterprise.ContractService#getContractKeys}.
         * @memberof wavesenterprise.ContractService
         * @typedef GetContractKeysCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {wavesenterprise.ContractKeysResponse} [response] ContractKeysResponse
         */

        /**
         * Calls GetContractKeys.
         * @function getContractKeys
         * @memberof wavesenterprise.ContractService
         * @instance
         * @param {wavesenterprise.IContractKeysRequest} request ContractKeysRequest message or plain object
         * @param {wavesenterprise.ContractService.GetContractKeysCallback} callback Node-style callback called with the error, if any, and ContractKeysResponse
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(ContractService.prototype.getContractKeys = function getContractKeys(request, callback) {
            return this.rpcCall(getContractKeys, $root.wavesenterprise.ContractKeysRequest, $root.wavesenterprise.ContractKeysResponse, request, callback);
        }, "name", { value: "GetContractKeys" });

        /**
         * Calls GetContractKeys.
         * @function getContractKeys
         * @memberof wavesenterprise.ContractService
         * @instance
         * @param {wavesenterprise.IContractKeysRequest} request ContractKeysRequest message or plain object
         * @returns {Promise<wavesenterprise.ContractKeysResponse>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link wavesenterprise.ContractService#getContractKey}.
         * @memberof wavesenterprise.ContractService
         * @typedef GetContractKeyCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {wavesenterprise.ContractKeyResponse} [response] ContractKeyResponse
         */

        /**
         * Calls GetContractKey.
         * @function getContractKey
         * @memberof wavesenterprise.ContractService
         * @instance
         * @param {wavesenterprise.IContractKeyRequest} request ContractKeyRequest message or plain object
         * @param {wavesenterprise.ContractService.GetContractKeyCallback} callback Node-style callback called with the error, if any, and ContractKeyResponse
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(ContractService.prototype.getContractKey = function getContractKey(request, callback) {
            return this.rpcCall(getContractKey, $root.wavesenterprise.ContractKeyRequest, $root.wavesenterprise.ContractKeyResponse, request, callback);
        }, "name", { value: "GetContractKey" });

        /**
         * Calls GetContractKey.
         * @function getContractKey
         * @memberof wavesenterprise.ContractService
         * @instance
         * @param {wavesenterprise.IContractKeyRequest} request ContractKeyRequest message or plain object
         * @returns {Promise<wavesenterprise.ContractKeyResponse>} Promise
         * @variation 2
         */

        return ContractService;
    })();

    wavesenterprise.ConnectionRequest = (function() {

        /**
         * Properties of a ConnectionRequest.
         * @memberof wavesenterprise
         * @interface IConnectionRequest
         * @property {string|null} [connectionId] ConnectionRequest connectionId
         * @property {number|null} [asyncFactor] ConnectionRequest asyncFactor
         */

        /**
         * Constructs a new ConnectionRequest.
         * @memberof wavesenterprise
         * @classdesc Represents a ConnectionRequest.
         * @implements IConnectionRequest
         * @constructor
         * @param {wavesenterprise.IConnectionRequest=} [properties] Properties to set
         */
        function ConnectionRequest(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ConnectionRequest connectionId.
         * @member {string} connectionId
         * @memberof wavesenterprise.ConnectionRequest
         * @instance
         */
        ConnectionRequest.prototype.connectionId = "";

        /**
         * ConnectionRequest asyncFactor.
         * @member {number} asyncFactor
         * @memberof wavesenterprise.ConnectionRequest
         * @instance
         */
        ConnectionRequest.prototype.asyncFactor = 0;

        /**
         * Creates a new ConnectionRequest instance using the specified properties.
         * @function create
         * @memberof wavesenterprise.ConnectionRequest
         * @static
         * @param {wavesenterprise.IConnectionRequest=} [properties] Properties to set
         * @returns {wavesenterprise.ConnectionRequest} ConnectionRequest instance
         */
        ConnectionRequest.create = function create(properties) {
            return new ConnectionRequest(properties);
        };

        /**
         * Encodes the specified ConnectionRequest message. Does not implicitly {@link wavesenterprise.ConnectionRequest.verify|verify} messages.
         * @function encode
         * @memberof wavesenterprise.ConnectionRequest
         * @static
         * @param {wavesenterprise.IConnectionRequest} message ConnectionRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ConnectionRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.connectionId != null && Object.hasOwnProperty.call(message, "connectionId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.connectionId);
            if (message.asyncFactor != null && Object.hasOwnProperty.call(message, "asyncFactor"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.asyncFactor);
            return writer;
        };

        /**
         * Encodes the specified ConnectionRequest message, length delimited. Does not implicitly {@link wavesenterprise.ConnectionRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof wavesenterprise.ConnectionRequest
         * @static
         * @param {wavesenterprise.IConnectionRequest} message ConnectionRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ConnectionRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ConnectionRequest message from the specified reader or buffer.
         * @function decode
         * @memberof wavesenterprise.ConnectionRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {wavesenterprise.ConnectionRequest} ConnectionRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ConnectionRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.wavesenterprise.ConnectionRequest();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.connectionId = reader.string();
                    break;
                case 2:
                    message.asyncFactor = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ConnectionRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof wavesenterprise.ConnectionRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {wavesenterprise.ConnectionRequest} ConnectionRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ConnectionRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ConnectionRequest message.
         * @function verify
         * @memberof wavesenterprise.ConnectionRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ConnectionRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.connectionId != null && message.hasOwnProperty("connectionId"))
                if (!$util.isString(message.connectionId))
                    return "connectionId: string expected";
            if (message.asyncFactor != null && message.hasOwnProperty("asyncFactor"))
                if (!$util.isInteger(message.asyncFactor))
                    return "asyncFactor: integer expected";
            return null;
        };

        /**
         * Creates a ConnectionRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof wavesenterprise.ConnectionRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {wavesenterprise.ConnectionRequest} ConnectionRequest
         */
        ConnectionRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.wavesenterprise.ConnectionRequest)
                return object;
            var message = new $root.wavesenterprise.ConnectionRequest();
            if (object.connectionId != null)
                message.connectionId = String(object.connectionId);
            if (object.asyncFactor != null)
                message.asyncFactor = object.asyncFactor | 0;
            return message;
        };

        /**
         * Creates a plain object from a ConnectionRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof wavesenterprise.ConnectionRequest
         * @static
         * @param {wavesenterprise.ConnectionRequest} message ConnectionRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ConnectionRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.connectionId = "";
                object.asyncFactor = 0;
            }
            if (message.connectionId != null && message.hasOwnProperty("connectionId"))
                object.connectionId = message.connectionId;
            if (message.asyncFactor != null && message.hasOwnProperty("asyncFactor"))
                object.asyncFactor = message.asyncFactor;
            return object;
        };

        /**
         * Converts this ConnectionRequest to JSON.
         * @function toJSON
         * @memberof wavesenterprise.ConnectionRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ConnectionRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ConnectionRequest;
    })();

    wavesenterprise.ContractTransactionResponse = (function() {

        /**
         * Properties of a ContractTransactionResponse.
         * @memberof wavesenterprise
         * @interface IContractTransactionResponse
         * @property {wavesenterprise.IContractTransaction|null} [transaction] ContractTransactionResponse transaction
         * @property {string|null} [authToken] ContractTransactionResponse authToken
         */

        /**
         * Constructs a new ContractTransactionResponse.
         * @memberof wavesenterprise
         * @classdesc Represents a ContractTransactionResponse.
         * @implements IContractTransactionResponse
         * @constructor
         * @param {wavesenterprise.IContractTransactionResponse=} [properties] Properties to set
         */
        function ContractTransactionResponse(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ContractTransactionResponse transaction.
         * @member {wavesenterprise.IContractTransaction|null|undefined} transaction
         * @memberof wavesenterprise.ContractTransactionResponse
         * @instance
         */
        ContractTransactionResponse.prototype.transaction = null;

        /**
         * ContractTransactionResponse authToken.
         * @member {string} authToken
         * @memberof wavesenterprise.ContractTransactionResponse
         * @instance
         */
        ContractTransactionResponse.prototype.authToken = "";

        /**
         * Creates a new ContractTransactionResponse instance using the specified properties.
         * @function create
         * @memberof wavesenterprise.ContractTransactionResponse
         * @static
         * @param {wavesenterprise.IContractTransactionResponse=} [properties] Properties to set
         * @returns {wavesenterprise.ContractTransactionResponse} ContractTransactionResponse instance
         */
        ContractTransactionResponse.create = function create(properties) {
            return new ContractTransactionResponse(properties);
        };

        /**
         * Encodes the specified ContractTransactionResponse message. Does not implicitly {@link wavesenterprise.ContractTransactionResponse.verify|verify} messages.
         * @function encode
         * @memberof wavesenterprise.ContractTransactionResponse
         * @static
         * @param {wavesenterprise.IContractTransactionResponse} message ContractTransactionResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ContractTransactionResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.transaction != null && Object.hasOwnProperty.call(message, "transaction"))
                $root.wavesenterprise.ContractTransaction.encode(message.transaction, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.authToken != null && Object.hasOwnProperty.call(message, "authToken"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.authToken);
            return writer;
        };

        /**
         * Encodes the specified ContractTransactionResponse message, length delimited. Does not implicitly {@link wavesenterprise.ContractTransactionResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof wavesenterprise.ContractTransactionResponse
         * @static
         * @param {wavesenterprise.IContractTransactionResponse} message ContractTransactionResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ContractTransactionResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ContractTransactionResponse message from the specified reader or buffer.
         * @function decode
         * @memberof wavesenterprise.ContractTransactionResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {wavesenterprise.ContractTransactionResponse} ContractTransactionResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ContractTransactionResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.wavesenterprise.ContractTransactionResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.transaction = $root.wavesenterprise.ContractTransaction.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.authToken = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ContractTransactionResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof wavesenterprise.ContractTransactionResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {wavesenterprise.ContractTransactionResponse} ContractTransactionResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ContractTransactionResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ContractTransactionResponse message.
         * @function verify
         * @memberof wavesenterprise.ContractTransactionResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ContractTransactionResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.transaction != null && message.hasOwnProperty("transaction")) {
                var error = $root.wavesenterprise.ContractTransaction.verify(message.transaction);
                if (error)
                    return "transaction." + error;
            }
            if (message.authToken != null && message.hasOwnProperty("authToken"))
                if (!$util.isString(message.authToken))
                    return "authToken: string expected";
            return null;
        };

        /**
         * Creates a ContractTransactionResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof wavesenterprise.ContractTransactionResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {wavesenterprise.ContractTransactionResponse} ContractTransactionResponse
         */
        ContractTransactionResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.wavesenterprise.ContractTransactionResponse)
                return object;
            var message = new $root.wavesenterprise.ContractTransactionResponse();
            if (object.transaction != null) {
                if (typeof object.transaction !== "object")
                    throw TypeError(".wavesenterprise.ContractTransactionResponse.transaction: object expected");
                message.transaction = $root.wavesenterprise.ContractTransaction.fromObject(object.transaction);
            }
            if (object.authToken != null)
                message.authToken = String(object.authToken);
            return message;
        };

        /**
         * Creates a plain object from a ContractTransactionResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof wavesenterprise.ContractTransactionResponse
         * @static
         * @param {wavesenterprise.ContractTransactionResponse} message ContractTransactionResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ContractTransactionResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.transaction = null;
                object.authToken = "";
            }
            if (message.transaction != null && message.hasOwnProperty("transaction"))
                object.transaction = $root.wavesenterprise.ContractTransaction.toObject(message.transaction, options);
            if (message.authToken != null && message.hasOwnProperty("authToken"))
                object.authToken = message.authToken;
            return object;
        };

        /**
         * Converts this ContractTransactionResponse to JSON.
         * @function toJSON
         * @memberof wavesenterprise.ContractTransactionResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ContractTransactionResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ContractTransactionResponse;
    })();

    wavesenterprise.ContractTransaction = (function() {

        /**
         * Properties of a ContractTransaction.
         * @memberof wavesenterprise
         * @interface IContractTransaction
         * @property {string|null} [id] ContractTransaction id
         * @property {number|null} [type] ContractTransaction type
         * @property {string|null} [sender] ContractTransaction sender
         * @property {string|null} [senderPublicKey] ContractTransaction senderPublicKey
         * @property {string|null} [contractId] ContractTransaction contractId
         * @property {Array.<wavesenterprise.IDataEntry>|null} [params] ContractTransaction params
         * @property {number|Long|null} [fee] ContractTransaction fee
         * @property {number|null} [version] ContractTransaction version
         * @property {Uint8Array|null} [proofs] ContractTransaction proofs
         * @property {number|Long|null} [timestamp] ContractTransaction timestamp
         * @property {wavesenterprise.IAssetId|null} [feeAssetId] ContractTransaction feeAssetId
         * @property {wavesenterprise.ICreateContractTransactionData|null} [createData] ContractTransaction createData
         * @property {wavesenterprise.ICallContractTransactionData|null} [callData] ContractTransaction callData
         */

        /**
         * Constructs a new ContractTransaction.
         * @memberof wavesenterprise
         * @classdesc Represents a ContractTransaction.
         * @implements IContractTransaction
         * @constructor
         * @param {wavesenterprise.IContractTransaction=} [properties] Properties to set
         */
        function ContractTransaction(properties) {
            this.params = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ContractTransaction id.
         * @member {string} id
         * @memberof wavesenterprise.ContractTransaction
         * @instance
         */
        ContractTransaction.prototype.id = "";

        /**
         * ContractTransaction type.
         * @member {number} type
         * @memberof wavesenterprise.ContractTransaction
         * @instance
         */
        ContractTransaction.prototype.type = 0;

        /**
         * ContractTransaction sender.
         * @member {string} sender
         * @memberof wavesenterprise.ContractTransaction
         * @instance
         */
        ContractTransaction.prototype.sender = "";

        /**
         * ContractTransaction senderPublicKey.
         * @member {string} senderPublicKey
         * @memberof wavesenterprise.ContractTransaction
         * @instance
         */
        ContractTransaction.prototype.senderPublicKey = "";

        /**
         * ContractTransaction contractId.
         * @member {string} contractId
         * @memberof wavesenterprise.ContractTransaction
         * @instance
         */
        ContractTransaction.prototype.contractId = "";

        /**
         * ContractTransaction params.
         * @member {Array.<wavesenterprise.IDataEntry>} params
         * @memberof wavesenterprise.ContractTransaction
         * @instance
         */
        ContractTransaction.prototype.params = $util.emptyArray;

        /**
         * ContractTransaction fee.
         * @member {number|Long} fee
         * @memberof wavesenterprise.ContractTransaction
         * @instance
         */
        ContractTransaction.prototype.fee = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * ContractTransaction version.
         * @member {number} version
         * @memberof wavesenterprise.ContractTransaction
         * @instance
         */
        ContractTransaction.prototype.version = 0;

        /**
         * ContractTransaction proofs.
         * @member {Uint8Array} proofs
         * @memberof wavesenterprise.ContractTransaction
         * @instance
         */
        ContractTransaction.prototype.proofs = $util.newBuffer([]);

        /**
         * ContractTransaction timestamp.
         * @member {number|Long} timestamp
         * @memberof wavesenterprise.ContractTransaction
         * @instance
         */
        ContractTransaction.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * ContractTransaction feeAssetId.
         * @member {wavesenterprise.IAssetId|null|undefined} feeAssetId
         * @memberof wavesenterprise.ContractTransaction
         * @instance
         */
        ContractTransaction.prototype.feeAssetId = null;

        /**
         * ContractTransaction createData.
         * @member {wavesenterprise.ICreateContractTransactionData|null|undefined} createData
         * @memberof wavesenterprise.ContractTransaction
         * @instance
         */
        ContractTransaction.prototype.createData = null;

        /**
         * ContractTransaction callData.
         * @member {wavesenterprise.ICallContractTransactionData|null|undefined} callData
         * @memberof wavesenterprise.ContractTransaction
         * @instance
         */
        ContractTransaction.prototype.callData = null;

        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;

        /**
         * ContractTransaction data.
         * @member {"createData"|"callData"|undefined} data
         * @memberof wavesenterprise.ContractTransaction
         * @instance
         */
        Object.defineProperty(ContractTransaction.prototype, "data", {
            get: $util.oneOfGetter($oneOfFields = ["createData", "callData"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new ContractTransaction instance using the specified properties.
         * @function create
         * @memberof wavesenterprise.ContractTransaction
         * @static
         * @param {wavesenterprise.IContractTransaction=} [properties] Properties to set
         * @returns {wavesenterprise.ContractTransaction} ContractTransaction instance
         */
        ContractTransaction.create = function create(properties) {
            return new ContractTransaction(properties);
        };

        /**
         * Encodes the specified ContractTransaction message. Does not implicitly {@link wavesenterprise.ContractTransaction.verify|verify} messages.
         * @function encode
         * @memberof wavesenterprise.ContractTransaction
         * @static
         * @param {wavesenterprise.IContractTransaction} message ContractTransaction message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ContractTransaction.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.type);
            if (message.sender != null && Object.hasOwnProperty.call(message, "sender"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.sender);
            if (message.senderPublicKey != null && Object.hasOwnProperty.call(message, "senderPublicKey"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.senderPublicKey);
            if (message.contractId != null && Object.hasOwnProperty.call(message, "contractId"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.contractId);
            if (message.params != null && message.params.length)
                for (var i = 0; i < message.params.length; ++i)
                    $root.wavesenterprise.DataEntry.encode(message.params[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.fee != null && Object.hasOwnProperty.call(message, "fee"))
                writer.uint32(/* id 7, wireType 0 =*/56).int64(message.fee);
            if (message.version != null && Object.hasOwnProperty.call(message, "version"))
                writer.uint32(/* id 8, wireType 0 =*/64).int32(message.version);
            if (message.proofs != null && Object.hasOwnProperty.call(message, "proofs"))
                writer.uint32(/* id 9, wireType 2 =*/74).bytes(message.proofs);
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 10, wireType 0 =*/80).int64(message.timestamp);
            if (message.feeAssetId != null && Object.hasOwnProperty.call(message, "feeAssetId"))
                $root.wavesenterprise.AssetId.encode(message.feeAssetId, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
            if (message.createData != null && Object.hasOwnProperty.call(message, "createData"))
                $root.wavesenterprise.CreateContractTransactionData.encode(message.createData, writer.uint32(/* id 20, wireType 2 =*/162).fork()).ldelim();
            if (message.callData != null && Object.hasOwnProperty.call(message, "callData"))
                $root.wavesenterprise.CallContractTransactionData.encode(message.callData, writer.uint32(/* id 21, wireType 2 =*/170).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ContractTransaction message, length delimited. Does not implicitly {@link wavesenterprise.ContractTransaction.verify|verify} messages.
         * @function encodeDelimited
         * @memberof wavesenterprise.ContractTransaction
         * @static
         * @param {wavesenterprise.IContractTransaction} message ContractTransaction message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ContractTransaction.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ContractTransaction message from the specified reader or buffer.
         * @function decode
         * @memberof wavesenterprise.ContractTransaction
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {wavesenterprise.ContractTransaction} ContractTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ContractTransaction.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.wavesenterprise.ContractTransaction();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.id = reader.string();
                    break;
                case 2:
                    message.type = reader.int32();
                    break;
                case 3:
                    message.sender = reader.string();
                    break;
                case 4:
                    message.senderPublicKey = reader.string();
                    break;
                case 5:
                    message.contractId = reader.string();
                    break;
                case 6:
                    if (!(message.params && message.params.length))
                        message.params = [];
                    message.params.push($root.wavesenterprise.DataEntry.decode(reader, reader.uint32()));
                    break;
                case 7:
                    message.fee = reader.int64();
                    break;
                case 8:
                    message.version = reader.int32();
                    break;
                case 9:
                    message.proofs = reader.bytes();
                    break;
                case 10:
                    message.timestamp = reader.int64();
                    break;
                case 11:
                    message.feeAssetId = $root.wavesenterprise.AssetId.decode(reader, reader.uint32());
                    break;
                case 20:
                    message.createData = $root.wavesenterprise.CreateContractTransactionData.decode(reader, reader.uint32());
                    break;
                case 21:
                    message.callData = $root.wavesenterprise.CallContractTransactionData.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ContractTransaction message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof wavesenterprise.ContractTransaction
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {wavesenterprise.ContractTransaction} ContractTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ContractTransaction.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ContractTransaction message.
         * @function verify
         * @memberof wavesenterprise.ContractTransaction
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ContractTransaction.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isString(message.id))
                    return "id: string expected";
            if (message.type != null && message.hasOwnProperty("type"))
                if (!$util.isInteger(message.type))
                    return "type: integer expected";
            if (message.sender != null && message.hasOwnProperty("sender"))
                if (!$util.isString(message.sender))
                    return "sender: string expected";
            if (message.senderPublicKey != null && message.hasOwnProperty("senderPublicKey"))
                if (!$util.isString(message.senderPublicKey))
                    return "senderPublicKey: string expected";
            if (message.contractId != null && message.hasOwnProperty("contractId"))
                if (!$util.isString(message.contractId))
                    return "contractId: string expected";
            if (message.params != null && message.hasOwnProperty("params")) {
                if (!Array.isArray(message.params))
                    return "params: array expected";
                for (var i = 0; i < message.params.length; ++i) {
                    var error = $root.wavesenterprise.DataEntry.verify(message.params[i]);
                    if (error)
                        return "params." + error;
                }
            }
            if (message.fee != null && message.hasOwnProperty("fee"))
                if (!$util.isInteger(message.fee) && !(message.fee && $util.isInteger(message.fee.low) && $util.isInteger(message.fee.high)))
                    return "fee: integer|Long expected";
            if (message.version != null && message.hasOwnProperty("version"))
                if (!$util.isInteger(message.version))
                    return "version: integer expected";
            if (message.proofs != null && message.hasOwnProperty("proofs"))
                if (!(message.proofs && typeof message.proofs.length === "number" || $util.isString(message.proofs)))
                    return "proofs: buffer expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            if (message.feeAssetId != null && message.hasOwnProperty("feeAssetId")) {
                var error = $root.wavesenterprise.AssetId.verify(message.feeAssetId);
                if (error)
                    return "feeAssetId." + error;
            }
            if (message.createData != null && message.hasOwnProperty("createData")) {
                properties.data = 1;
                {
                    var error = $root.wavesenterprise.CreateContractTransactionData.verify(message.createData);
                    if (error)
                        return "createData." + error;
                }
            }
            if (message.callData != null && message.hasOwnProperty("callData")) {
                if (properties.data === 1)
                    return "data: multiple values";
                properties.data = 1;
                {
                    var error = $root.wavesenterprise.CallContractTransactionData.verify(message.callData);
                    if (error)
                        return "callData." + error;
                }
            }
            return null;
        };

        /**
         * Creates a ContractTransaction message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof wavesenterprise.ContractTransaction
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {wavesenterprise.ContractTransaction} ContractTransaction
         */
        ContractTransaction.fromObject = function fromObject(object) {
            if (object instanceof $root.wavesenterprise.ContractTransaction)
                return object;
            var message = new $root.wavesenterprise.ContractTransaction();
            if (object.id != null)
                message.id = String(object.id);
            if (object.type != null)
                message.type = object.type | 0;
            if (object.sender != null)
                message.sender = String(object.sender);
            if (object.senderPublicKey != null)
                message.senderPublicKey = String(object.senderPublicKey);
            if (object.contractId != null)
                message.contractId = String(object.contractId);
            if (object.params) {
                if (!Array.isArray(object.params))
                    throw TypeError(".wavesenterprise.ContractTransaction.params: array expected");
                message.params = [];
                for (var i = 0; i < object.params.length; ++i) {
                    if (typeof object.params[i] !== "object")
                        throw TypeError(".wavesenterprise.ContractTransaction.params: object expected");
                    message.params[i] = $root.wavesenterprise.DataEntry.fromObject(object.params[i]);
                }
            }
            if (object.fee != null)
                if ($util.Long)
                    (message.fee = $util.Long.fromValue(object.fee)).unsigned = false;
                else if (typeof object.fee === "string")
                    message.fee = parseInt(object.fee, 10);
                else if (typeof object.fee === "number")
                    message.fee = object.fee;
                else if (typeof object.fee === "object")
                    message.fee = new $util.LongBits(object.fee.low >>> 0, object.fee.high >>> 0).toNumber();
            if (object.version != null)
                message.version = object.version | 0;
            if (object.proofs != null)
                if (typeof object.proofs === "string")
                    $util.base64.decode(object.proofs, message.proofs = $util.newBuffer($util.base64.length(object.proofs)), 0);
                else if (object.proofs.length)
                    message.proofs = object.proofs;
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
            if (object.feeAssetId != null) {
                if (typeof object.feeAssetId !== "object")
                    throw TypeError(".wavesenterprise.ContractTransaction.feeAssetId: object expected");
                message.feeAssetId = $root.wavesenterprise.AssetId.fromObject(object.feeAssetId);
            }
            if (object.createData != null) {
                if (typeof object.createData !== "object")
                    throw TypeError(".wavesenterprise.ContractTransaction.createData: object expected");
                message.createData = $root.wavesenterprise.CreateContractTransactionData.fromObject(object.createData);
            }
            if (object.callData != null) {
                if (typeof object.callData !== "object")
                    throw TypeError(".wavesenterprise.ContractTransaction.callData: object expected");
                message.callData = $root.wavesenterprise.CallContractTransactionData.fromObject(object.callData);
            }
            return message;
        };

        /**
         * Creates a plain object from a ContractTransaction message. Also converts values to other types if specified.
         * @function toObject
         * @memberof wavesenterprise.ContractTransaction
         * @static
         * @param {wavesenterprise.ContractTransaction} message ContractTransaction
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ContractTransaction.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.params = [];
            if (options.defaults) {
                object.id = "";
                object.type = 0;
                object.sender = "";
                object.senderPublicKey = "";
                object.contractId = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.fee = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.fee = options.longs === String ? "0" : 0;
                object.version = 0;
                if (options.bytes === String)
                    object.proofs = "";
                else {
                    object.proofs = [];
                    if (options.bytes !== Array)
                        object.proofs = $util.newBuffer(object.proofs);
                }
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
                object.feeAssetId = null;
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = message.type;
            if (message.sender != null && message.hasOwnProperty("sender"))
                object.sender = message.sender;
            if (message.senderPublicKey != null && message.hasOwnProperty("senderPublicKey"))
                object.senderPublicKey = message.senderPublicKey;
            if (message.contractId != null && message.hasOwnProperty("contractId"))
                object.contractId = message.contractId;
            if (message.params && message.params.length) {
                object.params = [];
                for (var j = 0; j < message.params.length; ++j)
                    object.params[j] = $root.wavesenterprise.DataEntry.toObject(message.params[j], options);
            }
            if (message.fee != null && message.hasOwnProperty("fee"))
                if (typeof message.fee === "number")
                    object.fee = options.longs === String ? String(message.fee) : message.fee;
                else
                    object.fee = options.longs === String ? $util.Long.prototype.toString.call(message.fee) : options.longs === Number ? new $util.LongBits(message.fee.low >>> 0, message.fee.high >>> 0).toNumber() : message.fee;
            if (message.version != null && message.hasOwnProperty("version"))
                object.version = message.version;
            if (message.proofs != null && message.hasOwnProperty("proofs"))
                object.proofs = options.bytes === String ? $util.base64.encode(message.proofs, 0, message.proofs.length) : options.bytes === Array ? Array.prototype.slice.call(message.proofs) : message.proofs;
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
            if (message.feeAssetId != null && message.hasOwnProperty("feeAssetId"))
                object.feeAssetId = $root.wavesenterprise.AssetId.toObject(message.feeAssetId, options);
            if (message.createData != null && message.hasOwnProperty("createData")) {
                object.createData = $root.wavesenterprise.CreateContractTransactionData.toObject(message.createData, options);
                if (options.oneofs)
                    object.data = "createData";
            }
            if (message.callData != null && message.hasOwnProperty("callData")) {
                object.callData = $root.wavesenterprise.CallContractTransactionData.toObject(message.callData, options);
                if (options.oneofs)
                    object.data = "callData";
            }
            return object;
        };

        /**
         * Converts this ContractTransaction to JSON.
         * @function toJSON
         * @memberof wavesenterprise.ContractTransaction
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ContractTransaction.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ContractTransaction;
    })();

    wavesenterprise.CreateContractTransactionData = (function() {

        /**
         * Properties of a CreateContractTransactionData.
         * @memberof wavesenterprise
         * @interface ICreateContractTransactionData
         * @property {string|null} [image] CreateContractTransactionData image
         * @property {string|null} [imageHash] CreateContractTransactionData imageHash
         * @property {string|null} [contractName] CreateContractTransactionData contractName
         */

        /**
         * Constructs a new CreateContractTransactionData.
         * @memberof wavesenterprise
         * @classdesc Represents a CreateContractTransactionData.
         * @implements ICreateContractTransactionData
         * @constructor
         * @param {wavesenterprise.ICreateContractTransactionData=} [properties] Properties to set
         */
        function CreateContractTransactionData(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CreateContractTransactionData image.
         * @member {string} image
         * @memberof wavesenterprise.CreateContractTransactionData
         * @instance
         */
        CreateContractTransactionData.prototype.image = "";

        /**
         * CreateContractTransactionData imageHash.
         * @member {string} imageHash
         * @memberof wavesenterprise.CreateContractTransactionData
         * @instance
         */
        CreateContractTransactionData.prototype.imageHash = "";

        /**
         * CreateContractTransactionData contractName.
         * @member {string} contractName
         * @memberof wavesenterprise.CreateContractTransactionData
         * @instance
         */
        CreateContractTransactionData.prototype.contractName = "";

        /**
         * Creates a new CreateContractTransactionData instance using the specified properties.
         * @function create
         * @memberof wavesenterprise.CreateContractTransactionData
         * @static
         * @param {wavesenterprise.ICreateContractTransactionData=} [properties] Properties to set
         * @returns {wavesenterprise.CreateContractTransactionData} CreateContractTransactionData instance
         */
        CreateContractTransactionData.create = function create(properties) {
            return new CreateContractTransactionData(properties);
        };

        /**
         * Encodes the specified CreateContractTransactionData message. Does not implicitly {@link wavesenterprise.CreateContractTransactionData.verify|verify} messages.
         * @function encode
         * @memberof wavesenterprise.CreateContractTransactionData
         * @static
         * @param {wavesenterprise.ICreateContractTransactionData} message CreateContractTransactionData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CreateContractTransactionData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.image != null && Object.hasOwnProperty.call(message, "image"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.image);
            if (message.imageHash != null && Object.hasOwnProperty.call(message, "imageHash"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.imageHash);
            if (message.contractName != null && Object.hasOwnProperty.call(message, "contractName"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.contractName);
            return writer;
        };

        /**
         * Encodes the specified CreateContractTransactionData message, length delimited. Does not implicitly {@link wavesenterprise.CreateContractTransactionData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof wavesenterprise.CreateContractTransactionData
         * @static
         * @param {wavesenterprise.ICreateContractTransactionData} message CreateContractTransactionData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CreateContractTransactionData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CreateContractTransactionData message from the specified reader or buffer.
         * @function decode
         * @memberof wavesenterprise.CreateContractTransactionData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {wavesenterprise.CreateContractTransactionData} CreateContractTransactionData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CreateContractTransactionData.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.wavesenterprise.CreateContractTransactionData();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.image = reader.string();
                    break;
                case 2:
                    message.imageHash = reader.string();
                    break;
                case 3:
                    message.contractName = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CreateContractTransactionData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof wavesenterprise.CreateContractTransactionData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {wavesenterprise.CreateContractTransactionData} CreateContractTransactionData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CreateContractTransactionData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CreateContractTransactionData message.
         * @function verify
         * @memberof wavesenterprise.CreateContractTransactionData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CreateContractTransactionData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.image != null && message.hasOwnProperty("image"))
                if (!$util.isString(message.image))
                    return "image: string expected";
            if (message.imageHash != null && message.hasOwnProperty("imageHash"))
                if (!$util.isString(message.imageHash))
                    return "imageHash: string expected";
            if (message.contractName != null && message.hasOwnProperty("contractName"))
                if (!$util.isString(message.contractName))
                    return "contractName: string expected";
            return null;
        };

        /**
         * Creates a CreateContractTransactionData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof wavesenterprise.CreateContractTransactionData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {wavesenterprise.CreateContractTransactionData} CreateContractTransactionData
         */
        CreateContractTransactionData.fromObject = function fromObject(object) {
            if (object instanceof $root.wavesenterprise.CreateContractTransactionData)
                return object;
            var message = new $root.wavesenterprise.CreateContractTransactionData();
            if (object.image != null)
                message.image = String(object.image);
            if (object.imageHash != null)
                message.imageHash = String(object.imageHash);
            if (object.contractName != null)
                message.contractName = String(object.contractName);
            return message;
        };

        /**
         * Creates a plain object from a CreateContractTransactionData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof wavesenterprise.CreateContractTransactionData
         * @static
         * @param {wavesenterprise.CreateContractTransactionData} message CreateContractTransactionData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CreateContractTransactionData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.image = "";
                object.imageHash = "";
                object.contractName = "";
            }
            if (message.image != null && message.hasOwnProperty("image"))
                object.image = message.image;
            if (message.imageHash != null && message.hasOwnProperty("imageHash"))
                object.imageHash = message.imageHash;
            if (message.contractName != null && message.hasOwnProperty("contractName"))
                object.contractName = message.contractName;
            return object;
        };

        /**
         * Converts this CreateContractTransactionData to JSON.
         * @function toJSON
         * @memberof wavesenterprise.CreateContractTransactionData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CreateContractTransactionData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CreateContractTransactionData;
    })();

    wavesenterprise.CallContractTransactionData = (function() {

        /**
         * Properties of a CallContractTransactionData.
         * @memberof wavesenterprise
         * @interface ICallContractTransactionData
         * @property {number|null} [contractVersion] CallContractTransactionData contractVersion
         */

        /**
         * Constructs a new CallContractTransactionData.
         * @memberof wavesenterprise
         * @classdesc Represents a CallContractTransactionData.
         * @implements ICallContractTransactionData
         * @constructor
         * @param {wavesenterprise.ICallContractTransactionData=} [properties] Properties to set
         */
        function CallContractTransactionData(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CallContractTransactionData contractVersion.
         * @member {number} contractVersion
         * @memberof wavesenterprise.CallContractTransactionData
         * @instance
         */
        CallContractTransactionData.prototype.contractVersion = 0;

        /**
         * Creates a new CallContractTransactionData instance using the specified properties.
         * @function create
         * @memberof wavesenterprise.CallContractTransactionData
         * @static
         * @param {wavesenterprise.ICallContractTransactionData=} [properties] Properties to set
         * @returns {wavesenterprise.CallContractTransactionData} CallContractTransactionData instance
         */
        CallContractTransactionData.create = function create(properties) {
            return new CallContractTransactionData(properties);
        };

        /**
         * Encodes the specified CallContractTransactionData message. Does not implicitly {@link wavesenterprise.CallContractTransactionData.verify|verify} messages.
         * @function encode
         * @memberof wavesenterprise.CallContractTransactionData
         * @static
         * @param {wavesenterprise.ICallContractTransactionData} message CallContractTransactionData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CallContractTransactionData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.contractVersion != null && Object.hasOwnProperty.call(message, "contractVersion"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.contractVersion);
            return writer;
        };

        /**
         * Encodes the specified CallContractTransactionData message, length delimited. Does not implicitly {@link wavesenterprise.CallContractTransactionData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof wavesenterprise.CallContractTransactionData
         * @static
         * @param {wavesenterprise.ICallContractTransactionData} message CallContractTransactionData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CallContractTransactionData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CallContractTransactionData message from the specified reader or buffer.
         * @function decode
         * @memberof wavesenterprise.CallContractTransactionData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {wavesenterprise.CallContractTransactionData} CallContractTransactionData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CallContractTransactionData.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.wavesenterprise.CallContractTransactionData();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.contractVersion = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CallContractTransactionData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof wavesenterprise.CallContractTransactionData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {wavesenterprise.CallContractTransactionData} CallContractTransactionData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CallContractTransactionData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CallContractTransactionData message.
         * @function verify
         * @memberof wavesenterprise.CallContractTransactionData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CallContractTransactionData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.contractVersion != null && message.hasOwnProperty("contractVersion"))
                if (!$util.isInteger(message.contractVersion))
                    return "contractVersion: integer expected";
            return null;
        };

        /**
         * Creates a CallContractTransactionData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof wavesenterprise.CallContractTransactionData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {wavesenterprise.CallContractTransactionData} CallContractTransactionData
         */
        CallContractTransactionData.fromObject = function fromObject(object) {
            if (object instanceof $root.wavesenterprise.CallContractTransactionData)
                return object;
            var message = new $root.wavesenterprise.CallContractTransactionData();
            if (object.contractVersion != null)
                message.contractVersion = object.contractVersion | 0;
            return message;
        };

        /**
         * Creates a plain object from a CallContractTransactionData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof wavesenterprise.CallContractTransactionData
         * @static
         * @param {wavesenterprise.CallContractTransactionData} message CallContractTransactionData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CallContractTransactionData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.contractVersion = 0;
            if (message.contractVersion != null && message.hasOwnProperty("contractVersion"))
                object.contractVersion = message.contractVersion;
            return object;
        };

        /**
         * Converts this CallContractTransactionData to JSON.
         * @function toJSON
         * @memberof wavesenterprise.CallContractTransactionData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CallContractTransactionData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CallContractTransactionData;
    })();

    wavesenterprise.ExecutionSuccessRequest = (function() {

        /**
         * Properties of an ExecutionSuccessRequest.
         * @memberof wavesenterprise
         * @interface IExecutionSuccessRequest
         * @property {string|null} [txId] ExecutionSuccessRequest txId
         * @property {Array.<wavesenterprise.IDataEntry>|null} [results] ExecutionSuccessRequest results
         */

        /**
         * Constructs a new ExecutionSuccessRequest.
         * @memberof wavesenterprise
         * @classdesc Represents an ExecutionSuccessRequest.
         * @implements IExecutionSuccessRequest
         * @constructor
         * @param {wavesenterprise.IExecutionSuccessRequest=} [properties] Properties to set
         */
        function ExecutionSuccessRequest(properties) {
            this.results = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ExecutionSuccessRequest txId.
         * @member {string} txId
         * @memberof wavesenterprise.ExecutionSuccessRequest
         * @instance
         */
        ExecutionSuccessRequest.prototype.txId = "";

        /**
         * ExecutionSuccessRequest results.
         * @member {Array.<wavesenterprise.IDataEntry>} results
         * @memberof wavesenterprise.ExecutionSuccessRequest
         * @instance
         */
        ExecutionSuccessRequest.prototype.results = $util.emptyArray;

        /**
         * Creates a new ExecutionSuccessRequest instance using the specified properties.
         * @function create
         * @memberof wavesenterprise.ExecutionSuccessRequest
         * @static
         * @param {wavesenterprise.IExecutionSuccessRequest=} [properties] Properties to set
         * @returns {wavesenterprise.ExecutionSuccessRequest} ExecutionSuccessRequest instance
         */
        ExecutionSuccessRequest.create = function create(properties) {
            return new ExecutionSuccessRequest(properties);
        };

        /**
         * Encodes the specified ExecutionSuccessRequest message. Does not implicitly {@link wavesenterprise.ExecutionSuccessRequest.verify|verify} messages.
         * @function encode
         * @memberof wavesenterprise.ExecutionSuccessRequest
         * @static
         * @param {wavesenterprise.IExecutionSuccessRequest} message ExecutionSuccessRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ExecutionSuccessRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.txId != null && Object.hasOwnProperty.call(message, "txId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.txId);
            if (message.results != null && message.results.length)
                for (var i = 0; i < message.results.length; ++i)
                    $root.wavesenterprise.DataEntry.encode(message.results[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ExecutionSuccessRequest message, length delimited. Does not implicitly {@link wavesenterprise.ExecutionSuccessRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof wavesenterprise.ExecutionSuccessRequest
         * @static
         * @param {wavesenterprise.IExecutionSuccessRequest} message ExecutionSuccessRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ExecutionSuccessRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ExecutionSuccessRequest message from the specified reader or buffer.
         * @function decode
         * @memberof wavesenterprise.ExecutionSuccessRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {wavesenterprise.ExecutionSuccessRequest} ExecutionSuccessRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ExecutionSuccessRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.wavesenterprise.ExecutionSuccessRequest();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.txId = reader.string();
                    break;
                case 2:
                    if (!(message.results && message.results.length))
                        message.results = [];
                    message.results.push($root.wavesenterprise.DataEntry.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an ExecutionSuccessRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof wavesenterprise.ExecutionSuccessRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {wavesenterprise.ExecutionSuccessRequest} ExecutionSuccessRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ExecutionSuccessRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ExecutionSuccessRequest message.
         * @function verify
         * @memberof wavesenterprise.ExecutionSuccessRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ExecutionSuccessRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.txId != null && message.hasOwnProperty("txId"))
                if (!$util.isString(message.txId))
                    return "txId: string expected";
            if (message.results != null && message.hasOwnProperty("results")) {
                if (!Array.isArray(message.results))
                    return "results: array expected";
                for (var i = 0; i < message.results.length; ++i) {
                    var error = $root.wavesenterprise.DataEntry.verify(message.results[i]);
                    if (error)
                        return "results." + error;
                }
            }
            return null;
        };

        /**
         * Creates an ExecutionSuccessRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof wavesenterprise.ExecutionSuccessRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {wavesenterprise.ExecutionSuccessRequest} ExecutionSuccessRequest
         */
        ExecutionSuccessRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.wavesenterprise.ExecutionSuccessRequest)
                return object;
            var message = new $root.wavesenterprise.ExecutionSuccessRequest();
            if (object.txId != null)
                message.txId = String(object.txId);
            if (object.results) {
                if (!Array.isArray(object.results))
                    throw TypeError(".wavesenterprise.ExecutionSuccessRequest.results: array expected");
                message.results = [];
                for (var i = 0; i < object.results.length; ++i) {
                    if (typeof object.results[i] !== "object")
                        throw TypeError(".wavesenterprise.ExecutionSuccessRequest.results: object expected");
                    message.results[i] = $root.wavesenterprise.DataEntry.fromObject(object.results[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from an ExecutionSuccessRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof wavesenterprise.ExecutionSuccessRequest
         * @static
         * @param {wavesenterprise.ExecutionSuccessRequest} message ExecutionSuccessRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ExecutionSuccessRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.results = [];
            if (options.defaults)
                object.txId = "";
            if (message.txId != null && message.hasOwnProperty("txId"))
                object.txId = message.txId;
            if (message.results && message.results.length) {
                object.results = [];
                for (var j = 0; j < message.results.length; ++j)
                    object.results[j] = $root.wavesenterprise.DataEntry.toObject(message.results[j], options);
            }
            return object;
        };

        /**
         * Converts this ExecutionSuccessRequest to JSON.
         * @function toJSON
         * @memberof wavesenterprise.ExecutionSuccessRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ExecutionSuccessRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ExecutionSuccessRequest;
    })();

    wavesenterprise.ExecutionErrorRequest = (function() {

        /**
         * Properties of an ExecutionErrorRequest.
         * @memberof wavesenterprise
         * @interface IExecutionErrorRequest
         * @property {string|null} [txId] ExecutionErrorRequest txId
         * @property {string|null} [message] ExecutionErrorRequest message
         */

        /**
         * Constructs a new ExecutionErrorRequest.
         * @memberof wavesenterprise
         * @classdesc Represents an ExecutionErrorRequest.
         * @implements IExecutionErrorRequest
         * @constructor
         * @param {wavesenterprise.IExecutionErrorRequest=} [properties] Properties to set
         */
        function ExecutionErrorRequest(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ExecutionErrorRequest txId.
         * @member {string} txId
         * @memberof wavesenterprise.ExecutionErrorRequest
         * @instance
         */
        ExecutionErrorRequest.prototype.txId = "";

        /**
         * ExecutionErrorRequest message.
         * @member {string} message
         * @memberof wavesenterprise.ExecutionErrorRequest
         * @instance
         */
        ExecutionErrorRequest.prototype.message = "";

        /**
         * Creates a new ExecutionErrorRequest instance using the specified properties.
         * @function create
         * @memberof wavesenterprise.ExecutionErrorRequest
         * @static
         * @param {wavesenterprise.IExecutionErrorRequest=} [properties] Properties to set
         * @returns {wavesenterprise.ExecutionErrorRequest} ExecutionErrorRequest instance
         */
        ExecutionErrorRequest.create = function create(properties) {
            return new ExecutionErrorRequest(properties);
        };

        /**
         * Encodes the specified ExecutionErrorRequest message. Does not implicitly {@link wavesenterprise.ExecutionErrorRequest.verify|verify} messages.
         * @function encode
         * @memberof wavesenterprise.ExecutionErrorRequest
         * @static
         * @param {wavesenterprise.IExecutionErrorRequest} message ExecutionErrorRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ExecutionErrorRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.txId != null && Object.hasOwnProperty.call(message, "txId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.txId);
            if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.message);
            return writer;
        };

        /**
         * Encodes the specified ExecutionErrorRequest message, length delimited. Does not implicitly {@link wavesenterprise.ExecutionErrorRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof wavesenterprise.ExecutionErrorRequest
         * @static
         * @param {wavesenterprise.IExecutionErrorRequest} message ExecutionErrorRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ExecutionErrorRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ExecutionErrorRequest message from the specified reader or buffer.
         * @function decode
         * @memberof wavesenterprise.ExecutionErrorRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {wavesenterprise.ExecutionErrorRequest} ExecutionErrorRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ExecutionErrorRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.wavesenterprise.ExecutionErrorRequest();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.txId = reader.string();
                    break;
                case 2:
                    message.message = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an ExecutionErrorRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof wavesenterprise.ExecutionErrorRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {wavesenterprise.ExecutionErrorRequest} ExecutionErrorRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ExecutionErrorRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ExecutionErrorRequest message.
         * @function verify
         * @memberof wavesenterprise.ExecutionErrorRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ExecutionErrorRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.txId != null && message.hasOwnProperty("txId"))
                if (!$util.isString(message.txId))
                    return "txId: string expected";
            if (message.message != null && message.hasOwnProperty("message"))
                if (!$util.isString(message.message))
                    return "message: string expected";
            return null;
        };

        /**
         * Creates an ExecutionErrorRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof wavesenterprise.ExecutionErrorRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {wavesenterprise.ExecutionErrorRequest} ExecutionErrorRequest
         */
        ExecutionErrorRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.wavesenterprise.ExecutionErrorRequest)
                return object;
            var message = new $root.wavesenterprise.ExecutionErrorRequest();
            if (object.txId != null)
                message.txId = String(object.txId);
            if (object.message != null)
                message.message = String(object.message);
            return message;
        };

        /**
         * Creates a plain object from an ExecutionErrorRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof wavesenterprise.ExecutionErrorRequest
         * @static
         * @param {wavesenterprise.ExecutionErrorRequest} message ExecutionErrorRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ExecutionErrorRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.txId = "";
                object.message = "";
            }
            if (message.txId != null && message.hasOwnProperty("txId"))
                object.txId = message.txId;
            if (message.message != null && message.hasOwnProperty("message"))
                object.message = message.message;
            return object;
        };

        /**
         * Converts this ExecutionErrorRequest to JSON.
         * @function toJSON
         * @memberof wavesenterprise.ExecutionErrorRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ExecutionErrorRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ExecutionErrorRequest;
    })();

    wavesenterprise.CommitExecutionResponse = (function() {

        /**
         * Properties of a CommitExecutionResponse.
         * @memberof wavesenterprise
         * @interface ICommitExecutionResponse
         */

        /**
         * Constructs a new CommitExecutionResponse.
         * @memberof wavesenterprise
         * @classdesc Represents a CommitExecutionResponse.
         * @implements ICommitExecutionResponse
         * @constructor
         * @param {wavesenterprise.ICommitExecutionResponse=} [properties] Properties to set
         */
        function CommitExecutionResponse(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new CommitExecutionResponse instance using the specified properties.
         * @function create
         * @memberof wavesenterprise.CommitExecutionResponse
         * @static
         * @param {wavesenterprise.ICommitExecutionResponse=} [properties] Properties to set
         * @returns {wavesenterprise.CommitExecutionResponse} CommitExecutionResponse instance
         */
        CommitExecutionResponse.create = function create(properties) {
            return new CommitExecutionResponse(properties);
        };

        /**
         * Encodes the specified CommitExecutionResponse message. Does not implicitly {@link wavesenterprise.CommitExecutionResponse.verify|verify} messages.
         * @function encode
         * @memberof wavesenterprise.CommitExecutionResponse
         * @static
         * @param {wavesenterprise.ICommitExecutionResponse} message CommitExecutionResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CommitExecutionResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified CommitExecutionResponse message, length delimited. Does not implicitly {@link wavesenterprise.CommitExecutionResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof wavesenterprise.CommitExecutionResponse
         * @static
         * @param {wavesenterprise.ICommitExecutionResponse} message CommitExecutionResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CommitExecutionResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CommitExecutionResponse message from the specified reader or buffer.
         * @function decode
         * @memberof wavesenterprise.CommitExecutionResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {wavesenterprise.CommitExecutionResponse} CommitExecutionResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CommitExecutionResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.wavesenterprise.CommitExecutionResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CommitExecutionResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof wavesenterprise.CommitExecutionResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {wavesenterprise.CommitExecutionResponse} CommitExecutionResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CommitExecutionResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CommitExecutionResponse message.
         * @function verify
         * @memberof wavesenterprise.CommitExecutionResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CommitExecutionResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            return null;
        };

        /**
         * Creates a CommitExecutionResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof wavesenterprise.CommitExecutionResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {wavesenterprise.CommitExecutionResponse} CommitExecutionResponse
         */
        CommitExecutionResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.wavesenterprise.CommitExecutionResponse)
                return object;
            return new $root.wavesenterprise.CommitExecutionResponse();
        };

        /**
         * Creates a plain object from a CommitExecutionResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof wavesenterprise.CommitExecutionResponse
         * @static
         * @param {wavesenterprise.CommitExecutionResponse} message CommitExecutionResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CommitExecutionResponse.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this CommitExecutionResponse to JSON.
         * @function toJSON
         * @memberof wavesenterprise.CommitExecutionResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CommitExecutionResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CommitExecutionResponse;
    })();

    wavesenterprise.ContractKeysRequest = (function() {

        /**
         * Properties of a ContractKeysRequest.
         * @memberof wavesenterprise
         * @interface IContractKeysRequest
         * @property {string|null} [contractId] ContractKeysRequest contractId
         * @property {google.protobuf.IInt32Value|null} [limit] ContractKeysRequest limit
         * @property {google.protobuf.IInt32Value|null} [offset] ContractKeysRequest offset
         * @property {google.protobuf.IStringValue|null} [matches] ContractKeysRequest matches
         * @property {wavesenterprise.IKeysFilter|null} [keysFilter] ContractKeysRequest keysFilter
         */

        /**
         * Constructs a new ContractKeysRequest.
         * @memberof wavesenterprise
         * @classdesc Represents a ContractKeysRequest.
         * @implements IContractKeysRequest
         * @constructor
         * @param {wavesenterprise.IContractKeysRequest=} [properties] Properties to set
         */
        function ContractKeysRequest(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ContractKeysRequest contractId.
         * @member {string} contractId
         * @memberof wavesenterprise.ContractKeysRequest
         * @instance
         */
        ContractKeysRequest.prototype.contractId = "";

        /**
         * ContractKeysRequest limit.
         * @member {google.protobuf.IInt32Value|null|undefined} limit
         * @memberof wavesenterprise.ContractKeysRequest
         * @instance
         */
        ContractKeysRequest.prototype.limit = null;

        /**
         * ContractKeysRequest offset.
         * @member {google.protobuf.IInt32Value|null|undefined} offset
         * @memberof wavesenterprise.ContractKeysRequest
         * @instance
         */
        ContractKeysRequest.prototype.offset = null;

        /**
         * ContractKeysRequest matches.
         * @member {google.protobuf.IStringValue|null|undefined} matches
         * @memberof wavesenterprise.ContractKeysRequest
         * @instance
         */
        ContractKeysRequest.prototype.matches = null;

        /**
         * ContractKeysRequest keysFilter.
         * @member {wavesenterprise.IKeysFilter|null|undefined} keysFilter
         * @memberof wavesenterprise.ContractKeysRequest
         * @instance
         */
        ContractKeysRequest.prototype.keysFilter = null;

        /**
         * Creates a new ContractKeysRequest instance using the specified properties.
         * @function create
         * @memberof wavesenterprise.ContractKeysRequest
         * @static
         * @param {wavesenterprise.IContractKeysRequest=} [properties] Properties to set
         * @returns {wavesenterprise.ContractKeysRequest} ContractKeysRequest instance
         */
        ContractKeysRequest.create = function create(properties) {
            return new ContractKeysRequest(properties);
        };

        /**
         * Encodes the specified ContractKeysRequest message. Does not implicitly {@link wavesenterprise.ContractKeysRequest.verify|verify} messages.
         * @function encode
         * @memberof wavesenterprise.ContractKeysRequest
         * @static
         * @param {wavesenterprise.IContractKeysRequest} message ContractKeysRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ContractKeysRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.contractId != null && Object.hasOwnProperty.call(message, "contractId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.contractId);
            if (message.limit != null && Object.hasOwnProperty.call(message, "limit"))
                $root.google.protobuf.Int32Value.encode(message.limit, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.offset != null && Object.hasOwnProperty.call(message, "offset"))
                $root.google.protobuf.Int32Value.encode(message.offset, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.matches != null && Object.hasOwnProperty.call(message, "matches"))
                $root.google.protobuf.StringValue.encode(message.matches, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.keysFilter != null && Object.hasOwnProperty.call(message, "keysFilter"))
                $root.wavesenterprise.KeysFilter.encode(message.keysFilter, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ContractKeysRequest message, length delimited. Does not implicitly {@link wavesenterprise.ContractKeysRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof wavesenterprise.ContractKeysRequest
         * @static
         * @param {wavesenterprise.IContractKeysRequest} message ContractKeysRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ContractKeysRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ContractKeysRequest message from the specified reader or buffer.
         * @function decode
         * @memberof wavesenterprise.ContractKeysRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {wavesenterprise.ContractKeysRequest} ContractKeysRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ContractKeysRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.wavesenterprise.ContractKeysRequest();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.contractId = reader.string();
                    break;
                case 2:
                    message.limit = $root.google.protobuf.Int32Value.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.offset = $root.google.protobuf.Int32Value.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.matches = $root.google.protobuf.StringValue.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.keysFilter = $root.wavesenterprise.KeysFilter.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ContractKeysRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof wavesenterprise.ContractKeysRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {wavesenterprise.ContractKeysRequest} ContractKeysRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ContractKeysRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ContractKeysRequest message.
         * @function verify
         * @memberof wavesenterprise.ContractKeysRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ContractKeysRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.contractId != null && message.hasOwnProperty("contractId"))
                if (!$util.isString(message.contractId))
                    return "contractId: string expected";
            if (message.limit != null && message.hasOwnProperty("limit")) {
                var error = $root.google.protobuf.Int32Value.verify(message.limit);
                if (error)
                    return "limit." + error;
            }
            if (message.offset != null && message.hasOwnProperty("offset")) {
                var error = $root.google.protobuf.Int32Value.verify(message.offset);
                if (error)
                    return "offset." + error;
            }
            if (message.matches != null && message.hasOwnProperty("matches")) {
                var error = $root.google.protobuf.StringValue.verify(message.matches);
                if (error)
                    return "matches." + error;
            }
            if (message.keysFilter != null && message.hasOwnProperty("keysFilter")) {
                var error = $root.wavesenterprise.KeysFilter.verify(message.keysFilter);
                if (error)
                    return "keysFilter." + error;
            }
            return null;
        };

        /**
         * Creates a ContractKeysRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof wavesenterprise.ContractKeysRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {wavesenterprise.ContractKeysRequest} ContractKeysRequest
         */
        ContractKeysRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.wavesenterprise.ContractKeysRequest)
                return object;
            var message = new $root.wavesenterprise.ContractKeysRequest();
            if (object.contractId != null)
                message.contractId = String(object.contractId);
            if (object.limit != null) {
                if (typeof object.limit !== "object")
                    throw TypeError(".wavesenterprise.ContractKeysRequest.limit: object expected");
                message.limit = $root.google.protobuf.Int32Value.fromObject(object.limit);
            }
            if (object.offset != null) {
                if (typeof object.offset !== "object")
                    throw TypeError(".wavesenterprise.ContractKeysRequest.offset: object expected");
                message.offset = $root.google.protobuf.Int32Value.fromObject(object.offset);
            }
            if (object.matches != null) {
                if (typeof object.matches !== "object")
                    throw TypeError(".wavesenterprise.ContractKeysRequest.matches: object expected");
                message.matches = $root.google.protobuf.StringValue.fromObject(object.matches);
            }
            if (object.keysFilter != null) {
                if (typeof object.keysFilter !== "object")
                    throw TypeError(".wavesenterprise.ContractKeysRequest.keysFilter: object expected");
                message.keysFilter = $root.wavesenterprise.KeysFilter.fromObject(object.keysFilter);
            }
            return message;
        };

        /**
         * Creates a plain object from a ContractKeysRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof wavesenterprise.ContractKeysRequest
         * @static
         * @param {wavesenterprise.ContractKeysRequest} message ContractKeysRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ContractKeysRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.contractId = "";
                object.limit = null;
                object.offset = null;
                object.matches = null;
                object.keysFilter = null;
            }
            if (message.contractId != null && message.hasOwnProperty("contractId"))
                object.contractId = message.contractId;
            if (message.limit != null && message.hasOwnProperty("limit"))
                object.limit = $root.google.protobuf.Int32Value.toObject(message.limit, options);
            if (message.offset != null && message.hasOwnProperty("offset"))
                object.offset = $root.google.protobuf.Int32Value.toObject(message.offset, options);
            if (message.matches != null && message.hasOwnProperty("matches"))
                object.matches = $root.google.protobuf.StringValue.toObject(message.matches, options);
            if (message.keysFilter != null && message.hasOwnProperty("keysFilter"))
                object.keysFilter = $root.wavesenterprise.KeysFilter.toObject(message.keysFilter, options);
            return object;
        };

        /**
         * Converts this ContractKeysRequest to JSON.
         * @function toJSON
         * @memberof wavesenterprise.ContractKeysRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ContractKeysRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ContractKeysRequest;
    })();

    wavesenterprise.KeysFilter = (function() {

        /**
         * Properties of a KeysFilter.
         * @memberof wavesenterprise
         * @interface IKeysFilter
         * @property {Array.<string>|null} [keys] KeysFilter keys
         */

        /**
         * Constructs a new KeysFilter.
         * @memberof wavesenterprise
         * @classdesc Represents a KeysFilter.
         * @implements IKeysFilter
         * @constructor
         * @param {wavesenterprise.IKeysFilter=} [properties] Properties to set
         */
        function KeysFilter(properties) {
            this.keys = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * KeysFilter keys.
         * @member {Array.<string>} keys
         * @memberof wavesenterprise.KeysFilter
         * @instance
         */
        KeysFilter.prototype.keys = $util.emptyArray;

        /**
         * Creates a new KeysFilter instance using the specified properties.
         * @function create
         * @memberof wavesenterprise.KeysFilter
         * @static
         * @param {wavesenterprise.IKeysFilter=} [properties] Properties to set
         * @returns {wavesenterprise.KeysFilter} KeysFilter instance
         */
        KeysFilter.create = function create(properties) {
            return new KeysFilter(properties);
        };

        /**
         * Encodes the specified KeysFilter message. Does not implicitly {@link wavesenterprise.KeysFilter.verify|verify} messages.
         * @function encode
         * @memberof wavesenterprise.KeysFilter
         * @static
         * @param {wavesenterprise.IKeysFilter} message KeysFilter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        KeysFilter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.keys != null && message.keys.length)
                for (var i = 0; i < message.keys.length; ++i)
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.keys[i]);
            return writer;
        };

        /**
         * Encodes the specified KeysFilter message, length delimited. Does not implicitly {@link wavesenterprise.KeysFilter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof wavesenterprise.KeysFilter
         * @static
         * @param {wavesenterprise.IKeysFilter} message KeysFilter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        KeysFilter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a KeysFilter message from the specified reader or buffer.
         * @function decode
         * @memberof wavesenterprise.KeysFilter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {wavesenterprise.KeysFilter} KeysFilter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        KeysFilter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.wavesenterprise.KeysFilter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.keys && message.keys.length))
                        message.keys = [];
                    message.keys.push(reader.string());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a KeysFilter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof wavesenterprise.KeysFilter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {wavesenterprise.KeysFilter} KeysFilter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        KeysFilter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a KeysFilter message.
         * @function verify
         * @memberof wavesenterprise.KeysFilter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        KeysFilter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.keys != null && message.hasOwnProperty("keys")) {
                if (!Array.isArray(message.keys))
                    return "keys: array expected";
                for (var i = 0; i < message.keys.length; ++i)
                    if (!$util.isString(message.keys[i]))
                        return "keys: string[] expected";
            }
            return null;
        };

        /**
         * Creates a KeysFilter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof wavesenterprise.KeysFilter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {wavesenterprise.KeysFilter} KeysFilter
         */
        KeysFilter.fromObject = function fromObject(object) {
            if (object instanceof $root.wavesenterprise.KeysFilter)
                return object;
            var message = new $root.wavesenterprise.KeysFilter();
            if (object.keys) {
                if (!Array.isArray(object.keys))
                    throw TypeError(".wavesenterprise.KeysFilter.keys: array expected");
                message.keys = [];
                for (var i = 0; i < object.keys.length; ++i)
                    message.keys[i] = String(object.keys[i]);
            }
            return message;
        };

        /**
         * Creates a plain object from a KeysFilter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof wavesenterprise.KeysFilter
         * @static
         * @param {wavesenterprise.KeysFilter} message KeysFilter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        KeysFilter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.keys = [];
            if (message.keys && message.keys.length) {
                object.keys = [];
                for (var j = 0; j < message.keys.length; ++j)
                    object.keys[j] = message.keys[j];
            }
            return object;
        };

        /**
         * Converts this KeysFilter to JSON.
         * @function toJSON
         * @memberof wavesenterprise.KeysFilter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        KeysFilter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return KeysFilter;
    })();

    wavesenterprise.ContractKeysResponse = (function() {

        /**
         * Properties of a ContractKeysResponse.
         * @memberof wavesenterprise
         * @interface IContractKeysResponse
         * @property {Array.<wavesenterprise.IDataEntry>|null} [entries] ContractKeysResponse entries
         */

        /**
         * Constructs a new ContractKeysResponse.
         * @memberof wavesenterprise
         * @classdesc Represents a ContractKeysResponse.
         * @implements IContractKeysResponse
         * @constructor
         * @param {wavesenterprise.IContractKeysResponse=} [properties] Properties to set
         */
        function ContractKeysResponse(properties) {
            this.entries = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ContractKeysResponse entries.
         * @member {Array.<wavesenterprise.IDataEntry>} entries
         * @memberof wavesenterprise.ContractKeysResponse
         * @instance
         */
        ContractKeysResponse.prototype.entries = $util.emptyArray;

        /**
         * Creates a new ContractKeysResponse instance using the specified properties.
         * @function create
         * @memberof wavesenterprise.ContractKeysResponse
         * @static
         * @param {wavesenterprise.IContractKeysResponse=} [properties] Properties to set
         * @returns {wavesenterprise.ContractKeysResponse} ContractKeysResponse instance
         */
        ContractKeysResponse.create = function create(properties) {
            return new ContractKeysResponse(properties);
        };

        /**
         * Encodes the specified ContractKeysResponse message. Does not implicitly {@link wavesenterprise.ContractKeysResponse.verify|verify} messages.
         * @function encode
         * @memberof wavesenterprise.ContractKeysResponse
         * @static
         * @param {wavesenterprise.IContractKeysResponse} message ContractKeysResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ContractKeysResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.entries != null && message.entries.length)
                for (var i = 0; i < message.entries.length; ++i)
                    $root.wavesenterprise.DataEntry.encode(message.entries[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ContractKeysResponse message, length delimited. Does not implicitly {@link wavesenterprise.ContractKeysResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof wavesenterprise.ContractKeysResponse
         * @static
         * @param {wavesenterprise.IContractKeysResponse} message ContractKeysResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ContractKeysResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ContractKeysResponse message from the specified reader or buffer.
         * @function decode
         * @memberof wavesenterprise.ContractKeysResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {wavesenterprise.ContractKeysResponse} ContractKeysResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ContractKeysResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.wavesenterprise.ContractKeysResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.entries && message.entries.length))
                        message.entries = [];
                    message.entries.push($root.wavesenterprise.DataEntry.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ContractKeysResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof wavesenterprise.ContractKeysResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {wavesenterprise.ContractKeysResponse} ContractKeysResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ContractKeysResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ContractKeysResponse message.
         * @function verify
         * @memberof wavesenterprise.ContractKeysResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ContractKeysResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.entries != null && message.hasOwnProperty("entries")) {
                if (!Array.isArray(message.entries))
                    return "entries: array expected";
                for (var i = 0; i < message.entries.length; ++i) {
                    var error = $root.wavesenterprise.DataEntry.verify(message.entries[i]);
                    if (error)
                        return "entries." + error;
                }
            }
            return null;
        };

        /**
         * Creates a ContractKeysResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof wavesenterprise.ContractKeysResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {wavesenterprise.ContractKeysResponse} ContractKeysResponse
         */
        ContractKeysResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.wavesenterprise.ContractKeysResponse)
                return object;
            var message = new $root.wavesenterprise.ContractKeysResponse();
            if (object.entries) {
                if (!Array.isArray(object.entries))
                    throw TypeError(".wavesenterprise.ContractKeysResponse.entries: array expected");
                message.entries = [];
                for (var i = 0; i < object.entries.length; ++i) {
                    if (typeof object.entries[i] !== "object")
                        throw TypeError(".wavesenterprise.ContractKeysResponse.entries: object expected");
                    message.entries[i] = $root.wavesenterprise.DataEntry.fromObject(object.entries[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a ContractKeysResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof wavesenterprise.ContractKeysResponse
         * @static
         * @param {wavesenterprise.ContractKeysResponse} message ContractKeysResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ContractKeysResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.entries = [];
            if (message.entries && message.entries.length) {
                object.entries = [];
                for (var j = 0; j < message.entries.length; ++j)
                    object.entries[j] = $root.wavesenterprise.DataEntry.toObject(message.entries[j], options);
            }
            return object;
        };

        /**
         * Converts this ContractKeysResponse to JSON.
         * @function toJSON
         * @memberof wavesenterprise.ContractKeysResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ContractKeysResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ContractKeysResponse;
    })();

    wavesenterprise.ContractKeyRequest = (function() {

        /**
         * Properties of a ContractKeyRequest.
         * @memberof wavesenterprise
         * @interface IContractKeyRequest
         * @property {string|null} [contractId] ContractKeyRequest contractId
         * @property {string|null} [key] ContractKeyRequest key
         */

        /**
         * Constructs a new ContractKeyRequest.
         * @memberof wavesenterprise
         * @classdesc Represents a ContractKeyRequest.
         * @implements IContractKeyRequest
         * @constructor
         * @param {wavesenterprise.IContractKeyRequest=} [properties] Properties to set
         */
        function ContractKeyRequest(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ContractKeyRequest contractId.
         * @member {string} contractId
         * @memberof wavesenterprise.ContractKeyRequest
         * @instance
         */
        ContractKeyRequest.prototype.contractId = "";

        /**
         * ContractKeyRequest key.
         * @member {string} key
         * @memberof wavesenterprise.ContractKeyRequest
         * @instance
         */
        ContractKeyRequest.prototype.key = "";

        /**
         * Creates a new ContractKeyRequest instance using the specified properties.
         * @function create
         * @memberof wavesenterprise.ContractKeyRequest
         * @static
         * @param {wavesenterprise.IContractKeyRequest=} [properties] Properties to set
         * @returns {wavesenterprise.ContractKeyRequest} ContractKeyRequest instance
         */
        ContractKeyRequest.create = function create(properties) {
            return new ContractKeyRequest(properties);
        };

        /**
         * Encodes the specified ContractKeyRequest message. Does not implicitly {@link wavesenterprise.ContractKeyRequest.verify|verify} messages.
         * @function encode
         * @memberof wavesenterprise.ContractKeyRequest
         * @static
         * @param {wavesenterprise.IContractKeyRequest} message ContractKeyRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ContractKeyRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.contractId != null && Object.hasOwnProperty.call(message, "contractId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.contractId);
            if (message.key != null && Object.hasOwnProperty.call(message, "key"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.key);
            return writer;
        };

        /**
         * Encodes the specified ContractKeyRequest message, length delimited. Does not implicitly {@link wavesenterprise.ContractKeyRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof wavesenterprise.ContractKeyRequest
         * @static
         * @param {wavesenterprise.IContractKeyRequest} message ContractKeyRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ContractKeyRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ContractKeyRequest message from the specified reader or buffer.
         * @function decode
         * @memberof wavesenterprise.ContractKeyRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {wavesenterprise.ContractKeyRequest} ContractKeyRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ContractKeyRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.wavesenterprise.ContractKeyRequest();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.contractId = reader.string();
                    break;
                case 2:
                    message.key = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ContractKeyRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof wavesenterprise.ContractKeyRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {wavesenterprise.ContractKeyRequest} ContractKeyRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ContractKeyRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ContractKeyRequest message.
         * @function verify
         * @memberof wavesenterprise.ContractKeyRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ContractKeyRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.contractId != null && message.hasOwnProperty("contractId"))
                if (!$util.isString(message.contractId))
                    return "contractId: string expected";
            if (message.key != null && message.hasOwnProperty("key"))
                if (!$util.isString(message.key))
                    return "key: string expected";
            return null;
        };

        /**
         * Creates a ContractKeyRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof wavesenterprise.ContractKeyRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {wavesenterprise.ContractKeyRequest} ContractKeyRequest
         */
        ContractKeyRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.wavesenterprise.ContractKeyRequest)
                return object;
            var message = new $root.wavesenterprise.ContractKeyRequest();
            if (object.contractId != null)
                message.contractId = String(object.contractId);
            if (object.key != null)
                message.key = String(object.key);
            return message;
        };

        /**
         * Creates a plain object from a ContractKeyRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof wavesenterprise.ContractKeyRequest
         * @static
         * @param {wavesenterprise.ContractKeyRequest} message ContractKeyRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ContractKeyRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.contractId = "";
                object.key = "";
            }
            if (message.contractId != null && message.hasOwnProperty("contractId"))
                object.contractId = message.contractId;
            if (message.key != null && message.hasOwnProperty("key"))
                object.key = message.key;
            return object;
        };

        /**
         * Converts this ContractKeyRequest to JSON.
         * @function toJSON
         * @memberof wavesenterprise.ContractKeyRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ContractKeyRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ContractKeyRequest;
    })();

    wavesenterprise.ContractKeyResponse = (function() {

        /**
         * Properties of a ContractKeyResponse.
         * @memberof wavesenterprise
         * @interface IContractKeyResponse
         * @property {wavesenterprise.IDataEntry|null} [entry] ContractKeyResponse entry
         */

        /**
         * Constructs a new ContractKeyResponse.
         * @memberof wavesenterprise
         * @classdesc Represents a ContractKeyResponse.
         * @implements IContractKeyResponse
         * @constructor
         * @param {wavesenterprise.IContractKeyResponse=} [properties] Properties to set
         */
        function ContractKeyResponse(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ContractKeyResponse entry.
         * @member {wavesenterprise.IDataEntry|null|undefined} entry
         * @memberof wavesenterprise.ContractKeyResponse
         * @instance
         */
        ContractKeyResponse.prototype.entry = null;

        /**
         * Creates a new ContractKeyResponse instance using the specified properties.
         * @function create
         * @memberof wavesenterprise.ContractKeyResponse
         * @static
         * @param {wavesenterprise.IContractKeyResponse=} [properties] Properties to set
         * @returns {wavesenterprise.ContractKeyResponse} ContractKeyResponse instance
         */
        ContractKeyResponse.create = function create(properties) {
            return new ContractKeyResponse(properties);
        };

        /**
         * Encodes the specified ContractKeyResponse message. Does not implicitly {@link wavesenterprise.ContractKeyResponse.verify|verify} messages.
         * @function encode
         * @memberof wavesenterprise.ContractKeyResponse
         * @static
         * @param {wavesenterprise.IContractKeyResponse} message ContractKeyResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ContractKeyResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.entry != null && Object.hasOwnProperty.call(message, "entry"))
                $root.wavesenterprise.DataEntry.encode(message.entry, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ContractKeyResponse message, length delimited. Does not implicitly {@link wavesenterprise.ContractKeyResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof wavesenterprise.ContractKeyResponse
         * @static
         * @param {wavesenterprise.IContractKeyResponse} message ContractKeyResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ContractKeyResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ContractKeyResponse message from the specified reader or buffer.
         * @function decode
         * @memberof wavesenterprise.ContractKeyResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {wavesenterprise.ContractKeyResponse} ContractKeyResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ContractKeyResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.wavesenterprise.ContractKeyResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.entry = $root.wavesenterprise.DataEntry.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ContractKeyResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof wavesenterprise.ContractKeyResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {wavesenterprise.ContractKeyResponse} ContractKeyResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ContractKeyResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ContractKeyResponse message.
         * @function verify
         * @memberof wavesenterprise.ContractKeyResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ContractKeyResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.entry != null && message.hasOwnProperty("entry")) {
                var error = $root.wavesenterprise.DataEntry.verify(message.entry);
                if (error)
                    return "entry." + error;
            }
            return null;
        };

        /**
         * Creates a ContractKeyResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof wavesenterprise.ContractKeyResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {wavesenterprise.ContractKeyResponse} ContractKeyResponse
         */
        ContractKeyResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.wavesenterprise.ContractKeyResponse)
                return object;
            var message = new $root.wavesenterprise.ContractKeyResponse();
            if (object.entry != null) {
                if (typeof object.entry !== "object")
                    throw TypeError(".wavesenterprise.ContractKeyResponse.entry: object expected");
                message.entry = $root.wavesenterprise.DataEntry.fromObject(object.entry);
            }
            return message;
        };

        /**
         * Creates a plain object from a ContractKeyResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof wavesenterprise.ContractKeyResponse
         * @static
         * @param {wavesenterprise.ContractKeyResponse} message ContractKeyResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ContractKeyResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.entry = null;
            if (message.entry != null && message.hasOwnProperty("entry"))
                object.entry = $root.wavesenterprise.DataEntry.toObject(message.entry, options);
            return object;
        };

        /**
         * Converts this ContractKeyResponse to JSON.
         * @function toJSON
         * @memberof wavesenterprise.ContractKeyResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ContractKeyResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ContractKeyResponse;
    })();

    wavesenterprise.AssetId = (function() {

        /**
         * Properties of an AssetId.
         * @memberof wavesenterprise
         * @interface IAssetId
         * @property {string|null} [value] AssetId value
         */

        /**
         * Constructs a new AssetId.
         * @memberof wavesenterprise
         * @classdesc Represents an AssetId.
         * @implements IAssetId
         * @constructor
         * @param {wavesenterprise.IAssetId=} [properties] Properties to set
         */
        function AssetId(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * AssetId value.
         * @member {string} value
         * @memberof wavesenterprise.AssetId
         * @instance
         */
        AssetId.prototype.value = "";

        /**
         * Creates a new AssetId instance using the specified properties.
         * @function create
         * @memberof wavesenterprise.AssetId
         * @static
         * @param {wavesenterprise.IAssetId=} [properties] Properties to set
         * @returns {wavesenterprise.AssetId} AssetId instance
         */
        AssetId.create = function create(properties) {
            return new AssetId(properties);
        };

        /**
         * Encodes the specified AssetId message. Does not implicitly {@link wavesenterprise.AssetId.verify|verify} messages.
         * @function encode
         * @memberof wavesenterprise.AssetId
         * @static
         * @param {wavesenterprise.IAssetId} message AssetId message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AssetId.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.value);
            return writer;
        };

        /**
         * Encodes the specified AssetId message, length delimited. Does not implicitly {@link wavesenterprise.AssetId.verify|verify} messages.
         * @function encodeDelimited
         * @memberof wavesenterprise.AssetId
         * @static
         * @param {wavesenterprise.IAssetId} message AssetId message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AssetId.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an AssetId message from the specified reader or buffer.
         * @function decode
         * @memberof wavesenterprise.AssetId
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {wavesenterprise.AssetId} AssetId
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AssetId.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.wavesenterprise.AssetId();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.value = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an AssetId message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof wavesenterprise.AssetId
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {wavesenterprise.AssetId} AssetId
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AssetId.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an AssetId message.
         * @function verify
         * @memberof wavesenterprise.AssetId
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        AssetId.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.value != null && message.hasOwnProperty("value"))
                if (!$util.isString(message.value))
                    return "value: string expected";
            return null;
        };

        /**
         * Creates an AssetId message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof wavesenterprise.AssetId
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {wavesenterprise.AssetId} AssetId
         */
        AssetId.fromObject = function fromObject(object) {
            if (object instanceof $root.wavesenterprise.AssetId)
                return object;
            var message = new $root.wavesenterprise.AssetId();
            if (object.value != null)
                message.value = String(object.value);
            return message;
        };

        /**
         * Creates a plain object from an AssetId message. Also converts values to other types if specified.
         * @function toObject
         * @memberof wavesenterprise.AssetId
         * @static
         * @param {wavesenterprise.AssetId} message AssetId
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        AssetId.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.value = "";
            if (message.value != null && message.hasOwnProperty("value"))
                object.value = message.value;
            return object;
        };

        /**
         * Converts this AssetId to JSON.
         * @function toJSON
         * @memberof wavesenterprise.AssetId
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AssetId.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return AssetId;
    })();

    wavesenterprise.DataEntry = (function() {

        /**
         * Properties of a DataEntry.
         * @memberof wavesenterprise
         * @interface IDataEntry
         * @property {string|null} [key] DataEntry key
         * @property {number|Long|null} [intValue] DataEntry intValue
         * @property {boolean|null} [boolValue] DataEntry boolValue
         * @property {Uint8Array|null} [binaryValue] DataEntry binaryValue
         * @property {string|null} [stringValue] DataEntry stringValue
         */

        /**
         * Constructs a new DataEntry.
         * @memberof wavesenterprise
         * @classdesc Represents a DataEntry.
         * @implements IDataEntry
         * @constructor
         * @param {wavesenterprise.IDataEntry=} [properties] Properties to set
         */
        function DataEntry(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DataEntry key.
         * @member {string} key
         * @memberof wavesenterprise.DataEntry
         * @instance
         */
        DataEntry.prototype.key = "";

        /**
         * DataEntry intValue.
         * @member {number|Long} intValue
         * @memberof wavesenterprise.DataEntry
         * @instance
         */
        DataEntry.prototype.intValue = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * DataEntry boolValue.
         * @member {boolean} boolValue
         * @memberof wavesenterprise.DataEntry
         * @instance
         */
        DataEntry.prototype.boolValue = false;

        /**
         * DataEntry binaryValue.
         * @member {Uint8Array} binaryValue
         * @memberof wavesenterprise.DataEntry
         * @instance
         */
        DataEntry.prototype.binaryValue = $util.newBuffer([]);

        /**
         * DataEntry stringValue.
         * @member {string} stringValue
         * @memberof wavesenterprise.DataEntry
         * @instance
         */
        DataEntry.prototype.stringValue = "";

        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;

        /**
         * DataEntry value.
         * @member {"intValue"|"boolValue"|"binaryValue"|"stringValue"|undefined} value
         * @memberof wavesenterprise.DataEntry
         * @instance
         */
        Object.defineProperty(DataEntry.prototype, "value", {
            get: $util.oneOfGetter($oneOfFields = ["intValue", "boolValue", "binaryValue", "stringValue"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new DataEntry instance using the specified properties.
         * @function create
         * @memberof wavesenterprise.DataEntry
         * @static
         * @param {wavesenterprise.IDataEntry=} [properties] Properties to set
         * @returns {wavesenterprise.DataEntry} DataEntry instance
         */
        DataEntry.create = function create(properties) {
            return new DataEntry(properties);
        };

        /**
         * Encodes the specified DataEntry message. Does not implicitly {@link wavesenterprise.DataEntry.verify|verify} messages.
         * @function encode
         * @memberof wavesenterprise.DataEntry
         * @static
         * @param {wavesenterprise.IDataEntry} message DataEntry message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DataEntry.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.key != null && Object.hasOwnProperty.call(message, "key"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.key);
            if (message.intValue != null && Object.hasOwnProperty.call(message, "intValue"))
                writer.uint32(/* id 10, wireType 0 =*/80).int64(message.intValue);
            if (message.boolValue != null && Object.hasOwnProperty.call(message, "boolValue"))
                writer.uint32(/* id 11, wireType 0 =*/88).bool(message.boolValue);
            if (message.binaryValue != null && Object.hasOwnProperty.call(message, "binaryValue"))
                writer.uint32(/* id 12, wireType 2 =*/98).bytes(message.binaryValue);
            if (message.stringValue != null && Object.hasOwnProperty.call(message, "stringValue"))
                writer.uint32(/* id 13, wireType 2 =*/106).string(message.stringValue);
            return writer;
        };

        /**
         * Encodes the specified DataEntry message, length delimited. Does not implicitly {@link wavesenterprise.DataEntry.verify|verify} messages.
         * @function encodeDelimited
         * @memberof wavesenterprise.DataEntry
         * @static
         * @param {wavesenterprise.IDataEntry} message DataEntry message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DataEntry.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DataEntry message from the specified reader or buffer.
         * @function decode
         * @memberof wavesenterprise.DataEntry
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {wavesenterprise.DataEntry} DataEntry
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DataEntry.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.wavesenterprise.DataEntry();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.key = reader.string();
                    break;
                case 10:
                    message.intValue = reader.int64();
                    break;
                case 11:
                    message.boolValue = reader.bool();
                    break;
                case 12:
                    message.binaryValue = reader.bytes();
                    break;
                case 13:
                    message.stringValue = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a DataEntry message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof wavesenterprise.DataEntry
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {wavesenterprise.DataEntry} DataEntry
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DataEntry.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DataEntry message.
         * @function verify
         * @memberof wavesenterprise.DataEntry
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DataEntry.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.key != null && message.hasOwnProperty("key"))
                if (!$util.isString(message.key))
                    return "key: string expected";
            if (message.intValue != null && message.hasOwnProperty("intValue")) {
                properties.value = 1;
                if (!$util.isInteger(message.intValue) && !(message.intValue && $util.isInteger(message.intValue.low) && $util.isInteger(message.intValue.high)))
                    return "intValue: integer|Long expected";
            }
            if (message.boolValue != null && message.hasOwnProperty("boolValue")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                if (typeof message.boolValue !== "boolean")
                    return "boolValue: boolean expected";
            }
            if (message.binaryValue != null && message.hasOwnProperty("binaryValue")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                if (!(message.binaryValue && typeof message.binaryValue.length === "number" || $util.isString(message.binaryValue)))
                    return "binaryValue: buffer expected";
            }
            if (message.stringValue != null && message.hasOwnProperty("stringValue")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                if (!$util.isString(message.stringValue))
                    return "stringValue: string expected";
            }
            return null;
        };

        /**
         * Creates a DataEntry message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof wavesenterprise.DataEntry
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {wavesenterprise.DataEntry} DataEntry
         */
        DataEntry.fromObject = function fromObject(object) {
            if (object instanceof $root.wavesenterprise.DataEntry)
                return object;
            var message = new $root.wavesenterprise.DataEntry();
            if (object.key != null)
                message.key = String(object.key);
            if (object.intValue != null)
                if ($util.Long)
                    (message.intValue = $util.Long.fromValue(object.intValue)).unsigned = false;
                else if (typeof object.intValue === "string")
                    message.intValue = parseInt(object.intValue, 10);
                else if (typeof object.intValue === "number")
                    message.intValue = object.intValue;
                else if (typeof object.intValue === "object")
                    message.intValue = new $util.LongBits(object.intValue.low >>> 0, object.intValue.high >>> 0).toNumber();
            if (object.boolValue != null)
                message.boolValue = Boolean(object.boolValue);
            if (object.binaryValue != null)
                if (typeof object.binaryValue === "string")
                    $util.base64.decode(object.binaryValue, message.binaryValue = $util.newBuffer($util.base64.length(object.binaryValue)), 0);
                else if (object.binaryValue.length)
                    message.binaryValue = object.binaryValue;
            if (object.stringValue != null)
                message.stringValue = String(object.stringValue);
            return message;
        };

        /**
         * Creates a plain object from a DataEntry message. Also converts values to other types if specified.
         * @function toObject
         * @memberof wavesenterprise.DataEntry
         * @static
         * @param {wavesenterprise.DataEntry} message DataEntry
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DataEntry.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.key = "";
            if (message.key != null && message.hasOwnProperty("key"))
                object.key = message.key;
            if (message.intValue != null && message.hasOwnProperty("intValue")) {
                if (typeof message.intValue === "number")
                    object.intValue = options.longs === String ? String(message.intValue) : message.intValue;
                else
                    object.intValue = options.longs === String ? $util.Long.prototype.toString.call(message.intValue) : options.longs === Number ? new $util.LongBits(message.intValue.low >>> 0, message.intValue.high >>> 0).toNumber() : message.intValue;
                if (options.oneofs)
                    object.value = "intValue";
            }
            if (message.boolValue != null && message.hasOwnProperty("boolValue")) {
                object.boolValue = message.boolValue;
                if (options.oneofs)
                    object.value = "boolValue";
            }
            if (message.binaryValue != null && message.hasOwnProperty("binaryValue")) {
                object.binaryValue = options.bytes === String ? $util.base64.encode(message.binaryValue, 0, message.binaryValue.length) : options.bytes === Array ? Array.prototype.slice.call(message.binaryValue) : message.binaryValue;
                if (options.oneofs)
                    object.value = "binaryValue";
            }
            if (message.stringValue != null && message.hasOwnProperty("stringValue")) {
                object.stringValue = message.stringValue;
                if (options.oneofs)
                    object.value = "stringValue";
            }
            return object;
        };

        /**
         * Converts this DataEntry to JSON.
         * @function toJSON
         * @memberof wavesenterprise.DataEntry
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DataEntry.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return DataEntry;
    })();

    return wavesenterprise;
})();

$root.google = (function() {

    /**
     * Namespace google.
     * @exports google
     * @namespace
     */
    var google = {};

    google.protobuf = (function() {

        /**
         * Namespace protobuf.
         * @memberof google
         * @namespace
         */
        var protobuf = {};

        protobuf.DoubleValue = (function() {

            /**
             * Properties of a DoubleValue.
             * @memberof google.protobuf
             * @interface IDoubleValue
             * @property {number|null} [value] DoubleValue value
             */

            /**
             * Constructs a new DoubleValue.
             * @memberof google.protobuf
             * @classdesc Represents a DoubleValue.
             * @implements IDoubleValue
             * @constructor
             * @param {google.protobuf.IDoubleValue=} [properties] Properties to set
             */
            function DoubleValue(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * DoubleValue value.
             * @member {number} value
             * @memberof google.protobuf.DoubleValue
             * @instance
             */
            DoubleValue.prototype.value = 0;

            /**
             * Creates a new DoubleValue instance using the specified properties.
             * @function create
             * @memberof google.protobuf.DoubleValue
             * @static
             * @param {google.protobuf.IDoubleValue=} [properties] Properties to set
             * @returns {google.protobuf.DoubleValue} DoubleValue instance
             */
            DoubleValue.create = function create(properties) {
                return new DoubleValue(properties);
            };

            /**
             * Encodes the specified DoubleValue message. Does not implicitly {@link google.protobuf.DoubleValue.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.DoubleValue
             * @static
             * @param {google.protobuf.IDoubleValue} message DoubleValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DoubleValue.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                    writer.uint32(/* id 1, wireType 1 =*/9).double(message.value);
                return writer;
            };

            /**
             * Encodes the specified DoubleValue message, length delimited. Does not implicitly {@link google.protobuf.DoubleValue.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.DoubleValue
             * @static
             * @param {google.protobuf.IDoubleValue} message DoubleValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DoubleValue.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a DoubleValue message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.DoubleValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.DoubleValue} DoubleValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DoubleValue.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.DoubleValue();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.value = reader.double();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a DoubleValue message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.DoubleValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.DoubleValue} DoubleValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DoubleValue.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a DoubleValue message.
             * @function verify
             * @memberof google.protobuf.DoubleValue
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            DoubleValue.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (typeof message.value !== "number")
                        return "value: number expected";
                return null;
            };

            /**
             * Creates a DoubleValue message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.DoubleValue
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.DoubleValue} DoubleValue
             */
            DoubleValue.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.DoubleValue)
                    return object;
                var message = new $root.google.protobuf.DoubleValue();
                if (object.value != null)
                    message.value = Number(object.value);
                return message;
            };

            /**
             * Creates a plain object from a DoubleValue message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.DoubleValue
             * @static
             * @param {google.protobuf.DoubleValue} message DoubleValue
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DoubleValue.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.value = 0;
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = options.json && !isFinite(message.value) ? String(message.value) : message.value;
                return object;
            };

            /**
             * Converts this DoubleValue to JSON.
             * @function toJSON
             * @memberof google.protobuf.DoubleValue
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DoubleValue.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return DoubleValue;
        })();

        protobuf.FloatValue = (function() {

            /**
             * Properties of a FloatValue.
             * @memberof google.protobuf
             * @interface IFloatValue
             * @property {number|null} [value] FloatValue value
             */

            /**
             * Constructs a new FloatValue.
             * @memberof google.protobuf
             * @classdesc Represents a FloatValue.
             * @implements IFloatValue
             * @constructor
             * @param {google.protobuf.IFloatValue=} [properties] Properties to set
             */
            function FloatValue(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * FloatValue value.
             * @member {number} value
             * @memberof google.protobuf.FloatValue
             * @instance
             */
            FloatValue.prototype.value = 0;

            /**
             * Creates a new FloatValue instance using the specified properties.
             * @function create
             * @memberof google.protobuf.FloatValue
             * @static
             * @param {google.protobuf.IFloatValue=} [properties] Properties to set
             * @returns {google.protobuf.FloatValue} FloatValue instance
             */
            FloatValue.create = function create(properties) {
                return new FloatValue(properties);
            };

            /**
             * Encodes the specified FloatValue message. Does not implicitly {@link google.protobuf.FloatValue.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.FloatValue
             * @static
             * @param {google.protobuf.IFloatValue} message FloatValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            FloatValue.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                    writer.uint32(/* id 1, wireType 5 =*/13).float(message.value);
                return writer;
            };

            /**
             * Encodes the specified FloatValue message, length delimited. Does not implicitly {@link google.protobuf.FloatValue.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.FloatValue
             * @static
             * @param {google.protobuf.IFloatValue} message FloatValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            FloatValue.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a FloatValue message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.FloatValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.FloatValue} FloatValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            FloatValue.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.FloatValue();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.value = reader.float();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a FloatValue message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.FloatValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.FloatValue} FloatValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            FloatValue.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a FloatValue message.
             * @function verify
             * @memberof google.protobuf.FloatValue
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            FloatValue.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (typeof message.value !== "number")
                        return "value: number expected";
                return null;
            };

            /**
             * Creates a FloatValue message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.FloatValue
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.FloatValue} FloatValue
             */
            FloatValue.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.FloatValue)
                    return object;
                var message = new $root.google.protobuf.FloatValue();
                if (object.value != null)
                    message.value = Number(object.value);
                return message;
            };

            /**
             * Creates a plain object from a FloatValue message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.FloatValue
             * @static
             * @param {google.protobuf.FloatValue} message FloatValue
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            FloatValue.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.value = 0;
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = options.json && !isFinite(message.value) ? String(message.value) : message.value;
                return object;
            };

            /**
             * Converts this FloatValue to JSON.
             * @function toJSON
             * @memberof google.protobuf.FloatValue
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            FloatValue.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return FloatValue;
        })();

        protobuf.Int64Value = (function() {

            /**
             * Properties of an Int64Value.
             * @memberof google.protobuf
             * @interface IInt64Value
             * @property {number|Long|null} [value] Int64Value value
             */

            /**
             * Constructs a new Int64Value.
             * @memberof google.protobuf
             * @classdesc Represents an Int64Value.
             * @implements IInt64Value
             * @constructor
             * @param {google.protobuf.IInt64Value=} [properties] Properties to set
             */
            function Int64Value(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Int64Value value.
             * @member {number|Long} value
             * @memberof google.protobuf.Int64Value
             * @instance
             */
            Int64Value.prototype.value = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * Creates a new Int64Value instance using the specified properties.
             * @function create
             * @memberof google.protobuf.Int64Value
             * @static
             * @param {google.protobuf.IInt64Value=} [properties] Properties to set
             * @returns {google.protobuf.Int64Value} Int64Value instance
             */
            Int64Value.create = function create(properties) {
                return new Int64Value(properties);
            };

            /**
             * Encodes the specified Int64Value message. Does not implicitly {@link google.protobuf.Int64Value.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.Int64Value
             * @static
             * @param {google.protobuf.IInt64Value} message Int64Value message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Int64Value.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int64(message.value);
                return writer;
            };

            /**
             * Encodes the specified Int64Value message, length delimited. Does not implicitly {@link google.protobuf.Int64Value.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.Int64Value
             * @static
             * @param {google.protobuf.IInt64Value} message Int64Value message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Int64Value.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an Int64Value message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.Int64Value
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.Int64Value} Int64Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Int64Value.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Int64Value();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.value = reader.int64();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an Int64Value message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.Int64Value
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.Int64Value} Int64Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Int64Value.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Int64Value message.
             * @function verify
             * @memberof google.protobuf.Int64Value
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Int64Value.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (!$util.isInteger(message.value) && !(message.value && $util.isInteger(message.value.low) && $util.isInteger(message.value.high)))
                        return "value: integer|Long expected";
                return null;
            };

            /**
             * Creates an Int64Value message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.Int64Value
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Int64Value} Int64Value
             */
            Int64Value.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.Int64Value)
                    return object;
                var message = new $root.google.protobuf.Int64Value();
                if (object.value != null)
                    if ($util.Long)
                        (message.value = $util.Long.fromValue(object.value)).unsigned = false;
                    else if (typeof object.value === "string")
                        message.value = parseInt(object.value, 10);
                    else if (typeof object.value === "number")
                        message.value = object.value;
                    else if (typeof object.value === "object")
                        message.value = new $util.LongBits(object.value.low >>> 0, object.value.high >>> 0).toNumber();
                return message;
            };

            /**
             * Creates a plain object from an Int64Value message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.Int64Value
             * @static
             * @param {google.protobuf.Int64Value} message Int64Value
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Int64Value.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, false);
                        object.value = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.value = options.longs === String ? "0" : 0;
                if (message.value != null && message.hasOwnProperty("value"))
                    if (typeof message.value === "number")
                        object.value = options.longs === String ? String(message.value) : message.value;
                    else
                        object.value = options.longs === String ? $util.Long.prototype.toString.call(message.value) : options.longs === Number ? new $util.LongBits(message.value.low >>> 0, message.value.high >>> 0).toNumber() : message.value;
                return object;
            };

            /**
             * Converts this Int64Value to JSON.
             * @function toJSON
             * @memberof google.protobuf.Int64Value
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Int64Value.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Int64Value;
        })();

        protobuf.UInt64Value = (function() {

            /**
             * Properties of a UInt64Value.
             * @memberof google.protobuf
             * @interface IUInt64Value
             * @property {number|Long|null} [value] UInt64Value value
             */

            /**
             * Constructs a new UInt64Value.
             * @memberof google.protobuf
             * @classdesc Represents a UInt64Value.
             * @implements IUInt64Value
             * @constructor
             * @param {google.protobuf.IUInt64Value=} [properties] Properties to set
             */
            function UInt64Value(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * UInt64Value value.
             * @member {number|Long} value
             * @memberof google.protobuf.UInt64Value
             * @instance
             */
            UInt64Value.prototype.value = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Creates a new UInt64Value instance using the specified properties.
             * @function create
             * @memberof google.protobuf.UInt64Value
             * @static
             * @param {google.protobuf.IUInt64Value=} [properties] Properties to set
             * @returns {google.protobuf.UInt64Value} UInt64Value instance
             */
            UInt64Value.create = function create(properties) {
                return new UInt64Value(properties);
            };

            /**
             * Encodes the specified UInt64Value message. Does not implicitly {@link google.protobuf.UInt64Value.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.UInt64Value
             * @static
             * @param {google.protobuf.IUInt64Value} message UInt64Value message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UInt64Value.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.value);
                return writer;
            };

            /**
             * Encodes the specified UInt64Value message, length delimited. Does not implicitly {@link google.protobuf.UInt64Value.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.UInt64Value
             * @static
             * @param {google.protobuf.IUInt64Value} message UInt64Value message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UInt64Value.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a UInt64Value message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.UInt64Value
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.UInt64Value} UInt64Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UInt64Value.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.UInt64Value();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.value = reader.uint64();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a UInt64Value message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.UInt64Value
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.UInt64Value} UInt64Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UInt64Value.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a UInt64Value message.
             * @function verify
             * @memberof google.protobuf.UInt64Value
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            UInt64Value.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (!$util.isInteger(message.value) && !(message.value && $util.isInteger(message.value.low) && $util.isInteger(message.value.high)))
                        return "value: integer|Long expected";
                return null;
            };

            /**
             * Creates a UInt64Value message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.UInt64Value
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.UInt64Value} UInt64Value
             */
            UInt64Value.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.UInt64Value)
                    return object;
                var message = new $root.google.protobuf.UInt64Value();
                if (object.value != null)
                    if ($util.Long)
                        (message.value = $util.Long.fromValue(object.value)).unsigned = true;
                    else if (typeof object.value === "string")
                        message.value = parseInt(object.value, 10);
                    else if (typeof object.value === "number")
                        message.value = object.value;
                    else if (typeof object.value === "object")
                        message.value = new $util.LongBits(object.value.low >>> 0, object.value.high >>> 0).toNumber(true);
                return message;
            };

            /**
             * Creates a plain object from a UInt64Value message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.UInt64Value
             * @static
             * @param {google.protobuf.UInt64Value} message UInt64Value
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            UInt64Value.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.value = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.value = options.longs === String ? "0" : 0;
                if (message.value != null && message.hasOwnProperty("value"))
                    if (typeof message.value === "number")
                        object.value = options.longs === String ? String(message.value) : message.value;
                    else
                        object.value = options.longs === String ? $util.Long.prototype.toString.call(message.value) : options.longs === Number ? new $util.LongBits(message.value.low >>> 0, message.value.high >>> 0).toNumber(true) : message.value;
                return object;
            };

            /**
             * Converts this UInt64Value to JSON.
             * @function toJSON
             * @memberof google.protobuf.UInt64Value
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            UInt64Value.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return UInt64Value;
        })();

        protobuf.Int32Value = (function() {

            /**
             * Properties of an Int32Value.
             * @memberof google.protobuf
             * @interface IInt32Value
             * @property {number|null} [value] Int32Value value
             */

            /**
             * Constructs a new Int32Value.
             * @memberof google.protobuf
             * @classdesc Represents an Int32Value.
             * @implements IInt32Value
             * @constructor
             * @param {google.protobuf.IInt32Value=} [properties] Properties to set
             */
            function Int32Value(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Int32Value value.
             * @member {number} value
             * @memberof google.protobuf.Int32Value
             * @instance
             */
            Int32Value.prototype.value = 0;

            /**
             * Creates a new Int32Value instance using the specified properties.
             * @function create
             * @memberof google.protobuf.Int32Value
             * @static
             * @param {google.protobuf.IInt32Value=} [properties] Properties to set
             * @returns {google.protobuf.Int32Value} Int32Value instance
             */
            Int32Value.create = function create(properties) {
                return new Int32Value(properties);
            };

            /**
             * Encodes the specified Int32Value message. Does not implicitly {@link google.protobuf.Int32Value.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.Int32Value
             * @static
             * @param {google.protobuf.IInt32Value} message Int32Value message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Int32Value.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.value);
                return writer;
            };

            /**
             * Encodes the specified Int32Value message, length delimited. Does not implicitly {@link google.protobuf.Int32Value.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.Int32Value
             * @static
             * @param {google.protobuf.IInt32Value} message Int32Value message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Int32Value.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an Int32Value message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.Int32Value
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.Int32Value} Int32Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Int32Value.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Int32Value();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.value = reader.int32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an Int32Value message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.Int32Value
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.Int32Value} Int32Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Int32Value.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Int32Value message.
             * @function verify
             * @memberof google.protobuf.Int32Value
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Int32Value.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (!$util.isInteger(message.value))
                        return "value: integer expected";
                return null;
            };

            /**
             * Creates an Int32Value message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.Int32Value
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Int32Value} Int32Value
             */
            Int32Value.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.Int32Value)
                    return object;
                var message = new $root.google.protobuf.Int32Value();
                if (object.value != null)
                    message.value = object.value | 0;
                return message;
            };

            /**
             * Creates a plain object from an Int32Value message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.Int32Value
             * @static
             * @param {google.protobuf.Int32Value} message Int32Value
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Int32Value.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.value = 0;
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = message.value;
                return object;
            };

            /**
             * Converts this Int32Value to JSON.
             * @function toJSON
             * @memberof google.protobuf.Int32Value
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Int32Value.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Int32Value;
        })();

        protobuf.UInt32Value = (function() {

            /**
             * Properties of a UInt32Value.
             * @memberof google.protobuf
             * @interface IUInt32Value
             * @property {number|null} [value] UInt32Value value
             */

            /**
             * Constructs a new UInt32Value.
             * @memberof google.protobuf
             * @classdesc Represents a UInt32Value.
             * @implements IUInt32Value
             * @constructor
             * @param {google.protobuf.IUInt32Value=} [properties] Properties to set
             */
            function UInt32Value(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * UInt32Value value.
             * @member {number} value
             * @memberof google.protobuf.UInt32Value
             * @instance
             */
            UInt32Value.prototype.value = 0;

            /**
             * Creates a new UInt32Value instance using the specified properties.
             * @function create
             * @memberof google.protobuf.UInt32Value
             * @static
             * @param {google.protobuf.IUInt32Value=} [properties] Properties to set
             * @returns {google.protobuf.UInt32Value} UInt32Value instance
             */
            UInt32Value.create = function create(properties) {
                return new UInt32Value(properties);
            };

            /**
             * Encodes the specified UInt32Value message. Does not implicitly {@link google.protobuf.UInt32Value.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.UInt32Value
             * @static
             * @param {google.protobuf.IUInt32Value} message UInt32Value message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UInt32Value.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.value);
                return writer;
            };

            /**
             * Encodes the specified UInt32Value message, length delimited. Does not implicitly {@link google.protobuf.UInt32Value.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.UInt32Value
             * @static
             * @param {google.protobuf.IUInt32Value} message UInt32Value message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UInt32Value.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a UInt32Value message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.UInt32Value
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.UInt32Value} UInt32Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UInt32Value.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.UInt32Value();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.value = reader.uint32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a UInt32Value message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.UInt32Value
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.UInt32Value} UInt32Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UInt32Value.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a UInt32Value message.
             * @function verify
             * @memberof google.protobuf.UInt32Value
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            UInt32Value.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (!$util.isInteger(message.value))
                        return "value: integer expected";
                return null;
            };

            /**
             * Creates a UInt32Value message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.UInt32Value
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.UInt32Value} UInt32Value
             */
            UInt32Value.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.UInt32Value)
                    return object;
                var message = new $root.google.protobuf.UInt32Value();
                if (object.value != null)
                    message.value = object.value >>> 0;
                return message;
            };

            /**
             * Creates a plain object from a UInt32Value message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.UInt32Value
             * @static
             * @param {google.protobuf.UInt32Value} message UInt32Value
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            UInt32Value.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.value = 0;
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = message.value;
                return object;
            };

            /**
             * Converts this UInt32Value to JSON.
             * @function toJSON
             * @memberof google.protobuf.UInt32Value
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            UInt32Value.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return UInt32Value;
        })();

        protobuf.BoolValue = (function() {

            /**
             * Properties of a BoolValue.
             * @memberof google.protobuf
             * @interface IBoolValue
             * @property {boolean|null} [value] BoolValue value
             */

            /**
             * Constructs a new BoolValue.
             * @memberof google.protobuf
             * @classdesc Represents a BoolValue.
             * @implements IBoolValue
             * @constructor
             * @param {google.protobuf.IBoolValue=} [properties] Properties to set
             */
            function BoolValue(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * BoolValue value.
             * @member {boolean} value
             * @memberof google.protobuf.BoolValue
             * @instance
             */
            BoolValue.prototype.value = false;

            /**
             * Creates a new BoolValue instance using the specified properties.
             * @function create
             * @memberof google.protobuf.BoolValue
             * @static
             * @param {google.protobuf.IBoolValue=} [properties] Properties to set
             * @returns {google.protobuf.BoolValue} BoolValue instance
             */
            BoolValue.create = function create(properties) {
                return new BoolValue(properties);
            };

            /**
             * Encodes the specified BoolValue message. Does not implicitly {@link google.protobuf.BoolValue.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.BoolValue
             * @static
             * @param {google.protobuf.IBoolValue} message BoolValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            BoolValue.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.value);
                return writer;
            };

            /**
             * Encodes the specified BoolValue message, length delimited. Does not implicitly {@link google.protobuf.BoolValue.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.BoolValue
             * @static
             * @param {google.protobuf.IBoolValue} message BoolValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            BoolValue.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a BoolValue message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.BoolValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.BoolValue} BoolValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BoolValue.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.BoolValue();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.value = reader.bool();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a BoolValue message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.BoolValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.BoolValue} BoolValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BoolValue.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a BoolValue message.
             * @function verify
             * @memberof google.protobuf.BoolValue
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            BoolValue.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (typeof message.value !== "boolean")
                        return "value: boolean expected";
                return null;
            };

            /**
             * Creates a BoolValue message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.BoolValue
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.BoolValue} BoolValue
             */
            BoolValue.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.BoolValue)
                    return object;
                var message = new $root.google.protobuf.BoolValue();
                if (object.value != null)
                    message.value = Boolean(object.value);
                return message;
            };

            /**
             * Creates a plain object from a BoolValue message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.BoolValue
             * @static
             * @param {google.protobuf.BoolValue} message BoolValue
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            BoolValue.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.value = false;
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = message.value;
                return object;
            };

            /**
             * Converts this BoolValue to JSON.
             * @function toJSON
             * @memberof google.protobuf.BoolValue
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            BoolValue.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return BoolValue;
        })();

        protobuf.StringValue = (function() {

            /**
             * Properties of a StringValue.
             * @memberof google.protobuf
             * @interface IStringValue
             * @property {string|null} [value] StringValue value
             */

            /**
             * Constructs a new StringValue.
             * @memberof google.protobuf
             * @classdesc Represents a StringValue.
             * @implements IStringValue
             * @constructor
             * @param {google.protobuf.IStringValue=} [properties] Properties to set
             */
            function StringValue(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * StringValue value.
             * @member {string} value
             * @memberof google.protobuf.StringValue
             * @instance
             */
            StringValue.prototype.value = "";

            /**
             * Creates a new StringValue instance using the specified properties.
             * @function create
             * @memberof google.protobuf.StringValue
             * @static
             * @param {google.protobuf.IStringValue=} [properties] Properties to set
             * @returns {google.protobuf.StringValue} StringValue instance
             */
            StringValue.create = function create(properties) {
                return new StringValue(properties);
            };

            /**
             * Encodes the specified StringValue message. Does not implicitly {@link google.protobuf.StringValue.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.StringValue
             * @static
             * @param {google.protobuf.IStringValue} message StringValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            StringValue.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.value);
                return writer;
            };

            /**
             * Encodes the specified StringValue message, length delimited. Does not implicitly {@link google.protobuf.StringValue.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.StringValue
             * @static
             * @param {google.protobuf.IStringValue} message StringValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            StringValue.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a StringValue message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.StringValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.StringValue} StringValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            StringValue.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.StringValue();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.value = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a StringValue message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.StringValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.StringValue} StringValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            StringValue.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a StringValue message.
             * @function verify
             * @memberof google.protobuf.StringValue
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            StringValue.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (!$util.isString(message.value))
                        return "value: string expected";
                return null;
            };

            /**
             * Creates a StringValue message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.StringValue
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.StringValue} StringValue
             */
            StringValue.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.StringValue)
                    return object;
                var message = new $root.google.protobuf.StringValue();
                if (object.value != null)
                    message.value = String(object.value);
                return message;
            };

            /**
             * Creates a plain object from a StringValue message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.StringValue
             * @static
             * @param {google.protobuf.StringValue} message StringValue
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            StringValue.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.value = "";
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = message.value;
                return object;
            };

            /**
             * Converts this StringValue to JSON.
             * @function toJSON
             * @memberof google.protobuf.StringValue
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            StringValue.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return StringValue;
        })();

        protobuf.BytesValue = (function() {

            /**
             * Properties of a BytesValue.
             * @memberof google.protobuf
             * @interface IBytesValue
             * @property {Uint8Array|null} [value] BytesValue value
             */

            /**
             * Constructs a new BytesValue.
             * @memberof google.protobuf
             * @classdesc Represents a BytesValue.
             * @implements IBytesValue
             * @constructor
             * @param {google.protobuf.IBytesValue=} [properties] Properties to set
             */
            function BytesValue(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * BytesValue value.
             * @member {Uint8Array} value
             * @memberof google.protobuf.BytesValue
             * @instance
             */
            BytesValue.prototype.value = $util.newBuffer([]);

            /**
             * Creates a new BytesValue instance using the specified properties.
             * @function create
             * @memberof google.protobuf.BytesValue
             * @static
             * @param {google.protobuf.IBytesValue=} [properties] Properties to set
             * @returns {google.protobuf.BytesValue} BytesValue instance
             */
            BytesValue.create = function create(properties) {
                return new BytesValue(properties);
            };

            /**
             * Encodes the specified BytesValue message. Does not implicitly {@link google.protobuf.BytesValue.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.BytesValue
             * @static
             * @param {google.protobuf.IBytesValue} message BytesValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            BytesValue.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.value);
                return writer;
            };

            /**
             * Encodes the specified BytesValue message, length delimited. Does not implicitly {@link google.protobuf.BytesValue.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.BytesValue
             * @static
             * @param {google.protobuf.IBytesValue} message BytesValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            BytesValue.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a BytesValue message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.BytesValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.BytesValue} BytesValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BytesValue.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.BytesValue();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.value = reader.bytes();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a BytesValue message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.BytesValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.BytesValue} BytesValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BytesValue.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a BytesValue message.
             * @function verify
             * @memberof google.protobuf.BytesValue
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            BytesValue.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (!(message.value && typeof message.value.length === "number" || $util.isString(message.value)))
                        return "value: buffer expected";
                return null;
            };

            /**
             * Creates a BytesValue message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.BytesValue
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.BytesValue} BytesValue
             */
            BytesValue.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.BytesValue)
                    return object;
                var message = new $root.google.protobuf.BytesValue();
                if (object.value != null)
                    if (typeof object.value === "string")
                        $util.base64.decode(object.value, message.value = $util.newBuffer($util.base64.length(object.value)), 0);
                    else if (object.value.length)
                        message.value = object.value;
                return message;
            };

            /**
             * Creates a plain object from a BytesValue message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.BytesValue
             * @static
             * @param {google.protobuf.BytesValue} message BytesValue
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            BytesValue.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    if (options.bytes === String)
                        object.value = "";
                    else {
                        object.value = [];
                        if (options.bytes !== Array)
                            object.value = $util.newBuffer(object.value);
                    }
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = options.bytes === String ? $util.base64.encode(message.value, 0, message.value.length) : options.bytes === Array ? Array.prototype.slice.call(message.value) : message.value;
                return object;
            };

            /**
             * Converts this BytesValue to JSON.
             * @function toJSON
             * @memberof google.protobuf.BytesValue
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            BytesValue.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return BytesValue;
        })();

        return protobuf;
    })();

    return google;
})();

module.exports = $root;
