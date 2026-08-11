import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import {
  FREE_PLAN,
  MONTHLY_RECURRING_PLAN,
  PREMIUM_ANNUAL_SAVINGS,
  PREMIUM_BILLING_OPTIONS,
  QUARTERLY_VS_ONE_TIME_SAVINGS,
} from '../config/pricing';
import { getAuthToken } from '../services/api';

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

const billingIcons = {
  avulso: FiClock,
  recorrente: FiRefreshCw,
  trimestral: FiLayers,
};

const PlanosPage = () => {
  const navigate = useNavigate();

  const startCheckout = (planId) => {
    if (!getAuthToken()) {
      navigate('/login', { state: { from: { pathname: `/checkout/${planId}` } } });
      return;
    }
    navigate(`/checkout/${planId}`);
  };

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
            <span><FiCheckCircle aria-hidden="true" /> Escolha entre Pix ou cartão</span>
          </div>
        </div>

        <div className="pricing-hero-offer" aria-label="Resumo do plano Premium">
          <div className="pricing-offer-topline">
            <span>PREMIUM</span>
            <strong>{MONTHLY_RECURRING_PLAN.badge}</strong>
          </div>
          <div className="pricing-offer-price is-complete">
            <strong>{MONTHLY_RECURRING_PLAN.price}</strong>
            <div><b>por mês</b><span>no cartão recorrente</span></div>
          </div>
          <p>Cerca de R$ 0,80 por dia e {PREMIUM_ANNUAL_SAVINGS} de economia anual em relação ao mensal avulso.</p>
          <div className="pricing-offer-feature">
            <FiZap aria-hidden="true" />
            <span><strong>Praticidade sem perder flexibilidade</strong>Renovação automática e cancelamento quando quiser.</span>
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
          <h2 id="pricing-plans-title">Um Premium, três formas de pagar</h2>
          <p>Os benefícios são os mesmos em todas as opções Premium. Escolha a condição que combina melhor com a sua rotina.</p>
        </div>

        <div className="pricing-plan-grid pricing-plan-grid-expanded">
          <article className="pricing-plan-card">
            <div className="pricing-plan-heading">
              <span className="pricing-plan-icon"><FiBookOpen aria-hidden="true" /></span>
              <div>
                <small>PARA CONHECER</small>
                <h3>{FREE_PLAN.name}</h3>
              </div>
            </div>
            <div className="pricing-plan-price"><strong>{FREE_PLAN.price}</strong><span>{FREE_PLAN.billingLabel}</span></div>
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

          {PREMIUM_BILLING_OPTIONS.map((plan) => {
            const BillingIcon = billingIcons[plan.id];
            return (
              <article
                className={`pricing-plan-card is-premium is-${plan.id}${plan.featured ? ' is-featured' : ''}${plan.bestValue ? ' is-best-value' : ''}`}
                key={plan.id}
              >
                <span className="pricing-popular-badge"><FiStar aria-hidden="true" /> {plan.badge}</span>
                <div className="pricing-plan-heading">
                  <span className="pricing-plan-icon"><BillingIcon aria-hidden="true" /></span>
                  <div>
                    <small>PREMIUM · {plan.paymentMethod.toUpperCase()}</small>
                    <h3>{plan.name}</h3>
                  </div>
                </div>
                <div className="pricing-plan-price"><strong>{plan.price}</strong><span>{plan.billingLabel}</span></div>
                <p className="pricing-plan-description">{plan.description}</p>
                <ul>
                  {plan.highlights.map((highlight) => (
                    <li key={highlight}><FiCheck aria-hidden="true" />{highlight}</li>
                  ))}
                  <li><FiCheck aria-hidden="true" />Todos os benefícios Premium</li>
                </ul>
                <button
                  type="button"
                  className="pricing-plan-button is-primary"
                  onClick={() => startCheckout(plan.id)}
                >
                  <>Escolher {plan.name}<FiArrowRight aria-hidden="true" /></>
                </button>
                <small className="pricing-plan-note">Pagamento seguro processado pela Asaas.</small>
              </article>
            );
          })}
        </div>

        <div className="pricing-premium-benefits">
          <div>
            <span><FiZap aria-hidden="true" /></span>
            <div><small>INCLUÍDO EM TODAS AS OPÇÕES</small><h3>Experiência Premium completa</h3></div>
          </div>
          <ul>
            {premiumBenefits.map((benefit) => (
              <li key={benefit}><FiCheckCircle aria-hidden="true" />{benefit}</li>
            ))}
          </ul>
        </div>

        <div className="pricing-launch-note">
          <FiClock aria-hidden="true" />
          <p><strong>Checkout protegido pela Asaas.</strong> A confirmação do acesso Premium acontece automaticamente após a validação do pagamento.</p>
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
        <p className="pricing-comparison-caption">Todos os formatos de pagamento liberam os mesmos benefícios Premium.</p>
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
            <summary>Como faço para assinar o Premium?</summary>
            <p>Entre na sua conta, escolha uma das três modalidades e conclua o pagamento no checkout seguro da Asaas. O MedSync libera o acesso após a confirmação financeira.</p>
          </details>
          <details>
            <summary>Quais são os valores e as formas de pagamento?</summary>
            <p>O mensal avulso custa R$ 25,90 via Pix e libera 30 dias sem renovação automática. O mensal recorrente custa R$ 23,90 no cartão. O trimestral custa R$ 65,90 no cartão, com parcelamento em até 3x.</p>
          </details>
          <details>
            <summary>Os benefícios mudam conforme a forma de pagamento?</summary>
            <p>Não. As três opções pagas liberam a mesma experiência Premium. O que muda é a duração, a forma de cobrança e a economia oferecida.</p>
          </details>
          <details>
            <summary>Qual opção oferece a maior economia?</summary>
            <p>O trimestral tem o menor valor mensal equivalente, R$ 21,97, e economiza {QUARTERLY_VS_ONE_TIME_SAVINGS} em comparação a três pagamentos mensais avulsos.</p>
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
          <p>Crie sua conta, conheça os casos e escolha a modalidade Premium ideal para a sua rotina.</p>
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
