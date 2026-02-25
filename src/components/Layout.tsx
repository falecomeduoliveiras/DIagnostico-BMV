import React from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#00A9FF] text-white font-sans">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold">woow</h1>
          <p className="text-lg opacity-80">MARKETING 360º</p>
        </header>
        <main className="bg-white text-gray-800 rounded-2xl shadow-2xl p-6 md:p-10">
          {children}
        </main>
        <footer className="text-center mt-8 text-white/70 text-sm">
          <p>&copy; {new Date().getFullYear()} Woow Marketing 360. Todos os direitos reservados.</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
