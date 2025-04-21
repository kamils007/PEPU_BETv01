import {createThirdwebClient,prepareContractCall,sendTransaction,toWei} from "thirdweb";
//import {getActiveAccount,getWalletChain} from "thirdweb";
import { getActiveAccount } from "thirdweb"; // ← nie "thirdweb/wallets"

  
  const client = createThirdwebClient({
clientId: "twój-client-id", // lub pusta konfiguracja, jeśli nie używasz
  });
  
  const CONTRACT_ADDRESS = "0xa71Bbf9F1073b7544bCc232Afc423c2D3c261ABC";
  
  const ABI = [
    {
      name: "buyCard",
      type: "function",
      stateMutability: "payable",
      inputs: [],
      outputs: [],
    },
  ] as const;
  
  export async function buyCardSimple() {
    const account = getActiveAccount({ client });
    const chain = await getWalletChain({ client });
  
    if (!account || !chain) {
      alert("❌ Portfel niepodłączony!");
      return;
    }
  
    try {
      const tx = prepareContractCall({
        contract: {
          address: CONTRACT_ADDRESS,
          abi: ABI,
          client,
          chain,
        },
        method: "buyCard",
        value: BigInt("10000000000000000"), // 0.01 PEPU
      });
  
      await sendTransaction({ transaction: tx, account });
      alert("✅ Zdrapka kupiona!");
    } catch (err: any) {
      console.error(err);
      alert("❌ Błąd: " + (err?.message || "Unknown error"));
    }
  }
  