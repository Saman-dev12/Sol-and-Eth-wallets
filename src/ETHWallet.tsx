import { useState } from "react"

const ETHWallet = ({mnemonic}:{mnemonic:string}) => {
    const [publicKeys,setPublicKeys] = useState<string[]>([])
    const generateETHWallet = () => {
        
    }
  return (
    <>
      <button onClick={generateETHWallet}>Generate ETH Wallet</button>
    </>
  )
}

export default ETHWallet
