import { Link } from 'react-router-dom';
import {
  FiActivity,
  FiArrowRight,
  FiBookOpen,
  FiEye,
  FiFileText,
  FiLayers,
  FiRefreshCw,
  FiShield,
} from 'react-icons/fi';

const HomeEcosystemSections = ({ TRUST_PILLARS }) => (
  <section className="solid-features home-reveal" data-home-reveal aria-labelledby="ecosystem-title">
    <header className="solid-section-heading">
      <h2 id="ecosystem-title">Tudo o que você precisa para praticar, revisar e evoluir.</h2>
      <p>Casos, imagens, questões e revisões conectados em uma rotina contínua de aprendizagem clínica.</p>
    </header>

    <div className="solid-feature-grid">
      <article className="solid-feature-card is-wide is-blue">
        <span className="solid-feature-icon"><FiActivity /></span>
        <small>80 CASOS CLÍNICOS</small>
        <h3>Decida diante de casos clínicos completos.</h3>
        <p>Investigue o quadro, solicite exames, formule hipóteses e defina a conduta antes de receber o feedback.</p>
        <Link to="/casos">Conhecer os casos <FiArrowRight /></Link>
      </article>

      <article className="solid-feature-card is-light">
        <span className="solid-feature-icon"><FiEye /></span>
        <small>150 DESAFIOS VISUAIS</small>
        <h3>Reconheça padrões com mais segurança.</h3>
        <p>Treine imagens clínicas de diferentes especialidades com resposta e explicação objetiva.</p>
        <Link to="/desafios">Abrir desafios <FiArrowRight /></Link>
      </article>

      <article className="solid-feature-card is-light">
        <span className="solid-feature-icon"><FiFileText /></span>
        <small>QUESTÕES COMENTADAS</small>
        <h3>Pratique provas com ritmo e método.</h3>
        <p>Resolva questões médicas e compreenda o raciocínio por trás de cada alternativa.</p>
        <Link to="/questoes">Resolver questões <FiArrowRight /></Link>
      </article>

      <article className="solid-feature-card is-light">
        <span className="solid-feature-icon"><FiRefreshCw /></span>
        <small>REVISÕES ESPAÇADAS</small>
        <h3>Retome o conteúdo no momento certo.</h3>
        <p>Organize revisões para consolidar o que foi estudado e acompanhar o que ainda precisa de atenção.</p>
        <Link to="/revisoes">Abrir revisões <FiArrowRight /></Link>
      </article>

      <article className="solid-feature-card is-light">
        <span className="solid-feature-icon"><FiBookOpen /></span>
        <small>CADERNO DE ERROS</small>
        <h3>Transforme dificuldades em próximos passos.</h3>
        <p>Reúna pontos de atenção e volte a eles com uma direção clara de estudo.</p>
        <Link to="/caderno-erros">Ver meu caderno <FiArrowRight /></Link>
      </article>

      <article className="solid-feature-card is-wide is-navy">
        <span className="solid-feature-icon"><FiLayers /></span>
        <small>TRILHAS DE APRENDIZAGEM</small>
        <h3>Conecte prática, revisão e evolução clínica.</h3>
        <p>Continue de onde parou e organize sua jornada do conteúdo essencial aos desafios mais avançados.</p>
        <Link to="/trilhas">Explorar trilhas <FiArrowRight /></Link>
      </article>
    </div>

    <aside className="ecosystem-trust-strip" aria-labelledby="ecosystem-trust-title">
      <header>
        <span><FiShield aria-hidden="true" /></span>
        <div>
          <h3 id="ecosystem-trust-title">Critérios visíveis em cada resultado.</h3>
          <p>O método permanece claro do primeiro exercício ao plano de melhoria.</p>
        </div>
      </header>
      <div>
        {TRUST_PILLARS.map((pillar) => {
          const PillarIcon = pillar.icon;
          return (
            <article key={pillar.title}>
              <PillarIcon aria-hidden="true" />
              <div>
                <strong>{pillar.title}</strong>
                <p>{pillar.text}</p>
              </div>
            </article>
          );
        })}
      </div>
    </aside>
  </section>
);

export default HomeEcosystemSections;
