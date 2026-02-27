# app.py (Versão Final com Pré-visualização de Link - Open Graph)
import streamlit as st
import plotly.graph_objects as go
import urllib.parse
import gspread
from datetime import datetime
import pandas as pd

# --- CONFIGURAÇÃO DA PÁGINA (COM AJUSTES PARA PRÉ-VISUALIZAÇÃO) ---
st.set_page_config(
    # Este título aparecerá na pré-visualização do link
    page_title="Woow Marketing: Faça seu Diagnóstico de Maturidade Digital",
    
    # Esta imagem será usada como o ícone da aba E como a thumbnail no WhatsApp
    page_icon="https://i.imgur.com/cHuMNC4.png",
    
    layout="centered"
)

# CSS Aprimorado para forçar Poppins, ajustar tamanhos e corrigir layout mobile.
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

/* Aplica a fonte Poppins a todos os elementos */
html, body, [class*="st-"], .st-emotion-cache-10trblm, .st-emotion-cache-1kyxreq {
    font-family: 'Poppins', sans-serif;
}

/* Títulos principais (h1) */
h1 {
    font-family: 'Poppins', sans-serif !important;
    font-weight: 700 !important;
}

/* Subtítulos (h2) - Perguntas do quiz */
h2 {
    font-family: 'Poppins', sans-serif !important;
    font-weight: 600 !important;
}

/* Títulos de seção (h3) */
h3 {
    font-family: 'Poppins', sans-serif !important;
    font-weight: 600 !important;
}

/* Aumenta o tamanho e o espaçamento das opções de resposta (radio buttons) */
div[role="radiogroup"] > label {
    font-size: 20px !important;
    padding-top: 10px !important;
    padding-bottom: 10px !important;
    line-height: 1.6 !important;
}

/* Corrige o alinhamento no topo para mobile */
div[data-testid="stBlockContainer"] {
    padding-top: 2rem !important;
}

