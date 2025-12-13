import { useState } from 'react'
import { WalletProvider, useWalletKit } from '@mysten/wallet-kit'
import { TransactionBlock } from '@mysten/sui.js'
import './App.css'

function AppContent() {
  const { currentWallet, currentAccount, connect, disconnect, signAndExecuteTransactionBlock } = useWalletKit()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [uri, setUri] = useState('')
  const [loading, setLoading] = useState(false)
  const [txDigest, setTxDigest] = useState<string | null>(null)
  const [packageId, setPackageId] = useState('')

  const handleConnect = async () => {
    try {
      await connect()
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  const handleDisconnect = () => {
    disconnect()
    setTxDigest(null)
  }

  const handleMint = async () => {
    if (!currentAccount || !packageId) {
      alert('Por favor, conecte sua wallet e configure o Package ID')
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
        target: `${packageId}::nft::mint`,
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
          
          <div className="input-group">
            <label>Package ID (deploy do contrato):</label>
            <input
              type="text"
              value={packageId}
              onChange={(e) => setPackageId(e.target.value)}
              placeholder="0x..."
            />
          </div>

          <div className="input-group">
            <label>Nome do NFT:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Meu NFT"
            />
          </div>

          <div className="input-group">
            <label>Descrição:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição do NFT"
            />
          </div>

          <div className="input-group">
            <label>URI (link da imagem):</label>
            <input
              type="text"
              value={uri}
              onChange={(e) => setUri(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <button 
            onClick={handleMint} 
            disabled={loading || !packageId}
            className="mint-button"
          >
            {loading ? 'Mintando...' : 'Mintar NFT'}
          </button>

          {txDigest && (
            <div className="success-message">
              <p>✅ Transação enviada com sucesso!</p>
              <p>Digest: {txDigest}</p>
              <a 
                href={`https://suiexplorer.com/txblock/${txDigest}?network=testnet`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver no Explorer
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
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  )
}

export default App

