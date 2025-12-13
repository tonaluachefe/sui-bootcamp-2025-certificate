# Sui NFT Dapp - Projeto Final Bootcamp

Um Dapp simples para mintar NFTs na blockchain Sui, utilizando Smart Contracts em Move e um frontend React com TypeScript.

## 🚀 Tecnologias Utilizadas

- **Smart Contract**: Move (Sui Framework)
- **Frontend**: React 18 + TypeScript + Vite
- **Wallet Integration**: @mysten/wallet-kit (suporta Sui Wallet, Martian Wallet, Ethos Wallet)
- **Network**: Sui Testnet (ou Mainnet após deploy)

## 📋 Pré-requisitos

1. **Sui CLI** instalado
   ```bash
   cargo install --locked --git https://github.com/MystenLabs/sui.git --branch devnet sui
   ```

2. **Node.js** (v18 ou superior) e npm/yarn

3. **Wallet instalada** (uma das opções):
   - [Sui Wallet](https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil)
   - [Martian Wallet](https://www.martianwallet.xyz/)
   - [Ethos Wallet](https://ethoswallet.xyz/)

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone <seu-repositorio>
cd Bootcamp\ 2025
```

### 2. Instale as dependências do frontend

```bash
cd frontend
npm install
```

## 📦 Deploy do Smart Contract

### 1. Configure o Sui CLI

Se ainda não tiver uma wallet configurada:

```bash
sui client new-address ed25519
```

Isso criará um novo endereço. **IMPORTANTE**: Guarde a seed phrase em local seguro!

### 2. Obtenha fundos para teste (Testnet)

Obtenha tokens de teste em: https://discord.com/channels/916379725201563759/971488439931392130

Ou use o faucet:
```bash
sui client faucet
```

### 3. Deploy do contrato

```bash
cd sui_nft
sui client publish --gas-budget 100000000
```

**⚠️ AÇÃO MANUAL NECESSÁRIA**: Você precisará assinar a transação de deploy com sua wallet.

O comando retornará informações importantes:
- **packageId**: Use este ID no frontend (formato: `0x...`)
- **transactionDigest**: Hash da transação

Exemplo de output:
```
Published Objects:
  - ID: 0x... <-- Este é o packageId que você precisa
```

Copie o **packageId** - você precisará dele no frontend!

## 🎨 Como Usar o Frontend

### 1. Inicie o servidor de desenvolvimento

```bash
cd frontend
npm run dev
```

O app estará disponível em `http://localhost:5173`

### 2. Conectar a Wallet

1. Clique no botão **"Conectar Wallet"**
2. Selecione sua wallet instalada (Sui Wallet, Martian ou Ethos)
3. **AÇÃO MANUAL NECESSÁRIA**: Aprove a conexão na extensão da wallet
4. O endereço da sua wallet aparecerá na tela

### 3. Mintar um NFT

1. **Cole o Package ID** do contrato deployado no campo "Package ID"
2. Preencha os campos:
   - **Nome do NFT**: Nome único do seu NFT
   - **Descrição**: Descrição do NFT
   - **URI**: Link para a imagem/metadata do NFT (ex: IPFS, HTTPS)
3. Clique em **"Mintar NFT"**
4. **AÇÃO MANUAL NECESSÁRIA**: Aprove a transação na sua wallet
5. Aguarde a confirmação
6. O hash da transação aparecerá com link para o Sui Explorer

## 📝 Como o Contrato Funciona

O contrato Move (`sui_nft::nft`) possui uma função `mint` que:

1. Recebe `name`, `description` e `uri` como parâmetros
2. Usa `tx_context::sender()` para identificar o owner do NFT
3. Cria um novo objeto NFT com `key` e `store` abilities
4. Transfere o NFT para o endereço do sender (owner)
5. Emite um evento `NFTMinted` com as informações do NFT

**Importante**: O NFT é automaticamente atribuído ao endereço que assina a transação (sender), garantindo que apenas o dono da wallet seja o owner do NFT.

## 🔐 Segurança

- ✅ **Nenhuma seed phrase** é gerada ou armazenada no código
- ✅ A wallet do usuário gerencia todas as chaves privadas
- ✅ Todas as transações são assinadas pela wallet do usuário
- ✅ O `tx_context::sender()` garante que o owner seja quem assinou a transação

## 📊 Informações para o Formulário do Bootcamp

### Link do Repositório
```
<COLE AQUI O LINK DO SEU REPOSITÓRIO GIT>
```

### Descrição do Projeto
```
Dapp NFT desenvolvido em Sui que permite aos usuários mintarem NFTs personalizados. 
O projeto utiliza Smart Contracts em Move para garantir a propriedade e transferência 
segura dos NFTs, e um frontend React com integração de wallet para uma experiência 
de usuário intuitiva. O sistema utiliza tx_context::sender() para garantir que apenas 
o assinante da transação seja o owner do NFT mintado.
```

### Tecnologias Usadas
```
- Move (Sui Framework) - Smart Contracts
- React 18 - Frontend Framework
- TypeScript - Linguagem de programação
- Vite - Build tool
- @mysten/wallet-kit - Integração de wallets Sui
- @mysten/sui.js - SDK Sui
```

### Network Utilizada
```
Sui Testnet (ou Sui Mainnet se você fizer deploy na mainnet)
```

### Package ID do Contrato
```
<COLE AQUI O PACKAGE ID RETORNADO APÓS O DEPLOY>
```
Você obtém isso executando: `sui client publish --gas-budget 100000000`

## 🐛 Troubleshooting

### Erro ao conectar wallet
- Certifique-se de que a extensão da wallet está instalada e ativa
- Recarregue a página após instalar a extensão

### Erro ao mintar NFT
- Verifique se o Package ID está correto
- Certifique-se de ter SUI suficiente para gas
- Verifique se os campos estão preenchidos

### Erro de compilação do contrato
- Verifique se o Sui CLI está atualizado: `sui --version`
- Certifique-se de estar na versão correta do framework no `Move.toml`

## 📚 Recursos Úteis

- [Documentação Sui](https://docs.sui.io/)
- [Sui Explorer](https://suiexplorer.com/)
- [Move Book](https://move-language.github.io/move/)
- [Sui Wallet](https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil)

## 👨‍💻 Desenvolvido para o Sui Bootcamp 2025

Este projeto foi desenvolvido como projeto final do Sui Bootcamp, demonstrando:
- Criação de Smart Contracts em Move
- Integração de wallets Sui
- Desenvolvimento de Dapps com React
- Uso correto de tx_context::sender() para ownership

