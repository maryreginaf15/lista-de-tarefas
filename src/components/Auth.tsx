import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { LogIn, UserPlus, Loader2, CheckCircle2 } from 'lucide-react';

export function Auth() {
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = isSignUp 
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else if (isSignUp) {
      alert('Verifique seu e-mail para confirmar o cadastro!');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="bg-primary-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary-500/20">
            <CheckCircle2 className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">TaskFlow</h1>
          <p className="text-slate-500 mt-2 font-medium">Sua produtividade começa aqui.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6">
            {isSignUp ? 'Criar nova conta' : 'Entrar na sua conta'}
          </h2>

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">E-mail</label>
              <input 
                type="email" 
                placeholder="seu@email.com"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Senha</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 text-base"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : isSignUp ? (
                <>
                  <UserPlus size={20} />
                  Cadastrar
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Entrar
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors"
            >
              {isSignUp 
                ? 'Já tem uma conta? Faça login' 
                : 'Não tem uma conta? Cadastre-se gratuitamente'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
