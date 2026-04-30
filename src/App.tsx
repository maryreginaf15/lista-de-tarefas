import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Filter, Loader2 } from 'lucide-react';
import { Header } from './components/Header';
import { TaskItem } from './components/TaskItem';
import { TaskForm } from './components/TaskForm';
import { Auth } from './components/Auth';
import { Analytics } from './components/Analytics';
import { CalendarView } from './components/CalendarView';
import type { Task } from './types';
import { supabase } from './lib/supabase';
import type { Session } from '@supabase/supabase-js';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filter, setFilter] = useState<'Todas' | 'Pendentes' | 'Concluídas'>('Todas');
  const [search, setSearch] = useState('');
  const [activeView, setActiveView] = useState('tasks');

  // Handle Session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchTasks();
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchTasks();
      else {
        setTasks([]);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchTasks() {
    setLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
    } else {
      const mappedTasks: Task[] = data.map((t: any) => ({
        id: t.id,
        title: t.title,
        category: t.category,
        priority: t.priority,
        dueDate: t.due_date,
        completed: t.completed,
        createdAt: new Date(t.created_at).getTime()
      }));
      setTasks(mappedTasks);
    }
    setLoading(false);
  }

  const addTask = async (taskData: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
    if (!session?.user) return;

    const { data, error } = await supabase
      .from('tasks')
      .insert([
        {
          title: taskData.title,
          category: taskData.category,
          priority: taskData.priority,
          due_date: taskData.dueDate,
          completed: false,
          user_id: session.user.id
        }
      ])
      .select();

    if (error) {
      console.error('Error adding task:', error);
      alert('Erro ao salvar tarefa: ' + error.message + '\n\nVerifique se você rodou o comando SQL no Supabase.');
    } else if (data) {
      const newTask: Task = {
        id: data[0].id,
        title: data[0].title,
        category: data[0].category,
        priority: data[0].priority,
        dueDate: data[0].due_date,
        completed: data[0].completed,
        createdAt: new Date(data[0].created_at).getTime()
      };
      setTasks(prev => [newTask, ...prev]);
    }
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const { error } = await supabase
      .from('tasks')
      .update({ completed: !task.completed })
      .eq('id', id);

    if (error) {
      console.error('Error toggling task:', error);
    } else {
      setTasks(prev => prev.map(t => 
        t.id === id ? { ...t, completed: !t.completed } : t
      ));
    }
  };

  const deleteTask = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting task:', error);
      } else {
        setTasks(prev => prev.filter(task => task.id !== id));
      }
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => {
        if (filter === 'Pendentes') return !task.completed;
        if (filter === 'Concluídas') return task.completed;
        return true;
      })
      .filter(task => 
        task.title.toLowerCase().includes(search.toLowerCase())
      );
  }, [tasks, filter, search]);

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length
  };

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header currentView={activeView} onViewChange={setActiveView} />
      
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 mb-2">
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin text-primary-600" size={28} />
                  <span>Sincronizando...</span>
                </div>
              ) : activeView === 'tasks' ? (
                <>Olá! Você tem <span className="text-primary-600">{stats.pending}</span> tarefas pendentes.</>
              ) : activeView === 'analytics' ? (
                <>Suas Análises</>
              ) : (
                <>Seu Calendário</>
              )}
            </h1>
            <p className="text-slate-500 font-medium">Logado como: <span className="text-slate-700 font-bold">{session.user.email}</span></p>
          </div>
          {activeView === 'tasks' && (
            <button 
              onClick={() => setIsFormOpen(true)}
              className="btn-primary flex items-center justify-center gap-2 py-3 px-6 text-base"
            >
              <Plus size={20} />
              Nova Tarefa
            </button>
          )}
        </div>

        {/* View Switcher Content */}
        {activeView === 'tasks' && (
          <>
            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
              <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm w-full sm:w-auto">
                {(['Todas', 'Pendentes', 'Concluídas'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                      filter === f 
                        ? 'bg-primary-600 text-white shadow-md' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text"
                  placeholder="Pesquisar tarefas..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 shadow-sm transition-all"
                />
              </div>
            </div>

            {/* Task List */}
            <div className="space-y-3">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="animate-spin text-primary-200" size={48} />
                  <p className="text-slate-400 font-medium">Carregando suas tarefas...</p>
                </div>
              ) : filteredTasks.length > 0 ? (
                filteredTasks.map(task => (
                  <TaskItem 
                    key={task.id} 
                    task={task} 
                    onToggle={toggleTask} 
                    onDelete={deleteTask} 
                  />
                ))
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                  <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Filter className="text-slate-300" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1">Nenhuma tarefa encontrada</h3>
                  <p className="text-slate-500">Tente ajustar seus filtros ou adicione uma nova tarefa.</p>
                </div>
              )}
            </div>
          </>
        )}

        {activeView === 'analytics' && <Analytics tasks={tasks} />}
        {activeView === 'calendar' && (
          <CalendarView 
            tasks={tasks} 
            onToggle={toggleTask} 
            onDelete={deleteTask} 
          />
        )}
      </main>

      {/* Modal Form */}
      {isFormOpen && (
        <TaskForm 
          onAdd={addTask} 
          onClose={() => setIsFormOpen(false)} 
        />
      )}
    </div>
  );
}

export default App;
