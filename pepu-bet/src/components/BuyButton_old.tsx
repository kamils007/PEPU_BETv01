import { useActiveAccount } from "thirdweb/react";
import { useState } from "react";

export default function BuyButton1() {
  const account = useActiveAccount();
  const isConnected = !!account;

  const [isBought, setIsBought] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);

  const handleBuy = () => {
    if (!isConnected) return;
    setIsBought(true);
    const win = Math.random() < 0.3; // 30% szans na wygraną
    setIsWinner(win);
  };

  const handleClaim = () => {
    setIsClaimed(true);
    console.log("🎉 Reward claimed!");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
      {!isBought && (
        <button onClick={handleBuy} disabled={!isConnected}>
          {isConnected ? "Buy Scratch" : "Connect your wallet"}
        </button>
      )}

      {isBought && isWinner && !isClaimed && (
        <button onClick={handleClaim}>Claim Reward</button>
      )}

      {isBought && !isWinner && <p style={{ margin: 0 }}>Not a winning ticket.</p>}
      {isClaimed && <p style={{ margin: 0 }}>Reward claimed 🎉</p>}
    </div>
  );
}
