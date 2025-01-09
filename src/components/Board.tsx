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
      case 'brown': return 'from-amber-800 to-amber-900';
      case 'lightblue': return 'from-sky-300 to-sky-400';
      case 'pink': return 'from-pink-400 to-pink-500';
      case 'orange': return 'from-orange-400 to-orange-500';
      case 'red': return 'from-red-400 to-red-500';
      case 'yellow': return 'from-yellow-300 to-yellow-400';
      case 'green': return 'from-green-400 to-green-500';
      case 'blue': return 'from-blue-500 to-blue-600';
      default: return 'from-gray-50 to-gray-100';
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
          "border border-white/20 bg-white/95 backdrop-blur-sm",
          "shadow-[0_0_15px_rgba(0,0,0,0.1)] hover:shadow-[0_0_25px_rgba(0,0,0,0.15)]",
          "rounded-lg overflow-hidden",
          rotation
        )}
      >
        {/* Barra de cor da propriedade com gradiente */}
        {property.color && (
          <div className={cn(
            "h-6 w-full bg-gradient-to-r transition-all duration-300",
            getPropertyColor(property.color),
            "group-hover:h-8"
          )} />
        )}
        
        <div className="flex-1 flex flex-col justify-between p-2 relative">
          {/* Nome da propriedade */}
          <div className="text-xs font-medium text-center leading-tight">
            {property.name}
          </div>
          
          {/* Preço com efeito de vidro */}
          {property.price > 0 && (
            <div className="flex items-center justify-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50/80 backdrop-blur-sm rounded-full px-2 py-1 mt-1 shadow-inner">
              <DollarSign className="w-3 h-3" />
              {property.price}
            </div>
          )}

          {/* Casas com efeito de brilho */}
          {property.houses > 0 && (
            <div className="flex justify-center gap-1 my-1">
              {Array.from({ length: property.houses }).map((_, i) => (
                <Home 
                  key={i} 
                  className="w-3 h-3 text-emerald-600 drop-shadow-[0_0_2px_rgba(16,185,129,0.5)]" 
                />
              ))}
            </div>
          )}

          {/* Ícone central com efeito de gradiente */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 scale-150">
            <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 p-4 rounded-full">
              {getPropertyIcon(property.type)}
            </div>
          </div>

          {/* Jogadores na casa com efeito de elevação */}
          {playerTokens.length > 0 && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex -space-x-2">
              {playerTokens.map((player) => (
                <div
                  key={player.id}
                  className={cn(
                    "w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center",
                    `bg-${player.color}-500`,
                    "transform hover:scale-110 transition-all duration-300 hover:z-10",
                    "hover:shadow-[0_0_10px_rgba(0,0,0,0.2)]"
                  )}
                >
                  <MapPin className="w-3 h-3 text-white drop-shadow-sm" />
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
      <div className="grid grid-cols-11 gap-1.5 bg-gradient-to-br from-emerald-100/40 to-emerald-200/40 p-8 rounded-3xl shadow-2xl backdrop-blur-sm">
        {/* Efeito de brilho nos cantos */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-emerald-400/20 to-transparent rounded-full blur-2xl" />
        
        {/* Top row */}
        {topRow.map((prop) => (
          <div key={prop.id}>{renderSpace(prop, '-rotate-180')}</div>
        ))}
        
        <div className="col-span-11 grid grid-cols-[auto_1fr_auto] gap-1.5">
          {/* Left column */}
          <div className="flex flex-col gap-1.5">
            {leftColumn.map((prop) => (
              <div key={prop.id}>{renderSpace(prop, '-rotate-90')}</div>
            ))}
          </div>

          {/* Centro do tabuleiro com efeitos modernos */}
          <div className="flex items-center justify-center p-12 bg-white/40 backdrop-blur-md m-8 rounded-3xl shadow-inner relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10" />
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_50%)]" />
            </div>
            <div className="relative">
              <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-600 to-emerald-800 rotate-45 tracking-tight">
                MONOPOLY
              </h1>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45">
                <DollarSign className="w-32 h-32 text-emerald-500/20 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-1.5">
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