import React from 'react';
import type { Task } from '../types';
import { TaskItem } from './TaskItem';
import { format, parseISO, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CalendarViewProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function CalendarView({ tasks, onToggle, onDelete }: CalendarViewProps) {
  // Sort tasks by date
  const sortedTasks = [...tasks].sort((a, b) => 
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  // Group tasks by day
  const groupedTasks = sortedTasks.reduce((acc, task) => {
    const dateStr = task.dueDate;
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {Object.entries(groupedTasks).length > 0 ? (
        Object.entries(groupedTasks).map(([date, dayTasks]) => (
          <div key={date} className="space-y-4">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-4">
              <span>{format(parseISO(date), "EEEE, dd 'de' MMMM", { locale: ptBR })}</span>
              <div className="h-px bg-slate-200 flex-1"></div>
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {dayTasks.map(task => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  onToggle={onToggle} 
                  onDelete={onDelete} 
                />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-500 font-medium">Nenhuma tarefa agendada.</p>
        </div>
      )}
    </div>
  );
}
