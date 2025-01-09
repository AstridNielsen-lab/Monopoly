export interface Player {
  id: number;
  name: string;
  position: number;
  money: number;
  properties: number[];
  inJail: boolean;
  jailTurns: number;
  color: string;
  doublesCount: number;
}

export interface Property {
  id: number;
  name: string;
  price: number;
  rent: number[];
  color: string | null;
  houses: number;
  owner: number | null;
  mortgaged: boolean;
  type: 'property' | 'railroad' | 'utility' | 'chance' | 'chest' | 'tax' | 'corner';
}

export interface GameLog {
  message: string;
  timestamp: string;
}

export interface GameState {
  players: Player[];
  currentPlayer: number;
  properties: Property[];
  dice: number[];
  isRolling: boolean;
  gameLog: GameLog[];
  canBuy: boolean;
  canRoll: boolean;
}