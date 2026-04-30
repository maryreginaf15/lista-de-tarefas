import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'priority' | 'category';
  value: string;
}

const priorityColors = {
  'Alta': 'bg-red-100 text-red-700 border-red-200',
  'Média': 'bg-orange-100 text-orange-700 border-orange-200',
  'Baixa': 'bg-slate-100 text-slate-700 border-slate-200',
};

const categoryColors = {
  'Trabalho': 'bg-blue-100 text-blue-700 border-blue-200',
  'Pessoal': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Estudos': 'bg-purple-100 text-purple-700 border-purple-200',
  'Outros': 'bg-slate-100 text-slate-700 border-slate-200',
};

export function Badge({ children, variant, value }: BadgeProps) {
  const colorClass = variant === 'priority' 
    ? priorityColors[value as keyof typeof priorityColors] 
    : categoryColors[value as keyof typeof categoryColors];

  return (
    <span className={cn(
      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
      colorClass
    )}>
      {children}
    </span>
  );
}