</style>
""", unsafe_allow_html=True)


# --- CONEXÃO COM GOOGLE SHEETS ---
def connect_to_gsheets():
    try:
        creds = {
            "type": st.secrets["type"],
            "project_id": st.secrets["project_id"],
            "private_key_id": st.secrets["private_key_id"],
            "private_key": st.secrets["private_key"],
            "client_email": st.secrets["client_email"],
            "client_id": st.secrets["client_id"],
            "auth_uri": st.secrets["auth_uri"],
            "token_uri": st.secrets["token_uri"],
            "auth_provider_x509_cert_url": st.secrets["auth_provider_x509_cert_url"],
            "client_x509_cert_url": st.secrets["client_x509_cert_url"]
        }
        sa = gspread.service_account_from_dict(creds)
        sh = sa.open("Relatório de Visitas - Diagnóstico")
        return sh.sheet1
    except Exception as e:
        st.error("A conexão com a planilha falhou. Verifique a configuração dos segredos.")
        st.exception(e)
        return None

# --- DADOS DO DIAGNÓSTICO (sem alterações) ---
DIAGNOSTIC_QUESTIONS = {
  "branding": [
    {
      "question": 'Fora do seu negócio, os clientes conseguem descrever claramente o que o torna ÚNICO, ou vocês são apenas "mais uma opção" na região?',
      "options": [
        {'text': 'Sim, nosso propósito e método são conhecidos e valorizados pela comunidade.', 'score': 3},
        {'text': 'Alguns sabem, mas a percepção geral ainda é confusa ou baseada só em preço.', 'score': 2},
        {'text': 'Não, somos vistos como uma opção genérica, sem um diferencial claro.', 'score': 1},
      ],
    },
    {
      "question": 'A comunicação visual do seu negócio (logo, site, redes sociais, fachada) transmite a mesma mensagem de qualidade e profissionalismo que você promete?',
      "options": [
        {'text': 'Sim, nossa identidade visual é coesa, profissional e reflete nossa proposta de valor.', 'score': 3},
        {'text': 'É funcional, mas visivelmente amadora ou inconsistente em alguns pontos.', 'score': 2},
        {'text': 'Não, nossa imagem parece antiquada e não condiz com a qualidade que oferecemos.', 'score': 1},
      ],
    },
    {
      "question": 'Você produz conteúdo (palestras, artigos, vídeos) que posiciona você ou sua equipe como autoridades no seu mercado?',
      "options": [
        {'text': 'Sim, somos uma referência e fonte de consulta para temas do nosso setor.', 'score': 3},
        {'text': 'Fazemos algumas ações pontuais, mas sem uma estratégia de autoridade.', 'score': 2},
        {'text': 'Não, nossa comunicação é focada apenas em ofertas e produtos.', 'score': 1},
      ],
    },
    {
      "question": 'Os clientes atuais são "advogados" da sua marca? Eles indicam seu negócio ativamente ou o "boca a boca" é fraco?',
      "options": [
        {'text': 'Temos um forte programa de indicações e clientes que são verdadeiros fãs.', 'score': 3},
        {'text': 'Recebemos indicações, mas de forma passiva, sem um incentivo claro.', 'score': 2},
        {'text': 'O boca a boca é neutro ou até negativo em alguns casos.', 'score': 1},
      ],
    },
    {
      "question": 'Qual história o seu negócio conta? Existe uma narrativa que conecta emocionalmente os clientes com a sua marca?',
      "options": [
        {'text': 'Sim, nossa história é poderosa, conhecida e contada com orgulho.', 'score': 3},
        {'text': 'Temos uma história, mas ela não é usada como ferramenta de marketing.', 'score': 2},
        {'text': 'Não temos uma narrativa definida, focamos apenas nos produtos/serviços.', 'score': 1},
      ],
    },
  ],
  "marketing": [
    {
      "question": 'Se a procura espontânea por seus serviços parasse hoje, você teria um plano B para gerar ativamente novos interessados amanhã?',
      "options": [
        {'text': 'Sim, temos campanhas de tráfego pago e funis de captação sempre ativos.', 'score': 3},
        {'text': 'Fazemos alguns anúncios, mas sem uma estratégia contínua e previsível.', 'score': 2},
        {'text': 'Não, dependemos 100% da procura orgânica. Seria o caos.', 'score': 1},
      ],
    },
    {
      "question": 'Você sabe exatamente qual canal de marketing (Google, Instagram, etc.) traz os clientes mais qualificados e qual o custo por aquisição em cada um?',
      "options": [
        {'text': 'Sim, monitoramos o Custo por Aquisição (CPA) de cada canal e otimizamos o investimento.', 'score': 3},
        {'text': 'Temos uma ideia geral, mas não medimos o custo de forma precisa.', 'score': 2},
        {'text': 'Não, investimos onde "achamos" que dá resultado. Segredo não paga boleto.', 'score': 1},
      ],
    },
    {
      "question": 'O conteúdo que você posta nas redes sociais serve para resolver as "dores" dos clientes, ou é apenas uma vitrine de produtos e ofertas?',
      "options": [
        {'text': 'Nosso conteúdo é estratégico, focado em responder às preocupações dos clientes.', 'score': 3},
        {'text': 'É uma mistura, mas 80% do tempo é sobre nós e nossos produtos.', 'score': 2},
        {'text': 'É basicamente um catálogo de ofertas, sem estratégia de atração.', 'score': 1},
      ],
    },
    {
      "question": 'Um cliente visitou seu site, mas não comprou. Você tem alguma forma de "seguir" esse cliente com anúncios e lembretes?',
      "options": [
        {'text': 'Sim, usamos pixels de remarketing para reengajar visitantes não convertidos.', 'score': 3},
        {'text': 'Temos um pop-up de newsletter, mas a adesão é baixa e pouco estratégica.', 'score': 2},
        {'text': 'Não, se o cliente sai do site, a oportunidade está perdida.', 'score': 1},
      ],
    },
    {
      "question": 'Seu negócio tem um "imã digital" (ex: Ebook, Guia, Checklist) para capturar o contato de clientes que ainda estão no início da jornada de decisão?',
      "options": [
        {'text': 'Sim, temos iscas digitais que geram uma lista de contatos qualificados.', 'score': 3},
        {'text': 'Já pensamos nisso, mas nunca colocamos em prática.', 'score': 2},
        {'text': 'Não, nosso único ponto de captura é o formulário de "fale conosco".', 'score': 1},
      ],
    },
  ],
  "vendas": [
    {
      "question": 'Seu processo de compra é tão simples que poderia ser feito pelo celular em 5 minutos, ou exige etapas burocráticas?',
      "options": [
        {'text': 'Nosso processo é 100% digital, rápido e elogiado pelos clientes.', 'score': 3},
        {'text': 'É um misto de digital e manual, o que gera alguma fricção.', 'score': 2},
        {'text': 'É burocrático, lento e sabemos que perdemos vendas por isso.', 'score': 1},
      ],
    },
    {
      "question": 'Sua equipe está treinada para vender o VALOR da sua solução, ou o foco da conversa é sempre em preço e desconto?',
      "options": [
        {'text': 'O foco é no valor e na transformação que oferecemos. O preço é consequência.', 'score': 3},
        {'text': 'Tentam focar no valor, mas acabam cedendo à conversa de preço muito rápido.', 'score': 2},
        {'text': 'A conversa é um "tour" pelo produto seguido da tabela de preços.', 'score': 1},
      ],
    },
    {
      "question": 'Existe um sistema (CRM) para gerenciar os interessados, com lembretes para follow-up e um histórico de cada conversa?',
      "options": [
        {'text': 'Sim, nosso CRM garante que nenhum interessado seja esquecido.', 'score': 3},
        {'text': 'Usamos uma planilha, mas o controle é falho e manual.', 'score': 2},
        {'text': 'Não, cada pessoa anota do seu jeito e muitas oportunidades se perdem.', 'score': 1},
      ],
    },
    {
      "question": 'Após uma demonstração, os clientes recebem algum material de reforço para ajudar na decisão, ou você fica esperando passivamente pelo contato deles?',
      "options": [
        {'text': 'Sim, temos um fluxo de nutrição pós-contato para manter o interesse aquecido.', 'score': 3},
        {'text': 'Enviamos um e-mail padrão de agradecimento, e só.', 'score': 2},
        {'text': 'Não, ficamos 100% na dependência da iniciativa dos clientes.', 'score': 1},
      ],
    },
    {
      "question": 'Você mede a taxa de conversão em cada etapa do funil de vendas para identificar e corrigir gargalos?',
      "options": [
        {'text': 'Sim, analisamos o funil constantemente para otimizar cada etapa.', 'score': 3},
        {'text': 'Sabemos o número final de vendas, mas não as taxas de conversão intermediárias.', 'score': 2},
        {'text': 'Não medimos nada, apenas torcemos para a meta de vendas ser batida.', 'score': 1},
      ],
    },
  ],
}

# --- ESTADO DA SESSÃO ---
if 'page' not in st.session_state:
    st.session_state.page = 'welcome'
    st.session_state.answers = {}
    st.session_state.current_question = 0
    st.session_state.category = 'branding'
    st.session_state.visit_logged = False

def log_visit(worksheet):
    if worksheet and not st.session_state.get('visit_logged', False):
        try:
            session_id = st.runtime.scriptrunner.get_script_run_ctx().session_id
            new_row = [session_id, datetime.now().strftime("%Y-%m-%d %H:%M:%S"), "", "", ""]
            worksheet.append_row(new_row)
            st.session_state.visit_logged = True
        except Exception as e:
            print(f"Erro ao registrar visita: {e}")

def log_completion(worksheet, user_name, user_phone):
    if worksheet:
        try:
            session_id = st.runtime.scriptrunner.get_script_run_ctx().session_id
            cell = worksheet.find(session_id)
            if cell:
                worksheet.update_cell(cell.row, 3, user_name)
                worksheet.update_cell(cell.row, 4, datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
                worksheet.update_cell(cell.row, 5, user_phone)
        except Exception as e:
            print(f"Erro ao registrar preenchimento: {e}")

# --- FUNÇÕES DE GRÁFICOS ---
def create_gauge_chart(score, title):
    if score <= 35: color = "#DC2626"
    elif score <= 70: color = "#FBBF24"
    else: color = "#16A34A"
    fig = go.Figure(go.Indicator(
        mode="gauge+number", value=score, title={'text': title, 'font': {'size': 20}},
        number={'suffix': "%", 'font': {'size': 28}},
        gauge={'axis': {'range': [None, 100]}, 'bar': {'color': color},
               'steps': [{'range': [0, 35], 'color': '#FECACA'}, {'range': [35, 70], 'color': '#FDE68A'}, {'range': [70, 100], 'color': '#A7F3D0'}]}))
    fig.update_layout(height=250, margin=dict(l=10, r=10, t=50, b=10))
    return fig

def create_bar_chart(data):
    fig = go.Figure(go.Bar(x=[item['name'] for item in data], y=[item['percentual'] for item in data], marker_color='#00A9FF'))
    fig.update_layout(title="Visão Geral", yaxis=dict(range=[0,100]), height=400)
    return fig

def create_radar_chart(data):
    fig = go.Figure()
    fig.add_trace(go.Scatterpolar(r=[item['percentual'] for item in data], theta=[item['name'] for item in data], fill='toself', name='Diagnóstico', marker_color='#00A9FF'))
    fig.update_layout(polar=dict(radialaxis=dict(visible=True, range=[0, 100])), showlegend=False, title="Balanço Estratégico", height=400)
    return fig

# --- HEADER ---
st.image("https://i.imgur.com/cHuMNC4.png", width=200)
st.markdown("---")

# --- PÁGINAS DA APLICAÇÃO ---
def show_welcome_page():
    worksheet = connect_to_gsheets()
    if worksheet:
        log_visit(worksheet)
        st.title("Diagnóstico de Maturidade Digital")
        st.markdown("Descubra o nível de maturidade digital do seu negócio em **Branding, Marketing e Vendas**.")
        if st.button("🚀 Começar Diagnóstico"):
            st.session_state.page = 'quiz'
            st.rerun()

def show_quiz_page():
    category = st.session_state.category
    questions = DIAGNOSTIC_QUESTIONS[category]
    q_index = st.session_state.current_question
    st.header(f"Etapa: {category.capitalize()}")
    progress_value = (q_index) / len(questions)
    st.progress(progress_value)
    st.markdown(f"Pergunta {q_index + 1} de {len(questions)}")
    question_data = questions[q_index]
    
    st.markdown(f"<h2 style='font-size: 35px; line-height: 1.5;'>{question_data['question']}</h2>", unsafe_allow_html=True)
    
    options = [opt['text'] for opt in question_data['options']]
    with st.form(key=f"quiz_form_{category}_{q_index}"):
        user_choice = st.radio("Escolha uma opção:", options, key=f"radio_{category}_{q_index}", index=None)
        submitted = st.form_submit_button("Avançar")
        if submitted:
            if user_choice is None:
                st.warning("Por favor, selecione uma opção para continuar.")
            else:
                selected_score = [opt['score'] for opt in question_data['options'] if opt['text'] == user_choice][0]
                st.session_state.answers[f"{category}-{q_index}"] = selected_score
                if q_index + 1 < len(questions):
                    st.session_state.current_question += 1
                else:
                    categories = list(DIAGNOSTIC_QUESTIONS.keys())
                    current_cat_index = categories.index(category)
                    if current_cat_index + 1 < len(categories):
                        st.session_state.category = categories[current_cat_index + 1]
                        st.session_state.current_question = 0
                    else:
                        st.session_state.page = 'results'
                st.rerun()

def show_results_page():
    st.title("Seu Diagnóstico está Pronto!")
    st.markdown("O seu balcão de vendas está aberto ou escondido? Veja os pontos de melhoria.")
    scores, total_possible = {}, {}
    for cat, questions in DIAGNOSTIC_QUESTIONS.items():
        cat_score = sum(st.session_state.answers.get(f"{cat}-{i}", 0) for i, q in enumerate(questions))
        scores[cat], total_possible[cat] = cat_score, len(questions) * 3
    percentages = {cat: round((scores[cat] / total_possible[cat]) * 100) if total_possible[cat] > 0 else 0 for cat in scores}
    cols = st.columns(3)
    for i, cat in enumerate(percentages):
        with cols[i]:
            score = percentages[cat]
            
            if score <= 35:
                level = 'Zona de Risco Iminente'
                recommendation = "Sua estratégia nesta área está vulnerável. A inércia aqui não é uma opção, pois cada dia sem ação representa uma perda real de clientes para concorrentes mais preparados."
                box_style = "background-color: #DC2626; color: white; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem; min-height: 220px;"
            elif score <= 70:
                level = 'Crescimento Estagnado'
                recommendation = "Você está no campo de batalha, mas com as ferramentas erradas. Manter o status quo significa permitir que seus concorrentes mais ágeis definam as regras do jogo e capturem a maior parte do mercado."
                box_style = "background-color: #FBBF24; color: black; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem; min-height: 220px;"
            else:
                level = 'Potencial Inexplorado'
                recommendation = "Você construiu uma base sólida, mas está deixando dinheiro na mesa. O desafio agora é transformar essa força em domínio de mercado, otimizando processos para capturar o potencial que outros nem conseguem ver."
                box_style = "background-color: #16A34A; color: white; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem; min-height: 220px;"

            st.plotly_chart(create_gauge_chart(score, cat.capitalize()), use_container_width=True)
            st.subheader(level)
            st.markdown(f'<div style="{box_style}">{recommendation}</div>', unsafe_allow_html=True)
            
    st.markdown("---")
    st.header("Análise Comparativa")
    chart_data = [{'name': cat.capitalize(), 'percentual': perc} for cat, perc in percentages.items()]
    col1, col2 = st.columns(2)
    with col1: st.plotly_chart(create_bar_chart(chart_data), use_container_width=True)
    with col2: st.plotly_chart(create_radar_chart(chart_data), use_container_width=True)
    st.markdown("---")
    if st.button("📲 Salvar Minha Análise no WhatsApp"):
        st.session_state.show_form = True
    if st.session_state.get('show_form', False):
        with st.form("whatsapp_form"):
            st.subheader("Plano de Ação Detalhado")
            st.write("Para onde posso enviar o resumo da nossa conversa?")
            name = st.text_input("Seu primeiro nome")
            phone = st.text_input("Seu WhatsApp com DDD (ex: 11912345678)")
            submit_button = st.form_submit_button("Abrir e Salvar no WhatsApp")
            if submit_button:
                if name and phone:
                    worksheet = connect_to_gsheets()
                    log_completion(worksheet, name, phone)
                    
                    analysis_text = f"*Diagnóstico para {name}*\n\n"
                    analysis_text += "Resumo da sua análise:\n"
                    for cat, perc in percentages.items(): analysis_text += f"*{cat.upper()}:* {perc}%\n"
                    analysis_text += "\n*Próximos Passos:*\nPodemos traçar um plano de ação prático. Quando conversamos por 15 minutos?\n\nLembre-se: Seu negócio é a única opção ou apenas mais uma?"
                    encoded_text = urllib.parse.quote(analysis_text)
                    clean_phone = ''.join(filter(str.isdigit, phone))
                    whatsapp_url = f"https://wa.me/55{clean_phone}?text={encoded_text}"
                    link_markdown = f"""<div style="text-align: center; margin-top: 20px;"><p>Perfeito! Clique no link abaixo para salvar sua análise agora mesmo:</p><a href="{whatsapp_url}" target="_blank" style="display: inline-block; padding: 15px 25px; font-size: 18px; color: white; background-color: #25D366; border-radius: 30px; text-decoration: none; font-weight: bold;">📲 CLIQUE AQUI PARA SALVAR</a></div>"""
                    st.markdown(link_markdown, unsafe_allow_html=True)
                    st.session_state.show_form = False
                else:
                    st.error("Por favor, preencha seu nome e WhatsApp.")

# --- ROTEADOR PRINCIPAL ---
if st.session_state.page == 'welcome':
    show_welcome_page()
elif st.session_state.page == 'quiz':
    show_quiz_page()
elif st.session_state.page == 'results':
    show_results_page()
