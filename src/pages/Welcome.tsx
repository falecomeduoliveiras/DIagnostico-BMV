import React from 'react';
import { Link } from 'react-router-dom';

const Welcome: React.FC = () => {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold mb-4 text-gray-900">Diagnóstico de Digitalização</h2>
      <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
        Descubra o nível de maturidade digital da sua empresa em <strong>Branding, Marketing e Vendas</strong>. Responda a 15 perguntas rápidas e receba um diagnóstico completo com insights para acelerar seus resultados.
      </p>
      <p className="text-md text-gray-500 mb-8">
        Este é o primeiro passo para transformar sua presença online e impulsionar o crescimento.
      </p>
      <Link
        to="/quiz/branding"
        className="bg-[#00A9FF] text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition-transform transform hover:scale-105 shadow-lg"
      >
        Começar Diagnóstico
      </Link>
    </div>
  );
};

export default Welcome;
