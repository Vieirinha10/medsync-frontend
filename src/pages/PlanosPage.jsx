import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiActivity,
  FiArrowRight,
  FiBarChart2,
  FiBookOpen,
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiLayers,
  FiRefreshCw,
  FiStar,
  FiTarget,
  FiTrendingUp,
  FiZap,
} from 'react-icons/fi';

const freeBenefits = [
  'Acesso aos casos clínicos selecionados',
  'Desafios visuais para treinos rápidos',
  'Histórico das atividades realizadas',
  'Painel pessoal com seu progresso',
];

const premiumBenefits = [
  'Biblioteca completa de casos clínicos',
  'Simulações e desafios sem limite mensal',
  'Todas as especialidades disponíveis',
  'Feedback completo sobre exames, hipótese e conduta',
  'Indicadores detalhados de desempenho',
  'Repetição de casos para comparar sua evolução',
  'Prioridade no acesso a novos conteúdos',
];

const valueHighlights = [
  {
    icon: FiActivity,
    title: 'Pratique sem interrupções',
    text: 'Mantenha a constância com acesso amplo às simulações e aos desafios da plataforma.',
  },
  {
    icon: FiTarget,
    title: 'Entenda cada decisão',
    text: 'Revise exames solicitados, hipótese diagnóstica e conduta para reconhecer onde melhorar.',
  },
  {
    icon: FiTrendingUp,
    title: 'Acompanhe sua evolução',
    text: 'Transforme cada tentativa em dados claros para direcionar os próximos estudos.',
  },
  {
    icon: FiLayers,
    title: 'Explore mais especialidades',
    text: 'Amplie seu repertório clínico com conteúdos variados e novos casos ao longo do tempo.',
  },
];

const comparisonRows = [
  ['Casos clínicos', 'Seleção mensal', 'Acesso completo'],
  ['Desafios visuais', 'Seleção disponível', 'Sem limite mensal'],
  ['Especialidades', 'Acesso selecionado', 'Todas disponíveis'],
  ['Feedback da resolução', 'Essencial', 'Completo e detalhado'],
  ['Painel de desempenho', 'Resumo do progresso', 'Indicadores avançados'],
  ['Repetir e comparar casos', '—', 'Incluído'],
  ['Novos conteúdos', 'Acesso regular', 'Acesso prioritário'],
];

const audiences = [
  {
    icon: FiBookOpen,
    title: 'Para consolidar a teoria',
    text: 'Aplique o conteúdo estudado em decisões semelhantes às encontradas na prática clínica.',
  },
  {
    icon: FiClock,
    title: 'Para criar constância',
    text: 'Alterne casos completos e desafios rápidos de acordo com o tempo disponível no dia.',
  },
  {
    icon: FiRefreshCw,
    title: 'Para aprender com os erros',
    text: 'Refaça casos, compare escolhas e acompanhe como seu raciocínio evolui com a prática.',
  },
];

