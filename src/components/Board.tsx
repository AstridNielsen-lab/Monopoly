import React from 'react';
import { useGameStore } from '../store/gameStore';
import { cn } from '../lib/utils';
import { Building, Train, Lightbulb, HelpCircle, Coins, PiggyBank, Home, MapPin, DollarSign } from 'lucide-react';

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
          "relative transition-all duration-300 hover:scale-105 group",
          isCorner ? "w-32 h-32" : "w-20 h-32",
          "border border-gray-200 bg-white/95 backdrop-blur-sm",
          "shadow-lg hover:shadow-xl",
          rotation
        )}
      >
        {/* Barra de cor da propriedade */}
        {property.color && (
          <div className={cn(
            "h-6 w-full transition-all duration-300",
            getPropertyColor(property.color),
            "group-hover:h-8"
          )} />
        )}
        
        <div className="flex-1 flex flex-col justify-between p-2 relative">
          {/* Nome da propriedade */}
          <div className="text-xs font-medium text-center leading-tight">
            {property.name}
          </div>
          
          {/* Preço */}
          {property.price > 0 && (
            <div className="flex items-center justify-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-full px-2 py-1 mt-1">
              <DollarSign className="w-3 h-3" />
              {property.price}
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
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 scale-150">
            {getPropertyIcon(property.type)}
          </div>

          {/* Jogadores na casa */}
          {playerTokens.length > 0 && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex -space-x-2">
              {playerTokens.map((player) => (
                <div
                  key={player.id}
                  className={cn(
                    "w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center",
                    `bg-${player.color}-500`,
                    "transform hover:scale-110 transition-all duration-300 hover:z-10"
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
      <div className="grid grid-cols-11 gap-1 bg-emerald-100/30 p-8 rounded-3xl shadow-2xl backdrop-blur-sm">
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
          <div className="flex items-center justify-center p-12 bg-white/40 backdrop-blur-md m-8 rounded-3xl shadow-inner relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10" />
            <div className="relative">
              <h1 className="text-7xl font-black text-emerald-800/80 rotate-45 tracking-tight">
                MONOPOLY
              </h1>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45">
                <DollarSign className="w-32 h-32 text-emerald-500/20" />
              </div>
            </div>
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