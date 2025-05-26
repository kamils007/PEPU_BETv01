 
import {
  createThirdwebClient,
  getContract,
  resolveMethod,
} from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { ThirdwebProvider } from "thirdweb/react";
import {useWalletInfo} from "thirdweb/react";


export const client = createThirdwebClient({
  clientId: "07274d2346a8f9b04417a19ed53cdfca",
});


// connect to your contract
export const contract = getContract({
  client,
  chain: defineChain(3409),
  address: "0x10b529c456623b44797FA715BeDe138f6892F210",
});

// export function App() {
//   return (
//     <ThirdwebProvider>
//       <Component />
//     </ThirdwebProvider>
//   );
// }

