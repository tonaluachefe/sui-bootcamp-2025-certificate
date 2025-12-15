# Sui NFT Dapp – Final Bootcamp Project (Single Doc)

Functional NFT Dapp on Sui: wallet connect (Sui/Martian/Ethos via @mysten/wallet-kit), mint NFTs with `tx_context::sender` as owner, React + Vite frontend. This README centralizes all required info (dev, deploy, and form answers).

## Repository
`https://github.com/tonaluachefe/sui-bootcamp-2025-certificate`

## Contract Deploys
- Mainnet
  - Package ID: `0x1c0ce5438a6797bd9cbdda86bfcc1bc8ecabd2103c5ac953ab3898cb38828b89`
  - Transaction Digest: `FpXA5F8exnpEhp3v5PmErcxvuxLGu85LnxFrCYLPGSRz`
  - Explorer: https://suiexplorer.com/object/0x1c0ce5438a6797bd9cbdda86bfcc1bc8ecabd2103c5ac953ab3898cb38828b89?network=mainnet
  - Tx: https://suiexplorer.com/txblock/FpXA5F8exnpEhp3v5PmErcxvuxLGu85LnxFrCYLPGSRz?network=mainnet
- Testnet
  - Package ID: `0x5292e8182c0b8904362a8b48e166330cc20bfd5043c1ea4b5b4c3d2975eae40b`
  - Transaction Digest: `8WhwdMU2Eb3qmrqH967HGbtUDW3PMif1E4e4nYZddsbC`
  - Explorer: https://suiexplorer.com/object/0x5292e8182c0b8904362a8b48e166330cc20bfd5043c1ea4b5b4c3d2975eae40b?network=testnet
- Deployer wallet: `0x963408595b26c34f7703936ce38da152996134041ac23ddac04b28b9c2cd5c64`

## Stack
- Move (Sui Framework), Sui CLI, @mysten/sui.js, @mysten/wallet-kit
- React 18, TypeScript, Vite

## Run Locally
```bash
cd frontend
npm install
npm run dev
# open the shown localhost URL (usually http://localhost:5173)
```

## Build (used by Vercel)
```bash
cd frontend
npm run build
```
Output directory: `frontend/dist`

## Vercel Deploy (manual steps)
- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- After deploy: open the Vercel URL, connect wallet, mint.

## Frontend Usage
1) Connect wallet (Sui/Martian/Ethos) via ConnectButton.  
2) Choose network (mainnet/testnet selector).  
3) Fill NFT Name, Description, Image URL (prefer HTTPS/IPFS; avoid base64 >16KB).  
4) Click Mint and sign the transaction in the wallet.  
5) The digest and explorer link are shown after success.

## Smart Contract (sui_nft::nft)
- `mint(name: vector<u8>, description: vector<u8>, uri: vector<u8>, ctx: &mut TxContext)`  
  - Owner = `tx_context::sender(ctx)`  
  - Transfers NFT to sender and emits `NFTMinted` event (id, owner, name).

## Results
- Repository Link (public): `https://github.com/tonaluachefe/sui-bootcamp-2025-certificate`
- Short Project Description: Simple NFT Dapp on Sui: users connect a wallet and mint NFTs with basic metadata. Built for the Sui Bootcamp final project.
- Detailed Project Description: A lightweight NFT Dapp on the Sui blockchain. The Move contract mints an NFT using tx_context::sender as owner and emits an NFTMinted event. The React + Vite frontend integrates @mysten/wallet-kit so users can connect Sui-compatible wallets and mint NFTs by providing name, description, and image URI. The app includes network selector (mainnet/testnet) and uses the deployed package ID.
- Technologies Used: Move (Sui Framework), Sui CLI, @mysten/sui.js, @mysten/wallet-kit, React 18, TypeScript, Vite.
- Network Used: Sui Mainnet (testnet package also available if needed).
- Package ID (Mainnet): `0x1c0ce5438a6797bd9cbdda86bfcc1bc8ecabd2103c5ac953ab3898cb38828b89`
- Transaction Digest (Mainnet deploy): `FpXA5F8exnpEhp3v5PmErcxvuxLGu85LnxFrCYLPGSRz`
- Wallet Address (Deployer): `0x963408595b26c34f7703936ce38da152996134041ac23ddac04b28b9c2cd5c64`
- Explorer Links: Package https://suiexplorer.com/object/0x1c0ce5438a6797bd9cbdda86bfcc1bc8ecabd2103c5ac953ab3898cb38828b89?network=mainnet | Tx https://suiexplorer.com/txblock/FpXA5F8exnpEhp3v5PmErcxvuxLGu85LnxFrCYLPGSRz?network=mainnet
- Project Goal: Deliver a functional NFT minting Dapp for the Sui Bootcamp: connect wallet, call Move mint with tx_context::sender, provide clear UX with language/network selectors and docs.
- What I Learned: Writing/deploying Move contracts on Sui; integrating @mysten/wallet-kit in React/TS to sign transactions; building and deploying end-to-end Dapp (network selector mainnet/testnet) and handling @mysten/sui.js export quirks.

## Checklist (form fields)
- [x] Repository link
- [x] Short description
- [x] Detailed description
- [x] Technologies
- [x] Network
- [x] Package ID
- [x] Transaction digest
- [x] Wallet address (deployer)
- [x] Project goal
- [x] Learnings
- [x] Explorer links (helpful if field/notes)

## Notes / Troubleshooting
- Pure args on Sui have ~16KB limit: prefer image URLs (https/ipfs). Base64 URIs >16KB are rejected. 
- If wallet connect fails, ensure the extension is installed and reload. 
- If mint fails, verify network selector matches the package ID and you have SUI for gas. 
