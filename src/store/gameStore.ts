import { create } from 'zustand';
import { GameState, Player, Property } from '../types/game';
import { INITIAL_PROPERTIES } from '../data/properties';

interface GameStore extends GameState {
  addPlayer: (name: string) => void;
  rollDice: () => void;
  movePlayer: (spaces: number) => void;
  buyProperty: () => void;
  payRent: () => void;
  endTurn: () => void;
  handleSpecialSpace: () => void;
  addGameLog: (message: string) => void;
}

const INITIAL_MONEY = 1500;
const SALARY = 200; // Dinheiro recebido ao passar pelo GO

export const useGameStore = create<GameStore>((set, get) => ({
  players: [],
  currentPlayer: 0,
  properties: INITIAL_PROPERTIES,
  dice: [1, 1],
  isRolling: false,
  gameLog: [],
  canBuy: false,
  canRoll: true,

  addGameLog: (message: string) => {
    set((state) => ({
      gameLog: [...state.gameLog, { message, timestamp: new Date().toISOString() }]
    }));
  },

  addPlayer: (name: string) => {
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    set((state) => ({
      players: [
        ...state.players,
        {
          id: state.players.length,
          name,
          position: 0,
          money: INITIAL_MONEY,
          properties: [],
          inJail: false,
          jailTurns: 0,
          color: colors[state.players.length % colors.length],
        },
      ],
    }));
  },

  rollDice: () => {
    const state = get();
    if (!state.canRoll) return;

    set({ isRolling: true, canRoll: false });
    
    setTimeout(() => {
      const dice = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];
      const player = state.players[state.currentPlayer];
      const totalSpaces = dice[0] + dice[1];
      
      set({ dice, isRolling: false });
      
      // Verificar se está na prisão
      if (player.inJail) {
        if (dice[0] === dice[1]) {
          // Saiu da prisão com dados iguais
          set((state) => {
            const players = [...state.players];
            players[state.currentPlayer].inJail = false;
            players[state.currentPlayer].jailTurns = 0;
            return { players };
          });
          get().addGameLog(`${player.name} tirou dados iguais e saiu da prisão!`);
          get().movePlayer(totalSpaces);
        } else {
          set((state) => {
            const players = [...state.players];
            players[state.currentPlayer].jailTurns++;
            if (players[state.currentPlayer].jailTurns >= 3) {
              // Paga $50 e sai da prisão após 3 turnos
              players[state.currentPlayer].money -= 50;
              players[state.currentPlayer].inJail = false;
              players[state.currentPlayer].jailTurns = 0;
              get().addGameLog(`${player.name} pagou $50 e saiu da prisão!`);
              get().movePlayer(totalSpaces);
            } else {
              get().addGameLog(`${player.name} continua na prisão.`);
              get().endTurn();
            }
            return { players };
          });
        }
      } else {
        get().movePlayer(totalSpaces);
      }
    }, 1000);
  },

  movePlayer: (spaces: number) => {
    set((state) => {
      const players = [...state.players];
      const player = players[state.currentPlayer];
      const oldPosition = player.position;
      
      // Calcula nova posição
      player.position = (player.position + spaces) % 40;
      
      // Verifica se passou pelo GO
      if (player.position < oldPosition) {
        player.money += SALARY;
        get().addGameLog(`${player.name} passou pelo GO e recebeu $${SALARY}!`);
      }

      get().addGameLog(`${player.name} moveu ${spaces} casas.`);
      
      // Processa a casa atual
      get().handleSpecialSpace();
      
      return { players };
    });
  },

  handleSpecialSpace: () => {
    const state = get();
    const player = state.players[state.currentPlayer];
    const property = state.properties[player.position];

    switch (property.type) {
      case 'property':
      case 'railroad':
      case 'utility':
        if (property.owner === null) {
          if (player.money >= property.price) {
            set({ canBuy: true });
            get().addGameLog(`${player.name} pode comprar ${property.name} por $${property.price}.`);
          }
        } else if (property.owner !== player.id && !property.mortgaged) {
          get().payRent();
        }
        break;

      case 'tax':
        const taxAmount = property.rent[0];
        set((state) => {
          const players = [...state.players];
          players[state.currentPlayer].money -= taxAmount;
          return { players };
        });
        get().addGameLog(`${player.name} pagou $${taxAmount} de taxa.`);
        break;

      case 'corner':
        if (property.name === "Go To Jail") {
          set((state) => {
            const players = [...state.players];
            players[state.currentPlayer].position = 10; // Posição da prisão
            players[state.currentPlayer].inJail = true;
            return { players };
          });
          get().addGameLog(`${player.name} foi para a prisão!`);
        }
        break;
    }
  },

  buyProperty: () => {
    const state = get();
    const player = state.players[state.currentPlayer];
    const property = state.properties[player.position];

    if (player.money >= property.price) {
      set((state) => {
        const properties = [...state.properties];
        const players = [...state.players];
        
        properties[player.position].owner = player.id;
        players[state.currentPlayer].money -= property.price;
        players[state.currentPlayer].properties.push(property.id);
        
        return { properties, players, canBuy: false };
      });
      
      get().addGameLog(`${player.name} comprou ${property.name} por $${property.price}!`);
    }
  },

  payRent: () => {
    const state = get();
    const player = state.players[state.currentPlayer];
    const property = state.properties[player.position];
    const owner = state.players[property.owner!];
    
    let rentAmount = property.rent[property.houses];
    
    // Regras especiais para ferrovias e utilidades
    if (property.type === 'railroad') {
      const railroadsOwned = owner.properties.filter(
        (id) => state.properties[id].type === 'railroad'
      ).length;
      rentAmount = property.rent[railroadsOwned - 1];
    } else if (property.type === 'utility') {
      const utilitiesOwned = owner.properties.filter(
        (id) => state.properties[id].type === 'utility'
      ).length;
      const diceSum = state.dice[0] + state.dice[1];
      rentAmount = property.rent[utilitiesOwned - 1] * diceSum;
    }

    set((state) => {
      const players = [...state.players];
      players[state.currentPlayer].money -= rentAmount;
      players[property.owner!].money += rentAmount;
      return { players };
    });

    get().addGameLog(
      `${player.name} pagou $${rentAmount} de aluguel para ${owner.name}!`
    );
  },

  endTurn: () => {
    set((state) => ({
      currentPlayer: (state.currentPlayer + 1) % state.players.length,
      canRoll: true,
      canBuy: false
    }));
    
    const nextPlayer = get().players[get().currentPlayer];
    get().addGameLog(`Vez de ${nextPlayer.name}!`);
  }
}));