// Helper para importar TransactionBlock de forma compatível com Vite e versão 0.17.0
// @ts-ignore - imports da versão 0.17.0
import * as suiModule from '@mysten/sui.js'

// Acessa TransactionBlock do objeto principal - versão 0.17.0 usa export nomeado direto
// @ts-ignore
const TransactionBlockClass = suiModule.TransactionBlock

// @ts-ignore
const getFullnodeUrlFn = suiModule.getFullnodeUrl

// Validação para garantir que as funções existem
if (!TransactionBlockClass) {
  console.error('TransactionBlock não encontrado em @mysten/sui.js')
}

if (!getFullnodeUrlFn) {
  console.error('getFullnodeUrl não encontrado em @mysten/sui.js')
}

export const TransactionBlock = TransactionBlockClass
export const getFullnodeUrl = getFullnodeUrlFn
