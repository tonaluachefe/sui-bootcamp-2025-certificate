import { useState, useRef } from 'react'
import { WalletKitProvider, useWalletKit } from '@mysten/wallet-kit'
import { TransactionBlock, getFullnodeUrl } from './sui-helper'
import './App.css'

// Package ID do contrato na mainnet
const MAINNET_PACKAGE_ID = '0x1c0ce5438a6797bd9cbdda86bfcc1bc8ecabd2103c5ac953ab3898cb38828b89'

function AppContent() {
  const { currentAccount, connect, disconnect, signAndExecuteTransactionBlock, isConnected } = useWalletKit()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [uri, setUri] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [loading, setLoading] = useState(false)
  const [txDigest, setTxDigest] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleConnect = async () => {
    try {
      // Wallet Kit will automatically show a modal to select wallet
      // @ts-ignore - connect can be called without args in wallet-kit
      const result = await connect()
      console.log('Connect result:', result)
    } catch (error: any) {
      console.error('Failed to connect wallet:', error)
      alert(`Erro ao conectar wallet: ${error?.message || 'Certifique-se de que uma wallet está instalada.'}`)
    }
  }

  const handleDisconnect = () => {
    disconnect()
    setTxDigest(null)
  }

  const handleImageUpload = async (file: File) => {
    // Validar tamanho (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Imagem muito grande! Por favor, use uma imagem menor que 5MB.')
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
      alert('Por favor, conecte sua wallet')
      return
    }

    if (!name || !description || !uri) {
      alert('Por favor, preencha todos os campos')
      return
    }

    setLoading(true)
    setTxDigest(null)

    try {
      const txb = new TransactionBlock()
      
      txb.moveCall({
        target: `${MAINNET_PACKAGE_ID}::nft::mint`,
        arguments: [
          txb.pure.string(name),
          txb.pure.string(description),
          txb.pure.string(uri),
        ],
      })

      const result = await signAndExecuteTransactionBlock({
        transactionBlock: txb,
      })

      setTxDigest(result.digest)
      alert('NFT mintado com sucesso!')
      
      // Limpar campos
      setName('')
      setDescription('')
      setUri('')
      setImagePreview('')
      setImageFile(null)
    } catch (error: any) {
      console.error('Failed to mint NFT:', error)
      alert(`Erro ao mintar NFT: ${error.message || 'Erro desconhecido'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <h1>🎨 Sui NFT Dapp</h1>
      
      <div className="wallet-section">
        {!currentAccount ? (
          <div>
            <p>Conecte sua wallet para começar</p>
            <button onClick={handleConnect}>Conectar Wallet</button>
          </div>
        ) : (
          <div>
            <p>✅ Wallet conectada</p>
            <p className="address">Endereço: {currentAccount.address}</p>
            <button onClick={handleDisconnect}>Desconectar</button>
          </div>
        )}
      </div>

      {currentAccount && (
        <div className="mint-section">
          <h2>Mintar NFT</h2>
          <p className="network-badge">🌐 Mainnet</p>
          
          <div className="input-group">
            <label>📷 Imagem do NFT:</label>
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
                {uploadingImage ? 'Carregando...' : imagePreview ? 'Trocar Imagem' : '📤 Escolher Imagem'}
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
            <p className="hint">Ou cole uma URL de imagem abaixo</p>
          </div>

          <div className="input-group">
            <label>🔗 URL da Imagem (alternativo):</label>
            <input
              type="text"
              value={uri}
              onChange={(e) => setUri(e.target.value)}
              placeholder="https://... ou deixe em branco se já fez upload acima"
            />
          </div>

          <div className="input-group">
            <label>📝 Nome do NFT:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Meu NFT #1"
              required
            />
          </div>

          <div className="input-group">
            <label>📄 Descrição:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição detalhada do NFT"
              required
            />
          </div>

          <button 
            onClick={handleMint} 
            disabled={loading || uploadingImage || !name || !description || !uri}
            className="mint-button"
          >
            {loading ? '⏳ Mintando na Mainnet...' : '✨ Mintar NFT'}
          </button>

          {txDigest && (
            <div className="success-message">
              <p>✅ Transação enviada com sucesso!</p>
              <p>Digest: {txDigest}</p>
              <a 
                href={`https://suiexplorer.com/txblock/${txDigest}?network=mainnet`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver no Explorer (Mainnet)
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function App() {
  return (
    <WalletKitProvider 
      networks={[
        {
          name: 'mainnet',
          url: getFullnodeUrl('mainnet')
        }
      ]}
      defaultNetwork="mainnet"
    >
      <AppContent />
    </WalletKitProvider>
  )
}

export default App

