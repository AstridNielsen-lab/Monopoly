import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Dices } from 'lucide-react';
import { cn } from '../lib/utils';

export const Dice: React.FC = () => {
  const { dice, isRolling, rollDice } = useGameStore();

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-6">
        {dice.map((value, index) => (
          <div
            key={index}
            className={cn(
              "w-20 h-20 bg-white/90 backdrop-blur-sm rounded-2xl border-4 border-emerald-200 flex items-center justify-center shadow-xl",
              {
                'dice-rolling': isRolling
              }
            )}
          >
            <div className="relative">
              <Dices className="w-10 h-10 text-emerald-600 absolute -top-5 -left-5 opacity-20" />
              <span className="text-4xl font-bold text-emerald-800">{value}</span>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={rollDice}
        disabled={isRolling}
        className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 transform hover:scale-105 transition-all shadow-lg font-bold text-lg"
      >
        {isRolling ? 'Rolling...' : 'Roll Dice'}
      </button>
    </div>
  );
};