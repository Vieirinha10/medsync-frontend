import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiActivity,
  FiArrowRight,
  FiBarChart2,
  FiBookOpen,
  FiCheck,
  FiCheckCircle,
  FiCompass,
  FiFileText,
  FiLayers,
  FiShield,
  FiTarget,
  FiTrendingUp,
  FiUsers,
  FiZap,
} from 'react-icons/fi';
import { FREE_PLAN, PREMIUM_BILLING_OPTIONS } from '../config/pricing';
import { api } from '../services/api';

const HomePage = () => {
  const [studentCount, setStudentCount] = useState(null);

  useEffect(() => {
    let isMounted = true;

    api.getPublicStats()
      .then(({ estudantes_medsync: count }) => {
        if (isMounted && Number.isInteger(count) && count >= 0) {
          setStudentCount(count);
        }
      })
      .catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, []);

  const formattedStudentCount = studentCount === null
    ? '—'
    : studentCount.toLocaleString('pt-BR');

  return (
    <div className="home-container home-solid">
    <section className="solid-hero">
      <div className="solid-hero-glow solid-hero-glow-one" aria-hidden="true" />
      <div className="solid-hero-glow solid-hero-glow-two" aria-hidden="true" />

      <div className="solid-hero-copy">
        <span className="solid-kicker">
          <FiActivity aria-hidden="true" />
          Simulação clínica para estudantes de medicina
        </span>
        <h1>
          Raciocínio clínico
          <span className="fluid-words"> que vira </span>
          conduta.
        </h1>
        <p>
          Saia do estudo passivo. Analise casos, solicite exames, defina hipóteses
          e tome decisões em uma experiência construída para a prática médica.
        </p>
        <div className="solid-hero-actions">
          <Link to="/cadastro" className="solid-primary-button">
            Começar gratuitamente
            <FiArrowRight aria-hidden="true" />
          </Link>
          <Link to="/casos" className="solid-ghost-button">
            Explorar casos
          </Link>
        </div>
        <div className="solid-hero-proof" aria-label="Benefícios da plataforma">
          <span><FiCheckCircle /> Acesso gratuito para começar</span>
          <span><FiCheckCircle /> Progresso individual</span>
        </div>
      </div>

      <div className="solid-hero-stage" aria-label="Demonstração de uma simulação clínica">
        <span className="stage-chip stage-chip-top"><FiZap /> Decisão em tempo real</span>
        <span className="stage-chip stage-chip-bottom"><FiTrendingUp /> Evolução registrada</span>

        <div className="solid-clinical-window">
          <div className="solid-window-bar">
            <span /><span /><span />
            <small>SIMULAÇÃO EM ANDAMENTO</small>
          </div>
          <div className="solid-patient-heading">
            <span className="solid-patient-icon"><FiActivity /></span>
            <div>
              <small>CASO 01 · CARDIOLOGIA</small>
              <h2>Dor torácica em adulto jovem</h2>
            </div>
            <span className="solid-case-level">INTERMEDIÁRIO</span>
          </div>
          <div className="solid-patient-data">
            <span><small>IDADE</small><strong>32 anos</strong></span>
            <span><small>QUEIXA</small><strong>Dor torácica</strong></span>
            <span><small>ETAPA</small><strong>Exames</strong></span>
          </div>
          <div className="solid-clinical-track">
            <div className="is-complete">
              <span><FiCheck /></span>
              <p><strong>História clínica</strong><small>Dados analisados</small></p>
            </div>
            <div className="is-active">
              <span><FiFileText /></span>
              <p><strong>Solicitar exames</strong><small>Decisão atual</small></p>
            </div>
            <div>
              <span>03</span>
              <p><strong>Definir hipótese</strong><small>Próxima etapa</small></p>
            </div>
          </div>
          <div className="solid-decision-row">
            <div><small>PRÓXIMA DECISÃO</small><strong>Quais exames são realmente necessários?</strong></div>
            <button type="button" aria-label="Avançar na demonstração"><FiArrowRight /></button>
          </div>
        </div>
      </div>
    </section>

    <section className="solid-proof-strip" aria-label="Números do MedSync">
      <div><strong>40</strong><span>casos clínicos</span></div>
      <div><strong>10</strong><span>desafios visuais</span></div>
      <div><strong aria-live="polite">{formattedStudentCount}</strong><span>estudantes MedSync</span></div>
      <div><strong>19</strong><span>áreas médicas contempladas</span></div>
    </section>

    <section className="solid-manifesto">
      <span>APRENDIZADO ATIVO, DO INÍCIO AO FIM</span>
      <h2>
        DECIDA. <em>JUSTIFIQUE.</em> EVOLUA.
      </h2>
      <p>
        O MedSync transforma conteúdo médico em decisões que você consegue
        analisar, comparar e aprimorar.
      </p>
    </section>

    <section className="solid-features">
      <header className="solid-section-heading">
        <div>
          <span className="solid-section-index">01 — EXPERIÊNCIA</span>
          <h2>Uma plataforma que acompanha o seu raciocínio.</h2>
        </div>
        <p>Recursos conectados para você estudar com intenção, prática e continuidade.</p>
      </header>

      <div className="solid-feature-grid">
        <article className="solid-feature-card is-wide is-blue">
          <span className="solid-feature-icon"><FiActivity /></span>
          <small>SIMULAÇÃO CLÍNICA</small>
          <h3>Casos que exigem decisão, não apenas memória.</h3>
          <p>Analise o cenário, selecione exames e construa hipótese e conduta por etapas.</p>
          <Link to="/casos">Conhecer os casos <FiArrowRight /></Link>
          <span className="solid-card-number">01</span>
        </article>

        <article className="solid-feature-card is-light">
          <span className="solid-feature-icon"><FiTarget /></span>
          <small>DESAFIOS RÁPIDOS</small>
          <h3>Interprete imagens e responda com agilidade.</h3>
          <p>Questões visuais com quatro alternativas e explicação após a resposta.</p>
          <span className="solid-card-number">02</span>
        </article>

        <article className="solid-feature-card is-light">
          <span className="solid-feature-icon"><FiBarChart2 /></span>
          <small>EVOLUÇÃO VISÍVEL</small>
          <h3>Seus dados viram direção de estudo.</h3>
          <p>Acompanhe desempenho, sequência, especialidades e conteúdos que merecem revisão.</p>
          <span className="solid-card-number">03</span>
        </article>

        <article className="solid-feature-card is-wide is-navy">
          <span className="solid-feature-icon"><FiLayers /></span>
          <small>JORNADA CONECTADA</small>
          <h3>Trilhas, revisões e caderno de erros no mesmo fluxo.</h3>
          <p>Continue de onde parou e transforme cada dificuldade em uma próxima ação clara.</p>
          <Link to="/trilhas">Explorar trilhas <FiArrowRight /></Link>
          <span className="solid-card-number">04</span>
        </article>
      </div>
    </section>

    <section className="solid-process">
      <div className="solid-process-intro">
        <span className="solid-section-index">02 — COMO FUNCIONA</span>
        <h2>Da queixa principal à melhor conduta.</h2>
        <p>Uma sequência simples para treinar o caminho completo do raciocínio clínico.</p>
        <Link to="/cadastro" className="solid-outline-button">Iniciar primeiro caso <FiArrowRight /></Link>
      </div>

      <ol className="solid-process-list">
        <li>
          <span>01</span><FiCompass />
          <div><h3>Escolha o caso</h3><p>Filtre por especialidade e dificuldade conforme seu objetivo.</p></div>
        </li>
        <li>
          <span>02</span><FiBookOpen />
          <div><h3>Analise o cenário</h3><p>Leia a história e identifique os dados realmente relevantes.</p></div>
        </li>
        <li>
          <span>03</span><FiFileText />
          <div><h3>Decida por etapas</h3><p>Solicite exames e registre sua hipótese e sua conduta.</p></div>
        </li>
        <li>
          <span>04</span><FiTrendingUp />
          <div><h3>Aprenda com o resultado</h3><p>Compare decisões e leve os pontos frágeis para revisão.</p></div>
        </li>
      </ol>
    </section>

    <section className="solid-value-section">
      <header className="solid-section-heading">
        <div>
          <span className="solid-section-index">03 — PLANOS</span>
          <h2>Comece livre. Avance quando fizer sentido.</h2>
        </div>
        <p>Experimente o método e escolha o acesso que acompanha o seu ritmo.</p>
      </header>

      <div className="solid-plan-grid">
        <article className="solid-plan-card is-free">
          <span>PARA CONHECER</span>
          <h3>{FREE_PLAN.name}</h3>
          <div className="solid-price">{FREE_PLAN.price}</div>
          <p>Uma porta de entrada para experimentar a prática clínica interativa.</p>
          <ul>
            <li><FiCheck /> 5 casos clínicos por mês</li>
            <li><FiCheck /> Painel pessoal</li>
            <li><FiCheck /> Histórico de desempenho</li>
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
            </ul>
            <Link to="/assinatura">Ver esta opção <FiArrowRight /></Link>
          </article>
        ))}
      </div>
    </section>

    <section className="solid-trust">
      <div>
        <FiShield aria-hidden="true" />
        <span>CONSTRUÍDO PARA A FORMAÇÃO MÉDICA</span>
      </div>
      <h2>Estude com método.<br /><span className="fluid-words">Decida com confiança.</span></h2>
      <p>Treine hoje o raciocínio que você vai precisar levar para a prática.</p>
      <Link to="/cadastro" className="solid-primary-button">
        Começar agora <FiArrowRight />
      </Link>
      <small><FiUsers /> Para estudantes que querem ir além do estudo passivo.</small>
    </section>
    </div>
  );
};

export default HomePage;
