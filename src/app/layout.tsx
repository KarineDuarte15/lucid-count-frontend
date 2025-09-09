// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css"; 

export const metadata: Metadata = {
  title: "LUCID COUNT",
  description: "Sistema de Automação de Relatórios Inteligentes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </head>
      <body> 
        {children}
      </body>
    </html>
  );
}