import React from 'react';
import { Trash2, Calendar, Check } from 'lucide-react';
import type { Task } from '../types';
import { Badge } from './Badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <div className={cn(
      "group flex items-center gap-4 p-4 card hover:border-primary-200 hover:shadow-md transition-all duration-300",
      task.completed && "opacity-60 bg-slate-50/50"
    )}>
      {/* Checkbox */}
      <button 
        onClick={() => onToggle(task.id)}
        className={cn(
          "custom-checkbox",
          task.completed && "checked"
        )}
      >
        {task.completed && <Check size={14} className="text-white" />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className={cn(
            "text-sm font-semibold text-slate-800 truncate transition-all",
            task.completed && "line-through text-slate-400"
          )}>
            {task.title}
          </h3>
          <div className="flex gap-1.5 ml-auto sm:ml-0">
            <Badge variant="category" value={task.category}>{task.category}</Badge>
            <Badge variant="priority" value={task.priority}>{task.priority}</Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 text-[12px] text-slate-500 font-medium">
          <Calendar size={12} />
          <span>{format(new Date(task.dueDate), "dd 'de' MMMM", { locale: ptBR })}</span>
        </div>
      </div>

      {/* Delete Button */}
      <button 
        onClick={() => onDelete(task.id)}
        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
