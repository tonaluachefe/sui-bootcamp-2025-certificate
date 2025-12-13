// Helper para importar TransactionBlock de forma compatível com Vite
// @ts-ignore
import * as sui from '@mysten/sui.js'

// @ts-ignore
export const TransactionBlock = (sui as any).TransactionBlock || (sui as any).default?.TransactionBlock

// @ts-ignore  
export const getFullnodeUrl = sui.getFullnodeUrl || (sui as any).default?.getFullnodeUrl

