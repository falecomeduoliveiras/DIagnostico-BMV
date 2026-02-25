export const DIAGNOSTIC_QUESTIONS = {
  branding: [
    {
      question: 'Fora da sua escola, os pais e alunos conseguem descrever claramente o que torna sua instituição ÚNICA, ou vocês são apenas "mais uma opção" na região?',
      options: [
        { text: 'Sim, nosso propósito e método são conhecidos e valorizados pela comunidade.', score: 3 },
        { text: 'Alguns sabem, mas a percepção geral ainda é confusa ou baseada só em preço.', score: 2 },
        { text: 'Não, somos vistos como uma opção genérica, sem um diferencial claro.', score: 1 },
      ],
    },
    {
      question: 'A comunicação visual da sua escola (uniformes, site, redes sociais, fachada) transmite a mesma mensagem de qualidade e profissionalismo que vocês prometem em sala de aula?',
      options: [
        { text: 'Sim, nossa identidade visual é coesa, profissional e reflete nosso projeto pedagógico.', score: 3 },
        { text: 'É funcional, mas visivelmente amadora ou inconsistente em alguns pontos.', score: 2 },
        { text: 'Não, nossa imagem parece antiquada e não condiz com nossa qualidade de ensino.', score: 1 },
      ],
    },
    {
      question: 'Sua escola promove eventos ou produz conteúdo (palestras, artigos, vídeos) que posicionam seus diretores e coordenadores como autoridades em educação na sua cidade?',
      options: [
        { text: 'Sim, somos uma referência e fonte de consulta para temas educacionais.', score: 3 },
        { text: 'Fazemos algumas ações pontuais, mas sem uma estratégia de autoridade.', score: 2 },
        { text: 'Não, nossa comunicação é focada apenas em avisos e calendário escolar.', score: 1 },
      ],
    },
    {
      question: 'Os pais atuais são "advogados" da sua marca? Eles indicam a escola ativamente e defendem vocês em grupos e conversas, ou o "boca a boca" é fraco ou inexistente?',
      options: [
        { text: 'Temos um forte programa de indicações e pais que são verdadeiros fãs.', score: 3 },
        { text: 'Recebemos indicações, mas de forma passiva, sem um incentivo claro.', score: 2 },
        { text: 'O boca a boca é neutro ou até negativo em alguns casos.', score: 1 },
      ],
    },
    {
      question: 'Qual história a sua escola conta? Existe uma narrativa sobre a fundação, o propósito ou os casos de sucesso que conecta emocionalmente as famílias com a instituição?',
      options: [
        { text: 'Sim, nossa história é poderosa, conhecida e contada com orgulho.', score: 3 },
        { text: 'Temos uma história, mas ela não é usada como ferramenta de marketing.', score: 2 },
        { text: 'Não temos uma narrativa definida, focamos apenas na estrutura e no currículo.', score: 1 },
      ],
    },
  ],
  marketing: [
    {
      question: 'Se as matrículas de "quem procura" (visitas espontâneas, indicações) parassem hoje, sua escola teria um plano B para gerar ativamente novos interessados amanhã?',
      options: [
        { text: 'Sim, temos campanhas de tráfego pago e funis de captação sempre ativos.', score: 3 },
        { text: 'Fazemos alguns anúncios, mas sem uma estratégia contínua e previsível.', score: 2 },
        { text: 'Não, dependemos 100% da procura orgânica e indicações. Seria o caos.', score: 1 },
      ],
    },
    {
      question: 'Você sabe exatamente qual canal de marketing (Google, Facebook, Instagram, Feiras) traz os alunos mais qualificados e qual o custo de matrícula por cada um deles?',
      options: [
        { text: 'Sim, monitoramos o Custo por Matrícula (CPM) de cada canal e otimizamos o investimento.', score: 3 },
        { text: 'Temos uma ideia geral, mas não medimos o custo de forma precisa.', score: 2 },
        { text: 'Não, investimos onde "achamos" que dá resultado. Segredo não paga boleto.', score: 1 },
      ],
    },
    {
      question: 'O conteúdo que sua escola posta nas redes sociais serve para tirar as dúvidas e resolver as "dores" dos pais, ou é apenas um mural de fotos de eventos e feriados?',
      options: [
        { text: 'Nosso conteúdo é estratégico, focado em responder às preocupações dos pais.', score: 3 },
        { text: 'É uma mistura, mas 80% do tempo é sobre nós e nossos eventos.', score: 2 },
        { text: 'É basicamente um álbum de fotos, sem estratégia de atração.', score: 1 },
      ],
    },
    {
      question: 'Um pai visitou o site da sua escola, mas não agendou uma visita. Você tem alguma forma de "seguir" esse pai com anúncios e lembretes sobre o período de matrículas?',
      options: [
        { text: 'Sim, usamos pixels de remarketing para reengajar visitantes não convertidos.', score: 3 },
        { text: 'Temos um pop-up de newsletter, mas a adesão é baixa e pouco estratégica.', score: 2 },
        { text: 'Não, se o pai sai do site, a oportunidade está perdida para sempre.', score: 1 },
      ],
    },
    {
      question: 'Sua escola tem um "imã digital" (ex: Ebook sobre "Como escolher a escola certa", Checklist da visita perfeita) para capturar o contato de pais que ainda estão no início da jornada de decisão?',
      options: [
        { text: 'Sim, temos iscas digitais que geram uma lista de contatos qualificados.', score: 3 },
        { text: 'Já pensamos nisso, mas nunca colocamos em prática.', score: 2 },
        { text: 'Não, nosso único ponto de captura é o formulário de "agende uma visita".', score: 1 },
      ],
    },
  ],
  vendas: [
    {
      question: 'O processo para agendar uma visita e fazer a matrícula é tão simples que poderia ser feito pelo celular em 5 minutos, ou exige preenchimento de papéis e várias idas à secretaria?',
      options: [
        { text: 'Nosso processo é 100% digital, rápido e elogiado pelos pais.', score: 3 },
        { text: 'É um misto de digital e presencial, o que gera alguma fricção.', score: 2 },
        { text: 'É burocrático, lento e sabemos que perdemos matrículas por isso.', score: 1 },
      ],
    },
    {
      question: 'Sua equipe de atendimento está treinada para vender o PROJETO PEDAGÓGICO e o valor da escola, ou o foco da conversa é sempre em preço, desconto e estrutura física?',
      options: [
        { text: 'O foco é no valor e na transformação que a escola oferece. O preço é consequência.', score: 3 },
        { text: 'Tentam focar no valor, mas acabam cedendo à conversa de preço muito rápido.', score: 2 },
        { text: 'A conversa é um "tour" pela escola seguido da tabela de preços.', score: 1 },
      ],
    },
    {
      question: 'Existe um sistema (CRM) para gerenciar os interessados, com lembretes automáticos para a equipe fazer follow-up e um histórico de cada conversa?',
      options: [
        { text: 'Sim, nosso CRM garante que nenhum interessado seja esquecido.', score: 3 },
        { text: 'Usamos uma planilha, mas o controle é falho e manual.', score: 2 },
        { text: 'Não, cada pessoa anota do seu jeito e muitas oportunidades se perdem.', score: 1 },
      ],
    },
    {
      question: 'Após a visita, os pais recebem algum material de reforço (vídeo, e-mail personalizado) para ajudar na decisão, ou a escola fica esperando passivamente pelo contato deles?',
      options: [
        { text: 'Sim, temos um fluxo de nutrição pós-visita para manter o interesse aquecido.', score: 3 },
        { text: 'Enviamos um e-mail padrão de agradecimento, e só.', score: 2 },
        { text: 'Não, ficamos 100% na dependência da iniciativa dos pais.', score: 1 },
      ],
    },
    {
      question: 'Sua escola mede a taxa de conversão (de interessado para visitante, de visitante para matriculado) para identificar e corrigir gargalos no processo de matrícula?',
      options: [
        { text: 'Sim, analisamos o funil de matrículas constantemente para otimizar cada etapa.', score: 3 },
        { text: 'Sabemos o número final de matrículas, mas não as taxas de conversão intermediárias.', score: 2 },
        { text: 'Não medimos nada, apenas torcemos para a meta de matrículas ser batida.', score: 1 },
      ],
    },
  ],
};
