export interface MyScratchCard {
    id: number;
    isWinner: boolean;
    claimed: boolean;
    domElement?: HTMLElement;
  }
  
  export const myScratchCards: MyScratchCard[] = [];