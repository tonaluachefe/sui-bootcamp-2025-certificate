// Helper para importar TransactionBlock de forma compatível com Vite e versão 0.17.0
// Importação dinâmica para garantir compatibilidade
// @ts-ignore
import { TransactionBlock as SuiTransactionBlock, getFullnodeUrl as SuiGetFullnodeUrl } from '@mysten/sui.js'

// Exporta diretamente
export { SuiTransactionBlock as TransactionBlock, SuiGetFullnodeUrl as getFullnodeUrl }
