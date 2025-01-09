import React, { useState } from 'react';
import { Board } from './components/Board';
import { Dice } from './components/Dice';
import { PlayerInfo } from './components/PlayerInfo';
import { useGameStore } from './store/gameStore';
import { Trophy, DollarSign } from 'lucide-react';
import { cn } from './lib/utils'; // Adicionando a importação do cn

function App() {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const { 
    addPlayer, 
    players, 
    gameLog,
    currentPlayer,
    properties,
    canBuy,
    buyProperty,
    endTurn
  } = useGameStore();

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      addPlayer(playerName.trim());
      setPlayerName('');
    }
  };

  const startGame = () => {
    if (players.length >= 2) {
      setIsGameStarted(true);
    }
  };

  const currentProperty = properties[players[currentPlayer]?.position];

  if (!isGameStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl max-w-md w-full">
          <div className="flex items-center justify-center mb-6">
            <Trophy className="w-12 h-12 text-yellow-500 animate-pulse" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent ml-2">
              Monopoly
            </h1>
          </div>
          
          <form onSubmit={handleAddPlayer} className="space-y-4 mb-6">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter player name"
              className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
            />
            <button
              type="submit"
              className="w-full bg-emerald-500 text-white py-3 rounded-xl hover:bg-emerald-600 transform hover:scale-105 transition-all shadow-lg"
            >
              Add Player
            </button>
          </form>

          <div className="mb-6 bg-emerald-50 p-4 rounded-xl">
            <h2 className="font-bold text-emerald-800 mb-2">Players:</h2>
            {players.map((player) => (
              <div
                key={player.id}
                className="py-2 px-4 bg-white rounded-lg mb-2 shadow flex items-center"
              >
                <div
                  className={cn(
                    "w-3 h-3 rounded-full mr-2",
                    `bg-${player.color}-500`
                  )}
                />
                <span className="font-medium">{player.name}</span>
                <span className="ml-auto text-emerald-600 flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" />
                  {player.money}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={startGame}
            disabled={players.length < 2}
            className="w-full bg-yellow-500 text-white py-3 rounded-xl hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all shadow-lg font-bold"
          >
            Start Game ({players.length}/2 players)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-[1fr_auto_1fr] gap-8">
          <PlayerInfo />
          <div className="flex flex-col items-center gap-8">
            <Board />
            <Dice />
            {canBuy && currentProperty && (
              <div className="flex gap-4">
                <button
                  onClick={() => buyProperty()}
                  className="px-6 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600"
                >
                  Comprar por ${currentProperty.price}
                </button>
                <button
                  onClick={() => endTurn()}
                  className="px-6 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600"
                >
                  Passar
                </button>
              </div>
            )}
          </div>
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4 flex items-center">
              Game Log
              <Trophy className="w-6 h-6 text-yellow-500 ml-2" />
            </h2>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {gameLog.map((log, index) => (
                <div
                  key={index}
                  className="text-sm p-2 bg-emerald-50 rounded-lg"
                >
                  {log.message}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;