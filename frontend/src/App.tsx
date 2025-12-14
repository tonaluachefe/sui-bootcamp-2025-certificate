import { useState, useRef, useEffect } from 'react'
import { WalletKitProvider, useWalletKit, ConnectButton } from '@mysten/wallet-kit'
// @ts-ignore - imports da versão 0.17.0
import * as sui from '@mysten/sui.js'
import './App.css'

// Acessa TransactionBlock e getFullnodeUrl do módulo
// Na versão 0.17.0, TransactionBlock pode estar em diferentes lugares
// @ts-ignore
let TransactionBlock: any = null
// @ts-ignore
let getFullnodeUrlFn: any = null

// Tenta diferentes formas de acessar
if (sui.TransactionBlock) {
  TransactionBlock = sui.TransactionBlock
} else if ((sui as any).default?.TransactionBlock) {
  TransactionBlock = (sui as any).default.TransactionBlock
} else if (typeof (sui as any).Transaction === 'function') {
  // Algumas versões usam Transaction
  TransactionBlock = (sui as any).Transaction
}

if (sui.getFullnodeUrl) {
  getFullnodeUrlFn = sui.getFullnodeUrl
} else if ((sui as any).default?.getFullnodeUrl) {
  getFullnodeUrlFn = (sui as any).default.getFullnodeUrl
}

// Log para debug - busca mais agressiva
const suiKeys = Object.keys(sui)
console.log('🔍 Total de chaves em @mysten/sui.js:', suiKeys.length)
console.log('📋 Primeiras 30 chaves:', suiKeys.slice(0, 30))

if (!TransactionBlock) {
  console.error('❌ TransactionBlock não encontrado nas formas padrão')
  // Busca por qualquer coisa relacionada a transaction
  const transactionKeys = suiKeys.filter(k => 
    k.toLowerCase().includes('transaction') || 
    k.toLowerCase().includes('tx') ||
    k.toLowerCase().includes('block')
  )
  console.log('🔎 Chaves relacionadas a transaction/tx/block:', transactionKeys)
  
  // Tenta acessar cada uma
  for (const key of transactionKeys) {
    const value = (sui as any)[key]
    console.log(`  - ${key}:`, typeof value, value)
    if (typeof value === 'function' || (typeof value === 'object' && value !== null)) {
      // Tenta ver se tem construtor
      if (value.prototype || (typeof value === 'function' && value.length >= 0)) {
        console.log(`    ⚠️  Tentando usar ${key} como TransactionBlock`)
        TransactionBlock = value
        break
      }
    }
  }
}

if (!TransactionBlock) {
  console.error('❌ TransactionBlock ainda não encontrado após busca agressiva')
  console.log('🔍 Objeto sui completo:', sui)
}

if (!getFullnodeUrlFn) {
  console.error('getFullnodeUrl não encontrado em @mysten/sui.js')
}

const getFullnodeUrl = getFullnodeUrlFn || ((network: string) => {
  if (network === 'mainnet') return 'https://fullnode.mainnet.sui.io:443'
  return 'https://fullnode.testnet.sui.io:443'
})