const PlanosPage = () => {
  return (
    <div className="pricing-page">
      <section className="pricing-hero">
        <div className="pricing-hero-copy">
          <span className="pricing-eyebrow">
            <FiStar aria-hidden="true" />
            PLANOS MEDSYNC
          </span>
          <h1>
            Mais prática clínica para você
            <span> evoluir com confiança.</span>
          </h1>
          <p>
            Comece gratuitamente e conheça a dinâmica do MedSync. Quando quiser
            ampliar seu ritmo de estudos, o Premium acompanha sua evolução.
          </p>
          <div className="pricing-hero-actions">
            <a href="#comparar-planos" className="pricing-primary-action">
              Comparar planos
              <FiArrowRight aria-hidden="true" />
            </a>
            <Link to="/cadastro" className="pricing-secondary-action">
              Criar conta grátis
            </Link>
          </div>
          <div className="pricing-hero-proof" aria-label="Destaques do plano">
            <span><FiCheckCircle aria-hidden="true" /> Comece sem pagar</span>
            <span><FiCheckCircle aria-hidden="true" /> Sem cobrança agora</span>
          </div>
        </div>

        <div className="pricing-hero-offer" aria-label="Resumo do plano Premium">
          <div className="pricing-offer-topline">
            <span>PREMIUM</span>
            <strong>Em preparação</strong>
          </div>
          <div className="pricing-offer-price">
            <small>R$</small>
            <strong>19</strong>
            <div><b>,90</b><span>/mês</span></div>
          </div>
          <p>Menos de R$ 0,67 por dia para manter seu treinamento clínico em movimento.</p>
          <div className="pricing-offer-feature">
            <FiZap aria-hidden="true" />
            <span><strong>Mais liberdade para praticar</strong>Casos, desafios e evolução em um só lugar.</span>
          </div>
        </div>
      </section>

      <section className="pricing-intro" aria-labelledby="pricing-value-title">
        <div className="pricing-section-heading">
          <span>POR QUE ESCOLHER O PREMIUM?</span>
          <h2 id="pricing-value-title">Um plano pensado para transformar estudo em prática</h2>
          <p>Mais do que liberar conteúdo, o Premium organiza uma rotina contínua de decisão, revisão e evolução clínica.</p>
        </div>
        <div className="pricing-value-grid">
          {valueHighlights.map(({ icon: Icon, title, text }) => (
            <article key={title}>
              <span>{React.createElement(Icon, { 'aria-hidden': true })}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pricing-plans" id="comparar-planos" aria-labelledby="pricing-plans-title">
        <div className="pricing-section-heading is-centered">
          <span>ESCOLHA COMO COMEÇAR</span>
          <h2 id="pricing-plans-title">Seu próximo passo no MedSync</h2>
          <p>Você pode criar sua conta gratuita agora. A assinatura Premium será liberada em uma próxima etapa.</p>
        </div>

        <div className="pricing-plan-grid">
          <article className="pricing-plan-card">
            <div className="pricing-plan-heading">
              <span className="pricing-plan-icon"><FiBookOpen aria-hidden="true" /></span>
              <div>
                <small>PARA CONHECER</small>
                <h3>Gratuito</h3>
              </div>
            </div>
            <div className="pricing-plan-price"><strong>R$ 0</strong><span>para começar</span></div>
            <p className="pricing-plan-description">Explore a metodologia e dê os primeiros passos no seu treinamento clínico.</p>
            <ul>
              {freeBenefits.map((benefit) => (
                <li key={benefit}><FiCheck aria-hidden="true" />{benefit}</li>
              ))}
            </ul>
            <Link to="/cadastro" className="pricing-plan-button is-secondary">
              Começar gratuitamente
              <FiArrowRight aria-hidden="true" />
            </Link>
            <small className="pricing-plan-note">Crie sua conta em poucos passos.</small>
          </article>

          <article className="pricing-plan-card is-premium">
            <span className="pricing-popular-badge"><FiStar aria-hidden="true" /> MELHOR EXPERIÊNCIA</span>
            <div className="pricing-plan-heading">
              <span className="pricing-plan-icon"><FiZap aria-hidden="true" /></span>
              <div>
                <small>PARA EVOLUIR</small>
                <h3>Premium</h3>
              </div>
            </div>
            <div className="pricing-plan-price"><strong>R$ 19,90</strong><span>por mês</span></div>
            <p className="pricing-plan-description">Mais conteúdo, profundidade e autonomia para quem quer praticar com consistência.</p>
            <ul>
              {premiumBenefits.map((benefit) => (
                <li key={benefit}><FiCheck aria-hidden="true" />{benefit}</li>
              ))}
            </ul>
            <Link to="/cadastro" className="pricing-plan-button is-primary">
              Criar conta e acompanhar o lançamento
              <FiArrowRight aria-hidden="true" />
            </Link>
            <small className="pricing-plan-note">Nenhuma cobrança é realizada agora.</small>
          </article>
        </div>

        <div className="pricing-launch-note">
          <FiClock aria-hidden="true" />
          <p><strong>Premium em preparação.</strong> Os benefícios apresentados representam a proposta de lançamento e poderão ser refinados antes da abertura das assinaturas.</p>
        </div>
      </section>

      <section className="pricing-comparison" aria-labelledby="pricing-comparison-title">
        <div className="pricing-section-heading">
          <span>COMPARE OS BENEFÍCIOS</span>
          <h2 id="pricing-comparison-title">Veja o que muda com o Premium</h2>
        </div>
        <div className="pricing-table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Recurso</th>
                <th scope="col">Gratuito</th>
                <th scope="col"><FiStar aria-hidden="true" /> Premium</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map(([feature, free, premium]) => (
                <tr key={feature}>
                  <th scope="row">{feature}</th>
                  <td>{free}</td>
                  <td><FiCheckCircle aria-hidden="true" />{premium}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="pricing-comparison-caption">Comparação baseada na proposta prevista para o lançamento do Premium.</p>
      </section>

      <section className="pricing-audience" aria-labelledby="pricing-audience-title">
        <div className="pricing-section-heading is-centered">
          <span>FEITO PARA A SUA ROTINA</span>
          <h2 id="pricing-audience-title">O Premium combina com você se...</h2>
        </div>
        <div className="pricing-audience-grid">
          {audiences.map(({ icon: Icon, title, text }) => (
            <article key={title}>
              <span>{React.createElement(Icon, { 'aria-hidden': true })}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pricing-faq" aria-labelledby="pricing-faq-title">
        <div className="pricing-section-heading">
          <span>DÚVIDAS FREQUENTES</span>
          <h2 id="pricing-faq-title">Antes de escolher seu plano</h2>
        </div>
        <div className="pricing-faq-list">
          <details>
            <summary>Já posso assinar o Premium?</summary>
            <p>Ainda não. A estrutura de assinatura está sendo preparada. Você pode criar sua conta gratuita agora e acompanhar as novidades do MedSync.</p>
          </details>
          <details>
            <summary>Qual será o valor do plano?</summary>
            <p>A proposta atual é de R$ 19,90 por mês. As condições finais serão apresentadas com transparência antes de qualquer contratação.</p>
          </details>
          <details>
            <summary>O que acontece depois que resolvo um caso?</summary>
            <p>Nos casos compatíveis, você recebe um resultado estruturado para revisar suas escolhas de exames, hipótese diagnóstica e conduta.</p>
          </details>
          <details>
            <summary>O feedback por IA Synapse já está disponível?</summary>
            <p>A Synapse continua em desenvolvimento e não está ativa neste momento. Sua disponibilidade e as condições de acesso serão comunicadas separadamente.</p>
          </details>
          <details>
            <summary>O MedSync substitui orientação médica ou supervisão acadêmica?</summary>
            <p>Não. A plataforma tem finalidade exclusivamente educacional e não substitui avaliação médica, protocolos oficiais ou supervisão de professores e preceptores.</p>
          </details>
        </div>
      </section>

      <section className="pricing-final-cta">
        <div>
          <span><FiBarChart2 aria-hidden="true" /> COMECE PELO GRATUITO</span>
          <h2>Seu raciocínio clínico evolui a cada decisão.</h2>
          <p>Crie sua conta, conheça os casos e prepare-se para aproveitar toda a experiência Premium quando ela for lançada.</p>
        </div>
        <Link to="/cadastro">
          Criar minha conta grátis
          <FiArrowRight aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
};

export default PlanosPage;
