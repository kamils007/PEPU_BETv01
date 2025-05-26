//import React from "react";
import { ThirdwebProvider } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";
import { inAppWallet, createWallet } from "thirdweb/wallets";
import { client } from "../thirdwebClient";
import {
  useSendTransaction,
  useActiveWallet,
  useActiveWalletChain,
} from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import { useState, useEffect } from "react";

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
  const chain = useActiveWalletChain();
  const { mutateAsync: sendTransaction, isPending } = useSendTransaction();
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (wallet && chain) {
      (window as any).connectedWallet = wallet;
      (window as any).connectedWalletChain = chain;
      (window as any).walletAddress = wallet.getAccount()?.address;

      console.log("Wallet zapisany globalnie:", wallet.getAccount()?.address);
    }
  }, [wallet, chain]);

  // Zamiast przypisywać całą funkcję handleBuy, przypisujemy dynamiczny wrapper
  (window as any).handleBuy = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    const currentWallet = (window as any).connectedWallet;
    const currentChain = (window as any).connectedWalletChain;
  
    if (!currentWallet || !currentChain) {
      console.log("Portfel niepodłączony");
      onError?.();
      return;
    }
  
    try {
      console.log("Wysyłam transakcję...");
  
      const prepared = prepareContractCall({
        contract: {
          address: CONTRACT_ADDRESS,
          abi: ABI as any,
          client,
          chain: currentChain,
        },
        method: "buyCard",
        value: BigInt("10000000000000000"),
      });
  
      await sendTransaction(prepared);
  
      console.log(`✅ Zdrapka #${id} kupiona!`);
      onSuccess?.();
    } catch (err: any) {
      console.error("❌ Błąd:", err.message || err);
      onError?.();
    }
  };
  

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
        <button onClick={() => (window as any).handleBuy?.(999)} disabled={!wallet || isPending}>
          {isPending ? "Kupuję..." : "Kup zdrapkę (0.01 PEPU)"}
        </button>
        {status && <p>{status}</p>}
      </div>
    </div>
  );
}