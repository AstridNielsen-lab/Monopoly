import React from 'react';
import { useGameStore } from '../store/gameStore';
import { User, DollarSign, Building, Lock } from 'lucide-react';
import { cn } from '../lib/utils';

export const PlayerInfo: React.FC = () => {
  const { players, currentPlayer, properties } = useGameStore();

  const getPlayerProperties = (player: any) => {
    return properties.filter(prop => prop.owner === player.id);
  };

  return (
    <div className="space-y-4">
      {players.map((player, index) => {
        const playerProperties = getPlayerProperties(player);
        
        return (
          <div
            key={player.id}
            className={cn(
              "p-6 rounded-2xl transition-all duration-300 transform hover:scale-105",
              {
                'bg-white/90 backdrop-blur-sm border-4 border-emerald-500 shadow-xl': index === currentPlayer,
                'bg-white/80 backdrop-blur-sm': index !== currentPlayer
              }
            )}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  `bg-${player.color}-500`
                )}
              >
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl">{player.name}</span>
                {player.inJail && (
                  <div className="flex items-center text-red-500 text-sm">
                    <Lock className="w-4 h-4 mr-1" />
                    Na prisão
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-700">
                <DollarSign className="w-5 h-5" />
                <span className="font-medium">${player.money}</span>
              </div>
              
              <div>
                <div className="flex items-center gap-2 text-emerald-700 mb-2">
                  <Building className="w-5 h-5" />
                  <span className="font-medium">{playerProperties.length} Propriedades</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {playerProperties.map((prop) => (
                    <div
                      key={prop.id}
                      className={cn(
                        "text-xs p-2 rounded",
                        prop.color ? getPropertyColor(prop.color) : "bg-gray-100"
                      )}
                    >
                      {prop.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const getPropertyColor = (color: string) => {
  switch (color) {
    case 'brown': return 'bg-amber-900/20';
    case 'lightblue': return 'bg-sky-400/20';
    case 'pink': return 'bg-pink-500/20';
    case 'orange': return 'bg-orange-500/20';
    case 'red': return 'bg-red-500/20';
    case 'yellow': return 'bg-yellow-400/20';
    case 'green': return 'bg-green-500/20';
    case 'blue': return 'bg-blue-600/20';
    default: return 'bg-gray-100';
  }
};