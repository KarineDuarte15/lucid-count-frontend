// src/app/page.tsx
"use client";

import { supabase } from '../lib/supabaseClient'; // Importe o cliente Supabase
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; 




export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Novos estados para feedback ao utilizador
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter(); // Hook para controlar a navegação

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // AQUI ESTÁ A LÓGICA CORRETA USANDO O SUPABASE
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        // Se o Supabase retornar um erro, nós o mostramos
        if (error.message === "Invalid login credentials") {
          setError("E-mail ou senha inválidos. Tente novamente.");
        } else {
          setError(error.message);
        }
        console.error('Falha no login do Supabase:', error);
      } else {
        // Login bem-sucedido!
        console.log('Login realizado com sucesso:', data);
        
        // Opcional: guardar a sessão se precisar
        // localStorage.setItem('supabase.auth.token', data.session.access_token);
        
        // Redireciona o utilizador para o dashboard
        router.push('/dashboard');
      }
    } catch (err) {
      // Captura erros inesperados de rede, etc.
      setError("Ocorreu um erro inesperado. Verifique a sua conexão.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-background text-text-primary">
      {/* Coluna da Esquerda (Imagem e Logo) */}
      <div className="relative md:w-2/5 lg:w-1/2 hidden md:flex flex-col items-center justify-center p-10 text-center">
        {/* Imagem de Fundo (GIF) */}
        <Image
         src="/login-background.gif"
          alt="Animação de fundo de contabilidade"
          fill // 'layout="fill"' se torna apenas 'fill'
          className="object-cover" // 'objectFit' é aplicado com uma classe do Tailwind
          quality={100}
          priority
          unoptimized={true} 
        />
        {/* Overlay para escurecer a imagem e melhorar a legibilidade do texto */}
        <div className="absolute inset-0 bg-border opacity-40"></div>

        {/* Conteúdo sobre a imagem */}
        <div className="relative z-10">
          {/* Logo da Empresa */}
          <div className="mb-4">
             <Image 
                src="/login-background1.png" 
                alt="Logo da Empresa"
                width={600}
                height={600}
             />
          </div>

        </div>
      </div>

      {/* Coluna da Direita (Formulário) */}
      <div className="w-full md:w-3/5 lg:w-1/2 flex items-center justify-center p-8 bg-primary">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold">Bem vindo ao Lucid Count!</h2>
            <p className="text-text-secondary mt-2">Sistema de Automação de Relatórios Inteligentes</p>
            <p className="text-text-secondary">Entre com o seu usuário e senha.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Show error message if exists */}
            {error && (
              <div className="text-red-600 bg-red-100 border border-red-400 rounded p-2 mb-2 text-sm">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  {/* Ícone de Usuário (SVG) */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full pl-10 pr-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="email@gmail.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Senha</label>
              <div className="relative">
                 <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  {/* Ícone de Cadeado (SVG) */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full pl-10 pr-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-accent text-background font-semibold rounded-md hover:bg-yellow-500 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="text-center">
            <a href="#" className="text-sm text-text-secondary hover:text-accent">
              Esqueceu-se da sua senha?
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}