// Package IDs dos contratos
const MAINNET_PACKAGE_ID = '0x1c0ce5438a6797bd9cbdda86bfcc1bc8ecabd2103c5ac953ab3898cb38828b89'
const TESTNET_PACKAGE_ID = '0x5292e8182c0b8904362a8b48e166330cc20bfd5043c1ea4b5b4c3d2975eae40b'

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
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [loading, setLoading] = useState(false)
  const [txDigest, setTxDigest] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      const availableWallets = wallets.filter(w => w.installed)
      
      if (availableWallets.length === 0) {
        alert(t.pleaseConnect + ' - Nenhuma wallet instalada. Por favor, instale Suiet ou Sui Wallet.')
        return
      }

      // Se houver apenas uma wallet, conecta diretamente
      if (availableWallets.length === 1) {
        await connect(availableWallets[0].name)
        return
      }

      // Se houver múltiplas wallets, tenta usar a função connect() sem parâmetros
      // que deve abrir o modal de seleção
      // @ts-ignore - connect pode não ter tipagem completa
      if (typeof connect === 'function') {
        await connect()
      } else {
        // Fallback: conecta com a primeira disponível
        await connect(availableWallets[0].name)
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

  const handleImageUpload = async (file: File) => {
    // Validar tamanho (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert(t.imageTooBig)
      return
    }

    setUploadingImage(true)
    
    try {
      // Criar preview
      const preview = URL.createObjectURL(file)
      setImagePreview(preview)
      setImageFile(file)
      
      // Converter para base64 para usar como URI
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setUri(base64String)
        setUploadingImage(false)
      }
      reader.onerror = () => {
        alert('Erro ao processar imagem')
        setUploadingImage(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error reading file:', error)
      alert('Erro ao processar imagem')
      setUploadingImage(false)
    }
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

    setLoading(true)
    setTxDigest(null)

    try {
      if (!TransactionBlock || typeof TransactionBlock !== 'function') {
        console.error('TransactionBlock não disponível:', TransactionBlock)
        console.log('Verificando módulo sui:', Object.keys(sui))
        throw new Error('TransactionBlock não está disponível. Por favor, recarregue a página ou verifique o console para mais detalhes.')
      }

      console.log('✅ TransactionBlock encontrado, criando instância...')
      let txb: any
      
      try {
        txb = new TransactionBlock()
        console.log('✅ Instância criada:', txb)
        console.log('🔍 Métodos disponíveis:', Object.keys(txb))
      } catch (error) {
        console.error('❌ Erro ao criar TransactionBlock:', error)
        throw new Error(`Erro ao criar TransactionBlock: ${error}`)
      }
      
      // Verifica se tem os métodos necessários
      if (!txb) {
        throw new Error('TransactionBlock é null ou undefined após criação')
      }

      // Se só tem provider, o TransactionBlock pode ser usado diretamente mas precisa acessar métodos de forma diferente
      // Na versão 0.17.0, pode ser que o objeto seja diferente
      if (txb.provider && !txb.moveCall) {
        console.log('🔍 TransactionBlock tem provider, verificando estrutura...')
        console.log('📋 Provider tem:', Object.keys(txb.provider))
        
        // Pode ser que moveCall esteja dentro do provider ou que seja uma API diferente
        // Vamos tentar usar o objeto diretamente mesmo assim - o wallet-kit pode aceitar
        // Vamos construir manualmente usando o formato que o wallet-kit espera
      }
      
      // Tenta usar moveCall se existir
      if (typeof txb.moveCall === 'function') {
        console.log('✅ Usando moveCall diretamente...')
        txb.moveCall({
          target: `${packageId}::nft::mint`,
          arguments: [
            txb.pure.string(name),
            txb.pure.string(description),
            txb.pure.string(uri),
          ],
        })
      } else {
        // Se não tem moveCall, pode ser que na versão 0.17.0 a API seja diferente
        // Vamos tentar usar call ou outra forma
        console.log('⚠️ moveCall não encontrado, tentando abordagem alternativa...')
        
        // Tenta usar como objeto de configuração direto para o wallet-kit
        // O wallet-kit pode aceitar um objeto com a estrutura da transação
        const txConfig = {
          kind: 'moveCall' as const,
          data: {
            packageObjectId: packageId.split('::')[0],
            module: 'nft',
            function: 'mint',
            arguments: [name, description, uri],
            typeArguments: [],
          },
        }
        
        // Atribui ao txb de forma que o wallet-kit entenda
        ;(txb as any).transactions = [txConfig]
        ;(txb as any).moveCall = function(config: any) {
          if (!this.transactions) this.transactions = []
          this.transactions.push({
            kind: 'moveCall',
            data: config,
          })
        }
        
        // Agora tenta usar moveCall
        txb.moveCall({
          target: `${packageId}::nft::mint`,
          arguments: [
            name,
            description,
            uri,
          ],
        })
      }

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
      setImagePreview('')
      setImageFile(null)
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
            <ConnectButton className="connect-button" />
            {/* Botão customizado como fallback */}
            <button onClick={handleConnect} style={{ marginTop: '1rem' }}>{t.connectButton}</button>
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
            <label>{t.imageNFT}</label>
            <div className="image-upload-section">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImageUpload(file)
                }}
                style={{ display: 'none' }}
              />
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="upload-button"
                disabled={uploadingImage}
              >
                {uploadingImage ? t.loading : imagePreview ? t.changeImage : t.chooseImage}
              </button>
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <button 
                    type="button"
                    onClick={() => {
                      setImagePreview('')
                      setImageFile(null)
                      setUri('')
                    }}
                    className="remove-image"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
            <p className="hint">{t.orPasteUrl}</p>
          </div>

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
            disabled={loading || uploadingImage || !name || !description || !uri}
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
  // Fallback URLs caso getFullnodeUrl não funcione
  const mainnetUrl = getFullnodeUrl ? getFullnodeUrl('mainnet') : 'https://fullnode.mainnet.sui.io:443'
  const testnetUrl = getFullnodeUrl ? getFullnodeUrl('testnet') : 'https://fullnode.testnet.sui.io:443'
  
  return (
    <WalletKitProvider 
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
    </WalletKitProvider>
  )
}

export default App

