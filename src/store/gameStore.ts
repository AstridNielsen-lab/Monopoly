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
  checkGameOver: () => void;
}

const INITIAL_MONEY = 1500;
const SALARY = 200;
const JAIL_FINE = 50;

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
      gameLog: [{ message, timestamp: new Date().toISOString() }, ...state.gameLog]
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
          doublesCount: 0,
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
      const isDoubles = dice[0] === dice[1];
      
      set({ dice, isRolling: false });
      
      if (player.inJail) {
        if (isDoubles) {
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
              players[state.currentPlayer].money -= JAIL_FINE;
              players[state.currentPlayer].inJail = false;
              players[state.currentPlayer].jailTurns = 0;
              get().addGameLog(`${player.name} pagou $${JAIL_FINE} e saiu da prisão!`);
              get().movePlayer(totalSpaces);
            } else {
              get().addGameLog(`${player.name} continua na prisão. (Tentativa ${players[state.currentPlayer].jailTurns}/3)`);
              get().endTurn();
            }
            return { players };
          });
        }
      } else {
        // Atualiza o contador de dados iguais
        set((state) => {
          const players = [...state.players];
          if (isDoubles) {
            players[state.currentPlayer].doublesCount++;
            if (players[state.currentPlayer].doublesCount === 3) {
              // Três dados iguais seguidos = vai para a prisão
              players[state.currentPlayer].position = 10;
              players[state.currentPlayer].inJail = true;
              players[state.currentPlayer].doublesCount = 0;
              get().addGameLog(`${player.name} tirou dados iguais 3 vezes seguidas e foi para a prisão!`);
              return { players, canRoll: false };
            }
          } else {
            players[state.currentPlayer].doublesCount = 0;
          }
          return { players };
        });

        get().movePlayer(totalSpaces);

        // Se não tirou dados iguais ou está na prisão, termina o turno
        if (!isDoubles || player.inJail) {
          setTimeout(() => get().endTurn(), 1000);
        } else {
          set({ canRoll: true });
          get().addGameLog(`${player.name} tirou dados iguais e joga novamente!`);
        }
      }
    }, 1000);
  },

  movePlayer: (spaces: number) => {
    set((state) => {
      const players = [...state.players];
      const player = players[state.currentPlayer];
      const oldPosition = player.position;
      
      player.position = (player.position + spaces) % 40;
      
      if (player.position < oldPosition) {
        player.money += SALARY;
        get().addGameLog(`${player.name} passou pelo GO e recebeu $${SALARY}!`);
      }

      get().addGameLog(`${player.name} moveu ${spaces} casas para ${state.properties[player.position].name}.`);
      get().handleSpecialSpace();
      get().checkGameOver();
      
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
        get().checkGameOver();
        break;

      case 'corner':
        if (property.name === "Go To Jail") {
          set((state) => {
            const players = [...state.players];
            players[state.currentPlayer].position = 10;
            players[state.currentPlayer].inJail = true;
            players[state.currentPlayer].doublesCount = 0;
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
    
    if (property.type === 'railroad') {
      const railroadsOwned = state.properties.filter(
        (p) => p.type === 'railroad' && p.owner === owner.id
      ).length;
      rentAmount = property.rent[railroadsOwned - 1];
    } else if (property.type === 'utility') {
      const utilitiesOwned = state.properties.filter(
        (p) => p.type === 'utility' && p.owner === owner.id
      ).length;
      const diceSum = state.dice[0] + state.dice[1];
      rentAmount = property.rent[utilitiesOwned - 1] * diceSum;
    } else if (property.type === 'property') {
      // Verifica se o proprietário tem o monopólio da cor
      const propertiesOfColor = state.properties.filter(p => p.color === property.color);
      const ownerHasMonopoly = propertiesOfColor.every(p => p.owner === owner.id);
      
      if (ownerHasMonopoly && property.houses === 0) {
        rentAmount = property.rent[0] * 2; // Dobra o aluguel para monopólios sem casas
      }
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
    
    get().checkGameOver();
  },

  checkGameOver: () => {
    const state = get();
    const currentPlayer = state.players[state.currentPlayer];
    
    if (currentPlayer.money < 0) {
      // Jogador faliu
      const totalAssets = currentPlayer.properties.reduce((total, propId) => {
        const property = state.properties[propId];
        return total + property.price + (property.houses * (property.price / 2));
      }, 0);
      
      if (totalAssets + currentPlayer.money < 0) {
        // Remove o jogador do jogo
        set((state) => {
          const players = state.players.filter(p => p.id !== currentPlayer.id);
          const properties = state.properties.map(p => {
            if (p.owner === currentPlayer.id) {
              return { ...p, owner: null, houses: 0 };
            }
            return p;
          });
          
          if (players.length === 1) {
            get().addGameLog(`🎉 ${players[0].name} venceu o jogo! 🎉`);
          }
          
          return { 
            players,
            properties,
            currentPlayer: state.currentPlayer % players.length
          };
        });
        
        get().addGameLog(`${currentPlayer.name} faliu e está fora do jogo!`);
      }
    }
  },

  endTurn: () => {
    set((state) => {
      const nextPlayer = (state.currentPlayer + 1) % state.players.length;
      const player = state.players[nextPlayer];
      
      return {
        currentPlayer: nextPlayer,
        canRoll: true,
        canBuy: false
      };
    });
    
    const nextPlayer = get().players[get().currentPlayer];
    get().addGameLog(`Vez de ${nextPlayer.name}!`);
  }
}));