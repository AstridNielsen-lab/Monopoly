import React from 'react';
import { useGameStore } from '../store/gameStore';
import { cn } from '../lib/utils';
import { Building, Train, Lightbulb, HelpCircle, Coins, PiggyBank, Home } from 'lucide-react';

const BOARD_SIZE = 11; // 11x11 grid to accommodate all spaces

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
    
    return (
      <div 
        className={cn(
          "w-24 h-36 border border-gray-300 bg-white/90 backdrop-blur-sm p-2 flex flex-col relative",
          rotation
        )}
      >
        <div className={cn(
          "h-6 w-full",
          property.color && getPropertyColor(property.color)
        )} />
        
        <div className="flex-1 flex flex-col justify-between p-1">
          <div className="text-xs font-medium text-center">
            {property.name}
          </div>
          
          {property.price > 0 && (
            <div className="text-xs text-center font-bold">
              ${property.price}
            </div>
          )}

          {property.houses > 0 && (
            <div className="flex justify-center gap-1">
              {Array.from({ length: property.houses }).map((_, i) => (
                <Home key={i} className="w-3 h-3 text-green-600" />
              ))}
            </div>
          )}

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {getPropertyIcon(property.type)}
          </div>

          {playerTokens.length > 0 && (
            <div className="absolute bottom-1 left-1 right-1 flex flex-wrap gap-1 justify-center">
              {playerTokens.map((player) => (
                <div
                  key={player.id}
                  className={cn(
                    "w-4 h-4 rounded-full border-2 border-white shadow-sm",
                    `bg-${player.color}-500`
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Create the board layout
  const topRow = properties.slice(20, 31).reverse();
  const rightColumn = properties.slice(31, 40);
  const bottomRow = properties.slice(0, 11);
  const leftColumn = properties.slice(11, 20).reverse();

  return (
    <div className="relative">
      <div className="grid grid-cols-11 gap-0">
        {/* Top row */}
        {topRow.map((prop) => (
          <div key={prop.id}>{renderSpace(prop, '-rotate-180')}</div>
        ))}
        
        <div className="col-span-11 grid grid-cols-[auto_1fr_auto]">
          {/* Left column */}
          <div className="flex flex-col">
            {leftColumn.map((prop) => (
              <div key={prop.id}>{renderSpace(prop, '-rotate-90')}</div>
            ))}
          </div>

          {/* Center area */}
          <div className="flex items-center justify-center p-8 bg-white/50 backdrop-blur-sm">
            <h1 className="text-6xl font-bold text-emerald-800 rotate-45">MONOPOLY</h1>
          </div>

          {/* Right column */}
          <div className="flex flex-col">
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