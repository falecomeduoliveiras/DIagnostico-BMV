import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { DIAGNOSTIC_QUESTIONS } from '../questions';
import Gauge from '../components/Gauge';

type Category = keyof typeof DIAGNOSTIC_QUESTIONS;

const Results: React.FC = () => {
  const [scores, setScores] = useState<Record<Category, number>>({ branding: 0, marketing: 0, vendas: 0 });
  const [totalPossible, setTotalPossible] = useState<Record<Category, number>>({ branding: 0, marketing: 0, vendas: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');

  useEffect(() => {
    const storedAnswers = JSON.parse(localStorage.getItem('diagnosticAnswers') || '{}');
    let newScores = { branding: 0, marketing: 0, vendas: 0 };
    let newTotalPossible = { branding: 0, marketing: 0, vendas: 0 };

    Object.keys(DIAGNOSTIC_QUESTIONS).forEach(cat => {
      const category = cat as Category;
      const questions = DIAGNOSTIC_QUESTIONS[category];
      newTotalPossible[category] = questions.length * 3;
      questions.forEach((_, index) => {
        const answerKey = `${category}-${index}`;
        if (storedAnswers[answerKey]) {
          newScores[category] += storedAnswers[answerKey];
        }
      });
    });

    setScores(newScores);
    setTotalPossible(newTotalPossible);
  }, []);

  const getScoreData = (category: Category) => {
    const percentage = totalPossible[category] > 0 ? (scores[category] / totalPossible[category]) * 100 : 0;
    let color: 'red' | 'yellow' | 'green' = 'green';
    let level = 'Estágio Acelerado';
    let recommendation = 'Sua estratégia está bem direcionada. O desafio agora é manter a consistência e buscar otimizações contínuas para liderar o mercado. Uma ajuda externa pode trazer novas perspectivas para inovar ainda mais.';

    if (percentage <= 30) {
      color = 'red';
      level = 'Alerta Crítico';
      recommendation = 'Atenção! Sua estratégia digital nesta área está vulnerável. É crucial agir agora para construir uma base sólida e não perder mais oportunidades. Uma ajuda especializada pode acelerar essa transformação e evitar erros custosos.';
    } else if (percentage <= 70) {
      color = 'yellow';
      level = 'Ponto de Melhoria';
      recommendation = 'Você já deu os primeiros passos, mas existem lacunas importantes que limitam seu crescimento. É o momento ideal para estruturar e profissionalizar suas ações. Com o direcionamento certo, seus resultados podem decolar.';
    }
    return { percentage: Math.round(percentage), color, level, recommendation };
  };

  const chartData = (Object.keys(scores) as Category[]).map(cat => ({
    name: cat.charAt(0).toUpperCase() + cat.slice(1),
    subject: cat.charAt(0).toUpperCase() + cat.slice(1),
    percentual: getScoreData(cat).percentage,
    fullMark: 100,
  }));

  const generateAnalysisText = () => {
    let text = `*Diagnóstico de Maturidade Digital para ${userName}*\n\n`;
    text += 'Olá! Segue o resumo da sua análise, como combinado. Salve esta mensagem para consultar depois.\n\n';
    (Object.keys(scores) as Category[]).forEach(cat => {
      const { percentage, level } = getScoreData(cat);
      text += `*${cat.toUpperCase()}:* ${percentage}% - Nível: ${level}\n`;
    });
    text += '\n*Próximos Passos:*\nAnalisando seus resultados, o ponto mais crítico parece ser X. Sugiro começarmos por aí. Quando podemos conversar por 15 minutos para eu te apresentar um plano de ação prático?\n\nLembre-se: Seu negócio é a única opção ou apenas mais uma?';
    return text;
  };

  const handleSaveToWhatsApp = () => {
    if (!userPhone) return;
    const cleanPhone = `55${userPhone.replace(/\D/g, '')}`;
    const message = generateAnalysisText();
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="p-4 bg-white">
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-900">Seu Diagnóstico está Pronto</h2>
        <p className="text-center text-gray-600 mb-8">O seu balcão de vendas está aberto ou escondido? Veja os pontos de melhoria.</p>
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          {(Object.keys(scores) as Category[]).map(cat => {
            const { percentage, color, level, recommendation } = getScoreData(cat);
            return (
              <div key={cat} className="border border-gray-200 rounded-lg p-6 text-center shadow-lg flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-4 capitalize">{cat}</h3>
                  <Gauge percentage={percentage} color={color} />
                  <p className={`font-bold text-lg mt-4 ${color === 'red' ? 'text-red-500' : color === 'yellow' ? 'text-yellow-500' : 'text-green-500'}`}>{level}</p>
                </div>
                <p className="text-gray-600 text-sm mt-2">{recommendation}</p>
              </div>
            );
          })}
        </div>
        <h3 className="text-2xl font-bold text-center mt-12 mb-6 text-gray-800">Análise Comparativa</h3>
        <div className="grid md:grid-cols-2 gap-8 h-96">
          <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
            <h4 className="text-lg font-semibold text-center mb-2 text-gray-700">Visão Geral</h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis unit="%" />
                <Tooltip />
                <Bar dataKey="percentual" fill="#00A9FF" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
            <h4 className="text-lg font-semibold text-center mb-2 text-gray-700">Balanço Estratégico</h4>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} unit="%" />
                <Radar name="Diagnóstico" dataKey="percentual" stroke="#00A9FF" fill="#00A9FF" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="text-center mt-8">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 text-white font-bold py-4 px-10 rounded-full hover:bg-green-700 transition-transform transform hover:scale-105 shadow-lg text-lg"
        >
          📲 Salvar Minha Análise no WhatsApp
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center">
            <h3 className="text-2xl font-bold mb-4">Plano de Ação Detalhado</h3>
            <p className="text-gray-600 mb-6">Para onde posso enviar este relatório em PDF e o resumo da nossa conversa para você consultar depois?</p>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Seu primeiro nome"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A9FF]"
              />
              <input
                type="tel"
                placeholder="Seu WhatsApp com DDD"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A9FF]"
              />
              <button
                onClick={handleSaveToWhatsApp}
                className="bg-[#00A9FF] text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition-transform transform hover:scale-105 shadow-lg"
              >
                Abrir e Salvar no WhatsApp
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 text-sm mt-2 hover:text-gray-700"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;
