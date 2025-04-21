import {
  useSendTransaction,
  useActiveWallet,
  useActiveWalletChain,
} from "thirdweb/react";
import { toWei} from "thirdweb";
import { useState } from "react";

import { ThirdwebProvider } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { ConnectButton} from "thirdweb/react";
import { TransactionButton} from "thirdweb/react";
import { inAppWallet, createWallet,} from "thirdweb/wallets";
import { client } from "../thirdwebClient";
import { getContract, prepareContractCall } from "thirdweb";

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

const CONTRACT_ADDRESS = "0x90219c28b519078cfdce01af729407b20f985009";

const ABI = [
  {
    name: "buyCard",
    type: "function",
    stateMutability: "payable",
    inputs: [],
    outputs: [],
  },
] as const;

export default function ConnectWallet() {
  const wallet = useActiveWallet();
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
        value: toWei("0.01"),
      });

      await sendTransaction(prepared);

      setStatus("✅ Zdrapka kupiona!");
    } catch (err: any) {
      console.error(err);
      setStatus("❌ Błąd: " + (err.message || "nieznany"));
    }
  };

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
