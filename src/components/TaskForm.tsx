import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { Category, Priority, Task } from '../types';

interface TaskFormProps {
  onAdd: (task: Omit<Task, 'id' | 'completed' | 'createdAt'>) => void;
  onClose: () => void;
}

export function TaskForm({ onAdd, onClose }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Trabalho');
  const [priority, setPriority] = useState<Priority>('Média');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title, category, priority, dueDate });
    setTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Nova Tarefa</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">O que precisa ser feito?</label>
            <input 
              autoFocus
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Finalizar relatório..."
              className="input-field"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Categoria</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="input-field appearance-none bg-white"
              >
                <option value="Trabalho">Trabalho</option>
                <option value="Pessoal">Pessoal</option>
                <option value="Estudos">Estudos</option>
                <option value="Outros">Outros</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Prioridade</label>
              <select 
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="input-field appearance-none bg-white"
              >
                <option value="Alta">Alta</option>
                <option value="Média">Média</option>
                <option value="Baixa">Baixa</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Data de Vencimento</label>
            <input 
              type="date" 
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <button type="submit" className="w-full btn-primary py-3 mt-4 flex items-center justify-center gap-2 text-base">
            <Plus size={20} />
            Criar Tarefa
          </button>
        </form>
      </div>
    </div>
  );
}
