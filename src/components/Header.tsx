import React from 'react';
import { LayoutList, BarChart2, Calendar, LogOut, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function Header({ currentView, onViewChange }: HeaderProps) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const navItems = [
    { id: 'tasks', label: 'Tarefas', icon: LayoutList },
    { id: 'analytics', label: 'Análises', icon: BarChart2 },
    { id: 'calendar', label: 'Calendário', icon: Calendar },
  ];

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary-600 p-1.5 rounded-lg">
            <CheckCircle2 className="text-white" size={20} />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
            TaskFlow
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "text-sm font-semibold flex items-center gap-2 transition-colors",
                currentView === item.id ? "text-primary-600" : "text-slate-500 hover:text-primary-600"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-red-500 transition-colors group"
        >
          <span className="hidden sm:inline">Sair</span>
          <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </header>
  );
}
