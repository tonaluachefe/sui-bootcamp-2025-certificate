// Helper para importar TransactionBlock de forma compatível com Vite e versão 0.17.0
// @ts-ignore - imports da versão 0.17.0
import * as sui from '@mysten/sui.js'

// Acessa TransactionBlock do objeto principal
// @ts-ignore
export const TransactionBlock = sui.TransactionBlock || (sui as any).default?.TransactionBlock

// @ts-ignore
export const getFullnodeUrl = sui.getFullnodeUrl || (sui as any).default?.getFullnodeUrl
