 
//import React from "react";
import { ThirdwebProvider } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { ConnectButton} from "thirdweb/react";
import { TransactionButton} from "thirdweb/react";
import { inAppWallet, createWallet,} from "thirdweb/wallets";
import  {client} from "../thirdwebClient";
import { getContract} from "thirdweb";
import {
  useSendTransaction,
  useActiveWallet,
  useActiveWalletChain,
} from "thirdweb/react";
import {
  prepareContractCall,
  toWei,
} from "thirdweb";
import { useState } from "react";
import { useEffect } from "react";



//const CONTRACT_ADDRESS = "0x90219c28b519078cfdce01af729407b20f985009";
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


const wallet1 = createWallet("io.metamask"); // typ: Wallet<"io.metamask">
const account = wallet1.getAccount();

const wallets = [
  inAppWallet({
    auth: {
      options: [
        "google",
        "discord",
        "telegram",
        "farcaster",
        "email",
        "x",
        "passkey",
        "phone",
      ],
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
];

export default function ConnectWallet() {
  const wallet = useActiveWallet();
  useEffect(() => {
    if (wallet) {
      // Zapisz wallet do globalnego okna
      (window as any).connectedWallet = wallet;
      (window as any).walletAddress = wallet.getAccount()?.address;

      console.log("Wallet zapisany globalnie:", wallet.getAccount()?.address);
    }
  }, [wallet]);
  const chain = useActiveWalletChain();
  const { mutateAsync: sendTransaction, isPending } = useSendTransaction();
  const [status, setStatus] = useState<string | null>(null);

  const handleBuy = async () => {
    if (!wallet || !chain) {
      console.log("Portfel niepodłączony");
      setStatus("❌ Portfel niepodłączony");
      return;
    }

    try {
      console.log("Wysyłam transakcję...");
      setStatus("⏳ Wysyłam transakcję...");

      const prepared = prepareContractCall({
        contract: {
          address: CONTRACT_ADDRESS,
          abi: ABI as any,
          client,
          chain,
        },
        method: "buyCard",
        value: BigInt("10000000000000000"), // dokładnie 0.01 ETH/PEPU
      });              

      await sendTransaction(prepared);

      setStatus("✅ Zdrapka kupiona!");
    } catch (err: any) {
      console.error(err);
      setStatus("❌ Błąd: " + (err.message || "nieznany"));
    }
  };
  // <<< TO DODAJ
(window as any).handleBuy = handleBuy;
window.dispatchEvent(new CustomEvent("handleBuyReady"));

  return (
    <div>
      <ConnectButton
        client={client}
        wallets={wallets}
        connectModal={{ size: "compact" }}
        onConnect={(wallet) => {
          console.log("connected to", wallet);
          console.log("connected to", wallet.getAccount());
        }}
        onDisconnect={({ wallet, account }) => {
          console.log("disconnected", wallet, account);
        }}
      />

      <div>
        <button onClick={handleBuy} disabled={!wallet || isPending}>
          {isPending ? "Kupuję..." : "Kup zdrapkę (0.01 PEPU)"}
        </button>
        {status && <p>{status}</p>}
      </div>
    </div>
  );
}

