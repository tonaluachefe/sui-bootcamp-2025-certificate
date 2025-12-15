import { useState, useEffect } from 'react'
import { WalletKitProvider, useWalletKit, ConnectButton } from '@mysten/wallet-kit'
// @ts-ignore - tipos da lib podem não estar 100% alinhados com o bundler
import { TransactionBlock } from '@mysten/sui.js/transactions'
// @ts-ignore - mesma observação acima
import { getFullnodeUrl } from '@mysten/sui.js/client'
import './App.css'

// Package IDs dos contratos
const MAINNET_PACKAGE_ID = '0x1c0ce5438a6797bd9cbdda86bfcc1bc8ecabd2103c5ac953ab3898cb38828b89'
const TESTNET_PACKAGE_ID = '0x5292e8182c0b8904362a8b48e166330cc20bfd5043c1ea4b5b4c3d2975eae40b'

// Limite de pure argument do Sui: 16 KB
const MAX_PURE_ARGUMENT = 16_384

// Traduções
const translations = {
  pt: {
    title: '🎨 Sui NFT Dapp',
    connectWallet: 'Conecte sua wallet para começar',
    connectButton: 'Conectar Wallet',
    walletConnected: 'Wallet conectada',
    address: 'Endereço',
    disconnect: 'Desconectar',
    mintNFT: 'Mintar NFT',
    mainnet: 'Mainnet',
    testnet: 'Testnet',
    imageNFT: '📷 Imagem do NFT:',
    chooseImage: '📤 Escolher Imagem',
    changeImage: 'Trocar Imagem',
    loading: 'Carregando...',
    orPasteUrl: 'Ou cole uma URL de imagem abaixo',
    imageUrl: '🔗 URL da Imagem (alternativo):',
    imageUrlPlaceholder: 'https://... ou deixe em branco se já fez upload acima',
    nameNFT: '📝 Nome do NFT:',
    namePlaceholder: 'Meu NFT #1',
    description: '📄 Descrição:',
    descriptionPlaceholder: 'Descrição detalhada do NFT',
    mintButton: '✨ Mintar NFT',
    minting: '⏳ Mintando...',
    success: '✅ Transação enviada com sucesso!',
    viewExplorer: 'Ver no Explorer',
    pleaseConnect: 'Por favor, conecte sua wallet',
    fillAllFields: 'Por favor, preencha todos os campos',
    imageTooBig: 'Imagem muito grande! Por favor, use uma imagem menor que 5MB.',
    mintSuccess: 'NFT mintado com sucesso!',
    mintError: 'Erro ao mintar NFT',
    language: 'Idioma',
    network: 'Rede'
  },
  en: {
    title: '🎨 Sui NFT Dapp',
    connectWallet: 'Connect your wallet to get started',
    connectButton: 'Connect Wallet',
    walletConnected: 'Wallet connected',
    address: 'Address',
    disconnect: 'Disconnect',
    mintNFT: 'Mint NFT',
    mainnet: 'Mainnet',
    testnet: 'Testnet',
    imageNFT: '📷 NFT Image:',
    chooseImage: '📤 Choose Image',
    changeImage: 'Change Image',
    loading: 'Loading...',
    orPasteUrl: 'Or paste an image URL below',
    imageUrl: '🔗 Image URL (alternative):',
    imageUrlPlaceholder: 'https://... or leave blank if already uploaded above',
    nameNFT: '📝 NFT Name:',
    namePlaceholder: 'My NFT #1',
    description: '📄 Description:',
    descriptionPlaceholder: 'Detailed NFT description',
    mintButton: '✨ Mint NFT',
    minting: '⏳ Minting...',
    success: '✅ Transaction sent successfully!',
    viewExplorer: 'View on Explorer',
    pleaseConnect: 'Please connect your wallet',
    fillAllFields: 'Please fill in all fields',
    imageTooBig: 'Image too large! Please use an image smaller than 5MB.',
    mintSuccess: 'NFT minted successfully!',
    mintError: 'Error minting NFT',
    language: 'Language',
    network: 'Network'
  }
}

type Language = 'pt' | 'en'
type Network = 'mainnet' | 'testnet'

