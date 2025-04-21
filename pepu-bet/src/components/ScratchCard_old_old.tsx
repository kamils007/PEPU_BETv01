import { ActiveAccount, ThirdwebClient } from "thirdweb";

interface ScratchCardProps {
  client: ThirdwebClient;
  account: ActiveAccount | null;
  index: number;
  label: string;
  topLine: string;
  bottomLine: string;
  tweenGroup: Group;
}

export default function ScratchCard({
  client,
  account,
  index,
  label,
  topLine,
  bottomLine,
  tweenGroup,
}: ScratchCardProps) {
  return (
    <div className="scratch-card">
      <h3>Zdrapka #{index}</h3>
      <p>{label}</p>
      <p>{topLine}</p>
      <p>{bottomLine}</p>
      {account ? (
        <p>👤 {account.address.slice(0, 6)}...{account.address.slice(-4)}</p>
      ) : (
        <p>🔒 Połącz portfel</p>
      )}
    </div>
  );
}
