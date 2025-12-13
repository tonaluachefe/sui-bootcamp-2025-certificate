# Informações do Projeto - Sui NFT Dapp

## Link do Repositório
```
<COLE AQUI O LINK DO SEU REPOSITÓRIO GIT APÓS FAZER PUSH>
```

## Descrição do Projeto
```
Dapp NFT desenvolvido em Sui que permite aos usuários mintarem NFTs personalizados através 
de uma interface web intuitiva. O projeto utiliza Smart Contracts em Move para garantir a 
propriedade e transferência segura dos NFTs, e um frontend React com integração de wallet 
para uma experiência de usuário moderna. O sistema utiliza tx_context::sender() para garantir 
que apenas o assinante da transação seja o owner do NFT mintado, seguindo as melhores práticas 
de segurança da blockchain Sui.
```

## Tecnologias Usadas
```
- Move (Sui Framework) - Smart Contracts
- React 18 - Frontend Framework  
- TypeScript - Linguagem de programação
- Vite - Build tool e bundler
- @mysten/wallet-kit - Integração de wallets Sui (Sui Wallet, Martian, Ethos)
- @mysten/sui.js - SDK oficial do Sui para JavaScript/TypeScript
```

## Network Utilizada
```
Sui Testnet
```

## Package ID do Contrato
```
<COLE AQUI O PACKAGE ID RETORNADO APÓS EXECUTAR: sui client publish --gas-budget 100000000>

O Package ID será retornado no output do comando de deploy, no formato: 0x...
```

## Instruções para Obter o Package ID

1. Certifique-se de ter o Sui CLI instalado
2. Entre na pasta `sui_nft`
3. Execute o deploy:
   ```bash
   sui client publish --gas-budget 100000000
   ```
4. **AÇÃO MANUAL**: Aprove a transação na sua wallet
5. Copie o Package ID que aparece no output (formato `0x...`)