function AppContent() {
  const { currentAccount, connect, disconnect, signAndExecuteTransactionBlock, isConnected, wallets } = useWalletKit()
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('nft-dapp-language')
    return (saved as Language) || 'pt'
  })
  const [network, setNetwork] = useState<Network>(() => {
    const saved = localStorage.getItem('nft-dapp-network')
    return (saved as Network) || 'mainnet'
  })
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [uri, setUri] = useState('')
  const [loading, setLoading] = useState(false)
  const [txDigest, setTxDigest] = useState<string | null>(null)

  const t = translations[language]
  const packageId = network === 'mainnet' ? MAINNET_PACKAGE_ID : TESTNET_PACKAGE_ID

  useEffect(() => {
    localStorage.setItem('nft-dapp-language', language)
  }, [language])

  useEffect(() => {
    localStorage.setItem('nft-dapp-network', network)
  }, [network])

  const handleConnect = async () => {
    try {
      // Tenta conectar com a primeira wallet disponível (Suiet ou Sui Wallet)
      // @ts-ignore - tipagem do wallet-kit não inclui "installed" em todas as versões
      const availableWallets = wallets.filter((w: any) => w.installed)
      
      if (availableWallets.length === 0) {
        alert(t.pleaseConnect + ' - Nenhuma wallet instalada. Por favor, instale Suiet ou Sui Wallet.')
        return
      }

      // Se houver apenas uma wallet, conecta diretamente
      if (availableWallets.length === 1) {
        await connect(availableWallets[0].name)
        return
      }

      // Se houver múltiplas wallets, tenta abrir o modal (algumas versões aceitam connect() sem args)
      const connectFn: any = connect as any
      if (typeof connectFn === 'function') {
        await connectFn()
      } else {
        await connectFn(availableWallets[0].name)
      }
    } catch (error: any) {
      console.error('Failed to connect wallet:', error)
      alert(`${t.pleaseConnect}: ${error?.message || 'Erro desconhecido'}`)
    }
  }

  const handleDisconnect = () => {
    disconnect()
    setTxDigest(null)
  }

  const handleMint = async () => {
    if (!currentAccount) {
      alert(t.pleaseConnect)
      return
    }

    if (!name || !description || !uri) {
      alert(t.fillAllFields)
      return
    }

    // Bloqueia URIs grandes demais (limite de 16KB para pure args)
    if (uri.startsWith('data:') && uri.length > MAX_PURE_ARGUMENT) {
      alert('A URI está maior que 16KB. Use uma URL (https/ipfs) ou uma imagem menor.')
      return
    }

    setLoading(true)
    setTxDigest(null)

    try {
      // Cria TransactionBlock usando a API oficial da versão 0.43.x
      const txb = new TransactionBlock()
      txb.moveCall({
        target: `${packageId}::nft::mint`,
        arguments: [
          txb.pure.string(name),
          txb.pure.string(description),
          txb.pure.string(uri),
        ],
      })
      console.log('✅ Transação construída, enviando...')
      const result = await signAndExecuteTransactionBlock({
        transactionBlock: txb,
      })
      
      console.log('✅ Transação enviada:', result)

      setTxDigest(result.digest)
      alert(t.mintSuccess)
      
      // Limpar campos
      setName('')
      setDescription('')
      setUri('')
    } catch (error: any) {
      console.error('Failed to mint NFT:', error)
      alert(`${t.mintError}: ${error.message || 'Erro desconhecido'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      {/* Header com seletor de idioma e rede */}
      <div className="header-controls">
        <div className="control-group">
          <label>{t.network}:</label>
          <select 
            value={network} 
            onChange={(e) => setNetwork(e.target.value as Network)}
            className="network-selector"
          >
            <option value="mainnet">{t.mainnet}</option>
            <option value="testnet">{t.testnet}</option>
          </select>
        </div>
        <div className="control-group">
          <label>{t.language}:</label>
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="language-selector"
          >
            <option value="pt">🇧🇷 Português</option>
            <option value="en">🇺🇸 English</option>
          </select>
        </div>
      </div>

      <h1>{t.title}</h1>
      
      <div className="wallet-section">
        {!currentAccount ? (
          <div>
            <p>{t.connectWallet}</p>
            {/* @ts-ignore - className não está tipado em algumas versões */}
            <ConnectButton className="connect-button" />
          </div>
        ) : (
          <div>
            <p>✅ {t.walletConnected}</p>
            <p className="address">{t.address}: {currentAccount.address}</p>
            <button onClick={handleDisconnect}>{t.disconnect}</button>
          </div>
        )}
      </div>

      {currentAccount && (
        <div className="mint-section">
          <h2>{t.mintNFT}</h2>
          <p className="network-badge">🌐 {network === 'mainnet' ? t.mainnet : t.testnet}</p>
          
          <div className="input-group">
            <label>{t.imageUrl}</label>
            <input
              type="text"
              value={uri}
              onChange={(e) => setUri(e.target.value)}
              placeholder={t.imageUrlPlaceholder}
            />
          </div>

          <div className="input-group">
            <label>{t.nameNFT}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.namePlaceholder}
              required
            />
          </div>

          <div className="input-group">
            <label>{t.description}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.descriptionPlaceholder}
              required
            />
          </div>

          <button 
            onClick={handleMint} 
            disabled={loading || !name || !description || !uri}
            className="mint-button"
          >
            {loading ? `${t.minting} ${network === 'mainnet' ? t.mainnet : t.testnet}...` : t.mintButton}
          </button>

          {txDigest && (
            <div className="success-message">
              <p>{t.success}</p>
              <p>Digest: {txDigest}</p>
              <a 
                href={`https://suiexplorer.com/txblock/${txDigest}?network=${network}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.viewExplorer} ({network === 'mainnet' ? t.mainnet : t.testnet})
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function App() {
  const Provider: any = WalletKitProvider as any
  // URLs oficiais usando helper da lib
  const mainnetUrl = getFullnodeUrl('mainnet')
  const testnetUrl = getFullnodeUrl('testnet')
  
  return (
    <Provider 
      networks={{
        mainnet: {
          url: mainnetUrl
        },
        testnet: {
          url: testnetUrl
        }
      }}
      defaultNetwork="mainnet"
      enableUnsafeBurner={false}
    >
      <AppContent />
    </Provider>
  )
}

export default App

