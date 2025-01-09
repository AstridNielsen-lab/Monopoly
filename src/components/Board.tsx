import React from 'react';
import { useGameStore } from '../store/gameStore';
import { cn } from '../lib/utils';
import { Building, Train, Lightbulb, HelpCircle, Coins, PiggyBank, Home, MapPin } from 'lucide-react';

const BOARD_SIZE = 11;

export const Board: React.FC = () => {
  const { players, properties } = useGameStore();

  const getPropertyIcon = (type: string) => {
    switch (type) {
      case 'property':
        return <Building className="w-4 h-4" />;
      case 'railroad':
        return <Train className="w-4 h-4" />;
      case 'utility':
        return <Lightbulb className="w-4 h-4" />;
      case 'chance':
        return <HelpCircle className="w-4 h-4" />;
      case 'chest':
        return <PiggyBank className="w-4 h-4" />;
      case 'tax':
        return <Coins className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getPropertyColor = (color: string | null) => {
    switch (color) {
      case 'brown': return 'bg-amber-900';
      case 'lightblue': return 'bg-sky-400';
      case 'pink': return 'bg-pink-500';
      case 'orange': return 'bg-orange-500';
      case 'red': return 'bg-red-500';
      case 'yellow': return 'bg-yellow-400';
      case 'green': return 'bg-green-500';
      case 'blue': return 'bg-blue-600';
      default: return 'bg-gray-100';
    }
  };

  const renderSpace = (property: any, rotation: string = '') => {
    const playerTokens = players.filter(p => p.position === property.id);
    const isCorner = property.type === 'corner';
    
    return (
      <div 
        className={cn(
          "relative transition-transform duration-300 hover:scale-105",
          isCorner ? "w-36 h-36" : "w-24 h-36",
          "border border-gray-200 bg-white/95 backdrop-blur-sm p-2 flex flex-col",
          "shadow-lg hover:shadow-xl",
          rotation
        )}
      >
        {/* Barra de cor da propriedade */}
        <div className={cn(
          "h-6 w-full rounded-t-sm transition-all duration-300",
          property.color && getPropertyColor(property.color),
          "hover:h-8"
        )} />
        
        <div className="flex-1 flex flex-col justify-between p-1">
          {/* Nome da propriedade */}
          <div className="text-xs font-medium text-center leading-tight">
            {property.name}
          </div>
          
          {/* Preço */}
          {property.price > 0 && (
            <div className="text-xs text-center font-bold bg-emerald-50 rounded-full px-2 py-1 mt-1">
              ${property.price}
            </div>
          )}

          {/* Casas */}
          {property.houses > 0 && (
            <div className="flex justify-center gap-1 my-1">
              {Array.from({ length: property.houses }).map((_, i) => (
                <Home key={i} className="w-3 h-3 text-emerald-600" />
              ))}
            </div>
          )}

          {/* Ícone central */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20">
            {getPropertyIcon(property.type)}
          </div>

          {/* Jogadores na casa */}
          {playerTokens.length > 0 && (
            <div className="absolute bottom-2 left-1 right-1 flex flex-wrap gap-1 justify-center">
              {playerTokens.map((player) => (
                <div
                  key={player.id}
                  className={cn(
                    "w-5 h-5 rounded-full border-2 border-white shadow-lg flex items-center justify-center",
                    `bg-${player.color}-500`,
                    "transform hover:scale-110 transition-all duration-300"
                  )}
                >
                  <MapPin className="w-3 h-3 text-white" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const topRow = properties.slice(20, 31).reverse();
  const rightColumn = properties.slice(31, 40);
  const bottomRow = properties.slice(0, 11);
  const leftColumn = properties.slice(11, 20).reverse();

  return (
    <div className="relative transform hover:scale-[1.02] transition-all duration-500">
      <div className="grid grid-cols-11 gap-1 bg-emerald-100/30 p-4 rounded-3xl shadow-2xl backdrop-blur-sm">
        {/* Top row */}
        {topRow.map((prop) => (
          <div key={prop.id}>{renderSpace(prop, '-rotate-180')}</div>
        ))}
        
        <div className="col-span-11 grid grid-cols-[auto_1fr_auto] gap-1">
          {/* Left column */}
          <div className="flex flex-col gap-1">
            {leftColumn.map((prop) => (
              <div key={prop.id}>{renderSpace(prop, '-rotate-90')}</div>
            ))}
          </div>

          {/* Centro do tabuleiro */}
          <div className="flex items-center justify-center p-8 bg-white/40 backdrop-blur-md m-4 rounded-3xl shadow-inner">
            <h1 className="text-7xl font-black text-emerald-800/80 rotate-45 tracking-tight">
              MONOPOLY
            </h1>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-1">
            {rightColumn.map((prop) => (
              <div key={prop.id}>{renderSpace(prop, 'rotate-90')}</div>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        {bottomRow.map((prop) => (
          <div key={prop.id}>{renderSpace(prop)}</div>
        ))}
      </div>
    </div>
  );
};