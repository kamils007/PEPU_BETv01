// src/WalletButton.tsx
import { ConnectWallet } from "@thirdweb-dev/react";

export default function WalletButton() {
  return (
    <div style={{ position: "absolute", top: "1rem", right: "1rem", zIndex: 999 }}>
      <ConnectWallet />
    </div>
  );
}
