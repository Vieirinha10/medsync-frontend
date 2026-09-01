import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheck, FiShield, FiUsers } from 'react-icons/fi';
import { FREE_PLAN, PREMIUM_BILLING_OPTIONS } from '../../config/pricing';

const PREMIUM_ACCESS_HIGHLIGHTS = [
  '80 casos clínicos',
  '150 desafios visuais',
  'Feedback clínico personalizado da Synapse',
];

const HomePricingSections = () => (
  <>
      <section className="solid-value-section home-reveal" data-home-reveal aria-labelledby="pricing-title">
        <header className="solid-section-heading">
          <h2 id="pricing-title">Comece gratuito. Avance quando fizer sentido.</h2>
          <p>Conheça o método sem compromisso e escolha a forma de acesso que acompanha o seu ritmo.</p>
        </header>

        <div className="solid-plan-grid">
          <article className="solid-plan-card is-free">
            <span>PARA CONHECER</span>
            <h3>{FREE_PLAN.name}</h3>
            <div className="solid-price">{FREE_PLAN.price}</div>
            <p>Experimente a prática clínica interativa antes de escolher um plano.</p>
            <ul>
              <li><FiCheck /> 5 casos clínicos por mês</li>
              <li><FiCheck /> 10 questões de provas por dia</li>
              <li><FiCheck /> Desafios visuais introdutórios</li>
              <li><FiCheck /> Histórico pessoal de desempenho</li>
            </ul>
            <Link to="/cadastro">Criar conta grátis <FiArrowRight /></Link>
          </article>

          {PREMIUM_BILLING_OPTIONS.map((plan) => (
            <article
              className={`solid-plan-card is-premium-option is-${plan.id}${plan.featured ? ' is-featured' : ''}${plan.bestValue ? ' is-best-value' : ''}`}
              key={plan.id}
            >
              <span>{plan.badge}</span>
              <h3>{plan.name}</h3>
              <div className="solid-price">{plan.price} <small>{plan.billingLabel}</small></div>
              <p>{plan.description}</p>
              <ul>
                {plan.highlights.map((highlight) => (
                  <li key={highlight}><FiCheck /> {highlight}</li>
                ))}
                {PREMIUM_ACCESS_HIGHLIGHTS.map((highlight) => (
                  <li key={highlight}><FiCheck /> {highlight}</li>
                ))}
              </ul>
              <Link to="/assinatura">Ver esta opção <FiArrowRight /></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="solid-trust home-reveal" data-home-reveal>
        <div>
          <FiShield aria-hidden="true" />
          <span>CONSTRUÍDO PARA A FORMAÇÃO MÉDICA</span>
        </div>
        <h2>Estude com método.<br /><span className="fluid-words-green">Decida com confiança.</span></h2>
        <p>Treine hoje o raciocínio clínico que você vai precisar levar para o internato e para os plantões de amanhã.</p>
        <Link to="/cadastro" className="solid-primary-button">
          Começar gratuitamente <FiArrowRight />
        </Link>
        <small><FiUsers /> Para estudantes que querem ir além do estudo passivo.</small>
      </section>
  </>
);

export default HomePricingSections;
