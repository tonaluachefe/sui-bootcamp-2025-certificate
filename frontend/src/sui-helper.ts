// Helper para importar TransactionBlock de forma compatível com Vite
// Importação direta da versão 0.17.0
// @ts-ignore - tipos podem não estar completos
import { TransactionBlock as SuiTransactionBlock } from '@mysten/sui.js/transactions'
// @ts-ignore
import { getFullnodeUrl as SuiGetFullnodeUrl } from '@mysten/sui.js'

// Exporta diretamente para garantir que temos a classe real
export const TransactionBlock = SuiTransactionBlock
export const getFullnodeUrl = SuiGetFullnodeUrl
