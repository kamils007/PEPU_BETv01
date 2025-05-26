import { useActiveAccount } from "thirdweb/react";
import { useActiveWallet } from "thirdweb/react";
import { ThirdwebClient } from "thirdweb";
import { useEffect, useState } from "react";
import { Group } from "@tweenjs/tween.js";

interface ScratchCardProps {
  client: ThirdwebClient;
  index: number;
  label: string;
  topLine: string;
  bottomLine: string;
  tweenGroup: Group;
}

export default function ScratchCard({
  client,
  index,
  label,
  topLine,
  bottomLine,
}: ScratchCardProps) {
  const wallet = useActiveWallet();
  const account = useActiveAccount();
  console.log("address", account?.address);
  console.log("address", wallet?.id);
  const isConnected = !!account;

  const [isBought, setIsBought] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);

  useEffect(() => {
    console.log("Active account:", account);
  }, [account]);

  const handleBuy = () => {
    if (!isConnected) return;
    setIsBought(true);
    const win = Math.random() < 0.3;
    setIsWinner(win);
  };

  const handleClaim = () => {
    setIsClaimed(true);
    console.log("🎉 Reward claimed!");
  };

  return (
    <div
      className="mainContainer"
      style={{
        backgroundColor: `rgba(0,127,127,${Math.random() * 0.5 + 0.25})`,
        width: "100%",
      }}
    >
      <button style={{ display: "none" }}>RESET</button>

      <div className="communicationArea">
        <p>
          {isBought
            ? isWinner
              ? isClaimed
                ? "Reward claimed 🎉"
                : "You won!"
              : "Not a winning ticket."
            : "Welcome!"}
        </p>
      </div>

      <div className="squareScratch">
        {Array.from({ length: 9 }).map((_, idx) => (
          <div key={idx} className="scratchContainer">
            <canvas className="symbolCanvas" width={10} height={10}></canvas>
            <canvas className="scratchCanvas"></canvas>
          </div>
        ))}
      </div>

      <div className="symbol">{label}</div>
      <div className="details">
        {topLine}
        <br />
        {bottomLine}
      </div>
      <div className="number">{index}</div>

      {!isBought && (
        <button onClick={handleBuy} disabled={!isConnected}>
          {isConnected ? "Buy Scratch" : "Connect your wallet"}
        </button>
      )}

      {isBought && isWinner && !isClaimed && (
        <button onClick={handleClaim}>Claim Reward</button>
      )}
    </div>
  );
}
