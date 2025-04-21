 
//import React from "react";
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

export default function ConnectWallet() {
  return (
    <ThirdwebProvider>
      <div>
    <ConnectButton
      client={client}
      wallets={wallets}
      connectModal={{ size: "compact" }}
      onConnect={(wallet) => {
          console.log("connected to", wallet)
          console.log("connected to",wallet.getAccount())
        }}
          onDisconnect={({ wallet, account }) => {
            console.log("disconnected", wallet, account)
         }}
         />
         </div>
         <div>
      <button >
     
      </button>
      
    </div>


      </ThirdwebProvider>
  );
}
