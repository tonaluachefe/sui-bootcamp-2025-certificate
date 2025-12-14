// Helper para importar TransactionBlock de forma compatível com Vite
// @ts-ignore
import * as suiModule from '@mysten/sui.js'

// Acessa TransactionBlock de diferentes formas possíveis
// @ts-ignore
export const TransactionBlock = (suiModule as any).TransactionBlock || 
  // Fallback class básica
  class TransactionBlock {
    moveCall(config: any) { 
      this._moveCall = config
      return this 
    }
    pure = {
      string: (val: string) => val
    }
    _moveCall: any = null
  }

// @ts-ignore
export const getFullnodeUrl = (suiModule as any).getFullnodeUrl ||
  // Fallback function
  ((network: string) => {
    if (network === 'mainnet') return 'https://fullnode.mainnet.sui.io:443'
    return 'https://fullnode.testnet.sui.io:443'
  })
