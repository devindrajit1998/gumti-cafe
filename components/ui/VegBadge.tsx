import React from 'react';
import { VegType } from '@/lib/types';

interface VegBadgeProps {
  type?: VegType;
  vegType?: VegType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const VegBadge: React.FC<VegBadgeProps> = ({ type, vegType, size = 'md', showLabel = false }) => {
  const actualType = vegType || type || 'veg';
  const isVeg = actualType === 'veg';
  const isEgg = actualType === 'egg';

  const boxSize = size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : size === 'lg' ? 'w-2.5 h-2.5' : 'w-2 h-2';

  const borderColor = isVeg ? 'border-emerald-600' : isEgg ? 'border-amber-600' : 'border-rose-600';
  const dotColor = isVeg ? 'bg-emerald-600' : isEgg ? 'bg-amber-600' : 'bg-rose-600';
  const labelText = isVeg ? 'VEG' : isEgg ? 'EGG' : 'NON-VEG';
  const textColor = isVeg ? 'text-emerald-700' : isEgg ? 'text-amber-700' : 'text-rose-700';

  return (
    <div className="inline-flex items-center gap-1.5" title={isVeg ? 'Vegetarian' : isEgg ? 'Contains Egg' : 'Non-Vegetarian'}>
      <div className={`${boxSize} border-2 ${borderColor} rounded-[3px] flex items-center justify-center bg-white shrink-0`}>
        <div className={`${dotSize} rounded-full ${dotColor}`} />
      </div>
      {showLabel && (
        <span className={`text-[10px] font-bold tracking-wider ${textColor}`}>
          {labelText}
        </span>
      )}
    </div>
  );
};
