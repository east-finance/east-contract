import * as $protobuf from "protobufjs";
export namespace wavesenterprise {

    class ContractService extends $protobuf.rpc.Service {
        constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);
        public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): ContractService;
        public connect(request: wavesenterprise.IConnectionRequest, callback: wavesenterprise.ContractService.ConnectCallback): void;
        public connect(request: wavesenterprise.IConnectionRequest): Promise<wavesenterprise.ContractTransactionResponse>;
        public commitExecutionSuccess(request: wavesenterprise.IExecutionSuccessRequest, callback: wavesenterprise.ContractService.CommitExecutionSuccessCallback): void;
        public commitExecutionSuccess(request: wavesenterprise.IExecutionSuccessRequest): Promise<wavesenterprise.CommitExecutionResponse>;
        public commitExecutionError(request: wavesenterprise.IExecutionErrorRequest, callback: wavesenterprise.ContractService.CommitExecutionErrorCallback): void;
        public commitExecutionError(request: wavesenterprise.IExecutionErrorRequest): Promise<wavesenterprise.CommitExecutionResponse>;
        public getContractKeys(request: wavesenterprise.IContractKeysRequest, callback: wavesenterprise.ContractService.GetContractKeysCallback): void;
        public getContractKeys(request: wavesenterprise.IContractKeysRequest): Promise<wavesenterprise.ContractKeysResponse>;
        public getContractKey(request: wavesenterprise.IContractKeyRequest, callback: wavesenterprise.ContractService.GetContractKeyCallback): void;
        public getContractKey(request: wavesenterprise.IContractKeyRequest): Promise<wavesenterprise.ContractKeyResponse>;
    }

    namespace ContractService {

        type ConnectCallback = (error: (Error|null), response?: wavesenterprise.ContractTransactionResponse) => void;

        type CommitExecutionSuccessCallback = (error: (Error|null), response?: wavesenterprise.CommitExecutionResponse) => void;

        type CommitExecutionErrorCallback = (error: (Error|null), response?: wavesenterprise.CommitExecutionResponse) => void;

        type GetContractKeysCallback = (error: (Error|null), response?: wavesenterprise.ContractKeysResponse) => void;

        type GetContractKeyCallback = (error: (Error|null), response?: wavesenterprise.ContractKeyResponse) => void;
    }

    interface IConnectionRequest {
        connectionId?: (string|null);
        asyncFactor?: (number|null);
    }

    class ConnectionRequest implements IConnectionRequest {
        constructor(properties?: wavesenterprise.IConnectionRequest);
        public connectionId: string;
        public asyncFactor: number;
        public static create(properties?: wavesenterprise.IConnectionRequest): wavesenterprise.ConnectionRequest;
        public static encode(message: wavesenterprise.IConnectionRequest, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: wavesenterprise.IConnectionRequest, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.ConnectionRequest;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.ConnectionRequest;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): wavesenterprise.ConnectionRequest;
        public static toObject(message: wavesenterprise.ConnectionRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
    }

    interface IContractTransactionResponse {
        transaction?: (wavesenterprise.IContractTransaction|null);
        authToken?: (string|null);
    }

    class ContractTransactionResponse implements IContractTransactionResponse {
        constructor(properties?: wavesenterprise.IContractTransactionResponse);
        public transaction?: (wavesenterprise.IContractTransaction|null);
        public authToken: string;
        public static create(properties?: wavesenterprise.IContractTransactionResponse): wavesenterprise.ContractTransactionResponse;
        public static encode(message: wavesenterprise.IContractTransactionResponse, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: wavesenterprise.IContractTransactionResponse, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.ContractTransactionResponse;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.ContractTransactionResponse;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): wavesenterprise.ContractTransactionResponse;
        public static toObject(message: wavesenterprise.ContractTransactionResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
    }

    interface IContractTransaction {
        id?: (string|null);
        type?: (number|null);
        sender?: (string|null);
        senderPublicKey?: (string|null);
        contractId?: (string|null);
        params?: (wavesenterprise.IDataEntry[]|null);
        fee?: (number|Long|null);
        version?: (number|null);
        proofs?: (Uint8Array|null);
        timestamp?: (number|Long|null);
        feeAssetId?: (wavesenterprise.IAssetId|null);
        createData?: (wavesenterprise.ICreateContractTransactionData|null);
        callData?: (wavesenterprise.ICallContractTransactionData|null);
    }

    class ContractTransaction implements IContractTransaction {
        constructor(properties?: wavesenterprise.IContractTransaction);
        public id: string;
        public type: number;
        public sender: string;
        public senderPublicKey: string;
        public contractId: string;
        public params: wavesenterprise.IDataEntry[];
        public fee: (number|Long);
        public version: number;
        public proofs: Uint8Array;
        public timestamp: (number|Long);
        public feeAssetId?: (wavesenterprise.IAssetId|null);
        public createData?: (wavesenterprise.ICreateContractTransactionData|null);
        public callData?: (wavesenterprise.ICallContractTransactionData|null);
        public data?: ("createData"|"callData");
        public static create(properties?: wavesenterprise.IContractTransaction): wavesenterprise.ContractTransaction;
        public static encode(message: wavesenterprise.IContractTransaction, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: wavesenterprise.IContractTransaction, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.ContractTransaction;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.ContractTransaction;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): wavesenterprise.ContractTransaction;
        public static toObject(message: wavesenterprise.ContractTransaction, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
    }

    interface ICreateContractTransactionData {
        image?: (string|null);
        imageHash?: (string|null);
        contractName?: (string|null);
    }

    class CreateContractTransactionData implements ICreateContractTransactionData {
        constructor(properties?: wavesenterprise.ICreateContractTransactionData);
        public image: string;
        public imageHash: string;
        public contractName: string;
        public static create(properties?: wavesenterprise.ICreateContractTransactionData): wavesenterprise.CreateContractTransactionData;
        public static encode(message: wavesenterprise.ICreateContractTransactionData, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: wavesenterprise.ICreateContractTransactionData, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.CreateContractTransactionData;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.CreateContractTransactionData;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): wavesenterprise.CreateContractTransactionData;
        public static toObject(message: wavesenterprise.CreateContractTransactionData, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
    }

    interface ICallContractTransactionData {
        contractVersion?: (number|null);
    }

    class CallContractTransactionData implements ICallContractTransactionData {
        constructor(properties?: wavesenterprise.ICallContractTransactionData);
        public contractVersion: number;
        public static create(properties?: wavesenterprise.ICallContractTransactionData): wavesenterprise.CallContractTransactionData;
        public static encode(message: wavesenterprise.ICallContractTransactionData, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: wavesenterprise.ICallContractTransactionData, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.CallContractTransactionData;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.CallContractTransactionData;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): wavesenterprise.CallContractTransactionData;
        public static toObject(message: wavesenterprise.CallContractTransactionData, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
    }

    interface IExecutionSuccessRequest {
        txId?: (string|null);
        results?: (wavesenterprise.IDataEntry[]|null);
    }

    class ExecutionSuccessRequest implements IExecutionSuccessRequest {
        constructor(properties?: wavesenterprise.IExecutionSuccessRequest);
        public txId: string;
        public results: wavesenterprise.IDataEntry[];
        public static create(properties?: wavesenterprise.IExecutionSuccessRequest): wavesenterprise.ExecutionSuccessRequest;
        public static encode(message: wavesenterprise.IExecutionSuccessRequest, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: wavesenterprise.IExecutionSuccessRequest, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.ExecutionSuccessRequest;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.ExecutionSuccessRequest;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): wavesenterprise.ExecutionSuccessRequest;
        public static toObject(message: wavesenterprise.ExecutionSuccessRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
    }

    interface IExecutionErrorRequest {
        txId?: (string|null);
        message?: (string|null);
    }

    class ExecutionErrorRequest implements IExecutionErrorRequest {
        constructor(properties?: wavesenterprise.IExecutionErrorRequest);
        public txId: string;
        public message: string;
        public static create(properties?: wavesenterprise.IExecutionErrorRequest): wavesenterprise.ExecutionErrorRequest;
        public static encode(message: wavesenterprise.IExecutionErrorRequest, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: wavesenterprise.IExecutionErrorRequest, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.ExecutionErrorRequest;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.ExecutionErrorRequest;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): wavesenterprise.ExecutionErrorRequest;
        public static toObject(message: wavesenterprise.ExecutionErrorRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
    }

    interface ICommitExecutionResponse {
    }

    class CommitExecutionResponse implements ICommitExecutionResponse {
        constructor(properties?: wavesenterprise.ICommitExecutionResponse);
        public static create(properties?: wavesenterprise.ICommitExecutionResponse): wavesenterprise.CommitExecutionResponse;
        public static encode(message: wavesenterprise.ICommitExecutionResponse, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: wavesenterprise.ICommitExecutionResponse, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.CommitExecutionResponse;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.CommitExecutionResponse;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): wavesenterprise.CommitExecutionResponse;
        public static toObject(message: wavesenterprise.CommitExecutionResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
    }

    interface IContractKeysRequest {
        contractId?: (string|null);
        limit?: (google.protobuf.IInt32Value|null);
        offset?: (google.protobuf.IInt32Value|null);
        matches?: (google.protobuf.IStringValue|null);
        keysFilter?: (wavesenterprise.IKeysFilter|null);
    }

    class ContractKeysRequest implements IContractKeysRequest {
        constructor(properties?: wavesenterprise.IContractKeysRequest);
        public contractId: string;
        public limit?: (google.protobuf.IInt32Value|null);
        public offset?: (google.protobuf.IInt32Value|null);
        public matches?: (google.protobuf.IStringValue|null);
        public keysFilter?: (wavesenterprise.IKeysFilter|null);
        public static create(properties?: wavesenterprise.IContractKeysRequest): wavesenterprise.ContractKeysRequest;
        public static encode(message: wavesenterprise.IContractKeysRequest, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: wavesenterprise.IContractKeysRequest, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.ContractKeysRequest;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.ContractKeysRequest;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): wavesenterprise.ContractKeysRequest;
        public static toObject(message: wavesenterprise.ContractKeysRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
    }

    interface IKeysFilter {
        keys?: (string[]|null);
    }

    class KeysFilter implements IKeysFilter {
        constructor(properties?: wavesenterprise.IKeysFilter);
        public keys: string[];
        public static create(properties?: wavesenterprise.IKeysFilter): wavesenterprise.KeysFilter;
        public static encode(message: wavesenterprise.IKeysFilter, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: wavesenterprise.IKeysFilter, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.KeysFilter;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.KeysFilter;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): wavesenterprise.KeysFilter;
        public static toObject(message: wavesenterprise.KeysFilter, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
    }

    interface IContractKeysResponse {
        entries?: (wavesenterprise.IDataEntry[]|null);
    }

    class ContractKeysResponse implements IContractKeysResponse {
        constructor(properties?: wavesenterprise.IContractKeysResponse);
        public entries: wavesenterprise.IDataEntry[];
        public static create(properties?: wavesenterprise.IContractKeysResponse): wavesenterprise.ContractKeysResponse;
        public static encode(message: wavesenterprise.IContractKeysResponse, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: wavesenterprise.IContractKeysResponse, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.ContractKeysResponse;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.ContractKeysResponse;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): wavesenterprise.ContractKeysResponse;
        public static toObject(message: wavesenterprise.ContractKeysResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
    }

    interface IContractKeyRequest {
        contractId?: (string|null);
        key?: (string|null);
    }

    class ContractKeyRequest implements IContractKeyRequest {
        constructor(properties?: wavesenterprise.IContractKeyRequest);
        public contractId: string;
        public key: string;
        public static create(properties?: wavesenterprise.IContractKeyRequest): wavesenterprise.ContractKeyRequest;
        public static encode(message: wavesenterprise.IContractKeyRequest, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: wavesenterprise.IContractKeyRequest, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.ContractKeyRequest;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.ContractKeyRequest;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): wavesenterprise.ContractKeyRequest;
        public static toObject(message: wavesenterprise.ContractKeyRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
    }

    interface IContractKeyResponse {
        entry?: (wavesenterprise.IDataEntry|null);
    }

    class ContractKeyResponse implements IContractKeyResponse {
        constructor(properties?: wavesenterprise.IContractKeyResponse);
        public entry?: (wavesenterprise.IDataEntry|null);
        public static create(properties?: wavesenterprise.IContractKeyResponse): wavesenterprise.ContractKeyResponse;
        public static encode(message: wavesenterprise.IContractKeyResponse, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: wavesenterprise.IContractKeyResponse, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.ContractKeyResponse;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.ContractKeyResponse;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): wavesenterprise.ContractKeyResponse;
        public static toObject(message: wavesenterprise.ContractKeyResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
    }

    interface IAssetId {
        value?: (string|null);
    }

    class AssetId implements IAssetId {
        constructor(properties?: wavesenterprise.IAssetId);
        public value: string;
        public static create(properties?: wavesenterprise.IAssetId): wavesenterprise.AssetId;
        public static encode(message: wavesenterprise.IAssetId, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: wavesenterprise.IAssetId, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.AssetId;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.AssetId;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): wavesenterprise.AssetId;
        public static toObject(message: wavesenterprise.AssetId, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
    }

    interface IDataEntry {
        key?: (string|null);
        intValue?: (number|Long|null);
        boolValue?: (boolean|null);
        binaryValue?: (Uint8Array|null);
        stringValue?: (string|null);
    }

    class DataEntry implements IDataEntry {
        constructor(properties?: wavesenterprise.IDataEntry);
        public key: string;
        public intValue: (number|Long);
        public boolValue: boolean;
        public binaryValue: Uint8Array;
        public stringValue: string;
        public value?: ("intValue"|"boolValue"|"binaryValue"|"stringValue");
        public static create(properties?: wavesenterprise.IDataEntry): wavesenterprise.DataEntry;
        public static encode(message: wavesenterprise.IDataEntry, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: wavesenterprise.IDataEntry, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.DataEntry;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.DataEntry;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): wavesenterprise.DataEntry;
        public static toObject(message: wavesenterprise.DataEntry, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
    }
}

export namespace google {

    namespace protobuf {

        interface IDoubleValue {
            value?: (number|null);
        }

        class DoubleValue implements IDoubleValue {
            constructor(properties?: google.protobuf.IDoubleValue);
            public value: number;
            public static create(properties?: google.protobuf.IDoubleValue): google.protobuf.DoubleValue;
            public static encode(message: google.protobuf.IDoubleValue, writer?: $protobuf.Writer): $protobuf.Writer;
            public static encodeDelimited(message: google.protobuf.IDoubleValue, writer?: $protobuf.Writer): $protobuf.Writer;
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.DoubleValue;
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.DoubleValue;
            public static verify(message: { [k: string]: any }): (string|null);
            public static fromObject(object: { [k: string]: any }): google.protobuf.DoubleValue;
            public static toObject(message: google.protobuf.DoubleValue, options?: $protobuf.IConversionOptions): { [k: string]: any };
            public toJSON(): { [k: string]: any };
        }

        interface IFloatValue {
            value?: (number|null);
        }

        class FloatValue implements IFloatValue {
            constructor(properties?: google.protobuf.IFloatValue);
            public value: number;
            public static create(properties?: google.protobuf.IFloatValue): google.protobuf.FloatValue;
            public static encode(message: google.protobuf.IFloatValue, writer?: $protobuf.Writer): $protobuf.Writer;
            public static encodeDelimited(message: google.protobuf.IFloatValue, writer?: $protobuf.Writer): $protobuf.Writer;
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.FloatValue;
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.FloatValue;
            public static verify(message: { [k: string]: any }): (string|null);
            public static fromObject(object: { [k: string]: any }): google.protobuf.FloatValue;
            public static toObject(message: google.protobuf.FloatValue, options?: $protobuf.IConversionOptions): { [k: string]: any };
            public toJSON(): { [k: string]: any };
        }

        interface IInt64Value {
            value?: (number|Long|null);
        }

        class Int64Value implements IInt64Value {
            constructor(properties?: google.protobuf.IInt64Value);
            public value: (number|Long);
            public static create(properties?: google.protobuf.IInt64Value): google.protobuf.Int64Value;
            public static encode(message: google.protobuf.IInt64Value, writer?: $protobuf.Writer): $protobuf.Writer;
            public static encodeDelimited(message: google.protobuf.IInt64Value, writer?: $protobuf.Writer): $protobuf.Writer;
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Int64Value;
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Int64Value;
            public static verify(message: { [k: string]: any }): (string|null);
            public static fromObject(object: { [k: string]: any }): google.protobuf.Int64Value;
            public static toObject(message: google.protobuf.Int64Value, options?: $protobuf.IConversionOptions): { [k: string]: any };
            public toJSON(): { [k: string]: any };
        }

        interface IUInt64Value {
            value?: (number|Long|null);
        }

        class UInt64Value implements IUInt64Value {
            constructor(properties?: google.protobuf.IUInt64Value);
            public value: (number|Long);
            public static create(properties?: google.protobuf.IUInt64Value): google.protobuf.UInt64Value;
            public static encode(message: google.protobuf.IUInt64Value, writer?: $protobuf.Writer): $protobuf.Writer;
            public static encodeDelimited(message: google.protobuf.IUInt64Value, writer?: $protobuf.Writer): $protobuf.Writer;
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.UInt64Value;
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.UInt64Value;
            public static verify(message: { [k: string]: any }): (string|null);
            public static fromObject(object: { [k: string]: any }): google.protobuf.UInt64Value;
            public static toObject(message: google.protobuf.UInt64Value, options?: $protobuf.IConversionOptions): { [k: string]: any };
            public toJSON(): { [k: string]: any };
        }

        interface IInt32Value {
            value?: (number|null);
        }

        class Int32Value implements IInt32Value {
            constructor(properties?: google.protobuf.IInt32Value);
            public value: number;
            public static create(properties?: google.protobuf.IInt32Value): google.protobuf.Int32Value;
            public static encode(message: google.protobuf.IInt32Value, writer?: $protobuf.Writer): $protobuf.Writer;
            public static encodeDelimited(message: google.protobuf.IInt32Value, writer?: $protobuf.Writer): $protobuf.Writer;
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Int32Value;
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Int32Value;
            public static verify(message: { [k: string]: any }): (string|null);
            public static fromObject(object: { [k: string]: any }): google.protobuf.Int32Value;
            public static toObject(message: google.protobuf.Int32Value, options?: $protobuf.IConversionOptions): { [k: string]: any };
            public toJSON(): { [k: string]: any };
        }

        interface IUInt32Value {
            value?: (number|null);
        }

        class UInt32Value implements IUInt32Value {
            constructor(properties?: google.protobuf.IUInt32Value);
            public value: number;
            public static create(properties?: google.protobuf.IUInt32Value): google.protobuf.UInt32Value;
            public static encode(message: google.protobuf.IUInt32Value, writer?: $protobuf.Writer): $protobuf.Writer;
            public static encodeDelimited(message: google.protobuf.IUInt32Value, writer?: $protobuf.Writer): $protobuf.Writer;
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.UInt32Value;
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.UInt32Value;
            public static verify(message: { [k: string]: any }): (string|null);
            public static fromObject(object: { [k: string]: any }): google.protobuf.UInt32Value;
            public static toObject(message: google.protobuf.UInt32Value, options?: $protobuf.IConversionOptions): { [k: string]: any };
            public toJSON(): { [k: string]: any };
        }

        interface IBoolValue {
            value?: (boolean|null);
        }

        class BoolValue implements IBoolValue {
            constructor(properties?: google.protobuf.IBoolValue);
            public value: boolean;
            public static create(properties?: google.protobuf.IBoolValue): google.protobuf.BoolValue;
            public static encode(message: google.protobuf.IBoolValue, writer?: $protobuf.Writer): $protobuf.Writer;
            public static encodeDelimited(message: google.protobuf.IBoolValue, writer?: $protobuf.Writer): $protobuf.Writer;
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.BoolValue;
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.BoolValue;
            public static verify(message: { [k: string]: any }): (string|null);
            public static fromObject(object: { [k: string]: any }): google.protobuf.BoolValue;
            public static toObject(message: google.protobuf.BoolValue, options?: $protobuf.IConversionOptions): { [k: string]: any };
            public toJSON(): { [k: string]: any };
        }

        interface IStringValue {
            value?: (string|null);
        }

        class StringValue implements IStringValue {
            constructor(properties?: google.protobuf.IStringValue);
            public value: string;
            public static create(properties?: google.protobuf.IStringValue): google.protobuf.StringValue;
            public static encode(message: google.protobuf.IStringValue, writer?: $protobuf.Writer): $protobuf.Writer;
            public static encodeDelimited(message: google.protobuf.IStringValue, writer?: $protobuf.Writer): $protobuf.Writer;
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.StringValue;
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.StringValue;
            public static verify(message: { [k: string]: any }): (string|null);
            public static fromObject(object: { [k: string]: any }): google.protobuf.StringValue;
            public static toObject(message: google.protobuf.StringValue, options?: $protobuf.IConversionOptions): { [k: string]: any };
            public toJSON(): { [k: string]: any };
        }

        interface IBytesValue {
            value?: (Uint8Array|null);
        }

        class BytesValue implements IBytesValue {
            constructor(properties?: google.protobuf.IBytesValue);
            public value: Uint8Array;
            public static create(properties?: google.protobuf.IBytesValue): google.protobuf.BytesValue;
            public static encode(message: google.protobuf.IBytesValue, writer?: $protobuf.Writer): $protobuf.Writer;
            public static encodeDelimited(message: google.protobuf.IBytesValue, writer?: $protobuf.Writer): $protobuf.Writer;
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.BytesValue;
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.BytesValue;
            public static verify(message: { [k: string]: any }): (string|null);
            public static fromObject(object: { [k: string]: any }): google.protobuf.BytesValue;
            public static toObject(message: google.protobuf.BytesValue, options?: $protobuf.IConversionOptions): { [k: string]: any };
            public toJSON(): { [k: string]: any };
        }
    }
}
