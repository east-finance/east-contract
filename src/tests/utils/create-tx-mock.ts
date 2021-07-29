export function createTx(type: 103 | 104, methodKey: string, methodBody: Record<string, any>): any {
  return {
    id: '',
    type: 103,
    sender: 'sender',
    sender_public_key: 'pk',
    contract_id: 'contract_id',
    fee: 1000,
    version: 1,
    proofs: Buffer.from(''),
    timestamp: Date.now(),
    fee_asset_id: {
      value: 'fee_asset_id',
    },
    params: [
      {
        key: methodKey,
        value: 'string_value',
        string_value: JSON.stringify(methodBody)
      }
    ],
  }
}
