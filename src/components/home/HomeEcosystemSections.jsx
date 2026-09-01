import { Link } from 'react-router-dom';
import {
  FiActivity,
  FiArrowRight,
  FiBookOpen,
  FiCheck,
  FiCheckCircle,
  FiEye,
  FiFileText,
  FiLayers,
  FiRefreshCw,
  FiShield,
  FiTrendingUp,
} from 'react-icons/fi';

const HomeEcosystemSections = ({ TRUST_PILLARS }) => (
  <>
      {/* BLOCO 8: O ECOSSISTEMA COMPLETO (DESAFIOS VISUAIS & QUESTÕES) */}
      <section className="solid-features home-reveal" data-home-reveal aria-labelledby="ecosystem-title">
        <header className="solid-section-heading">
          <span className="section-eyebrow-tag">
            <FiEye aria-hidden="true" />
            ALÉM DAS SIMULAÇÕES · ECOSSISTEMA COMPLETO
          </span>
          <h2 id="ecosystem-title">Ferramentas construídas para a prática médica contínua.</h2>
          <p>Pratique casos, treine diagnósticos por imagem e consolide o aprendizado em um só lugar.</p>
        </header>

        <div className="solid-feature-grid">
          <article className="solid-feature-card is-wide is-blue">
            <span className="solid-feature-icon"><FiActivity /></span>
            <small>SIMULAÇÃO CLÍNICA VIVA</small>
            <h3>Casos reais que exigem decisão, não apenas memória.</h3>
            <p>Analise a queixa, solicite exames, elabore hipóteses e prescreva condutas sem receber spoilers diagnósticos.</p>
            <Link to="/casos">Conhecer os 80 casos <FiArrowRight /></Link>
            <span className="solid-card-number">01</span>
          </article>

          <article className="solid-feature-card is-light">
            <span className="solid-feature-icon"><FiEye /></span>
            <small>150 DESAFIOS VISUAIS</small>
            <h3>Interprete imagens em menos de 1 minuto.</h3>
            <p>Treine o olho clínico em ECGs, radiografias, tomografias e lesões dermatológicas com explicação imediata.</p>
            <Link to="/desafios">Abrir desafios visuais <FiArrowRight /></Link>
            <span className="solid-card-number">02</span>
          </article>

          <article className="solid-feature-card is-light">
            <span className="solid-feature-icon"><FiFileText /></span>
            <small>QUESTÕES COMENTADAS</small>
            <h3>Pratique provas com ritmo e método.</h3>
            <p>Resolva questões de provas médicas com explicações cirúrgicas e acompanhamento por especialidade.</p>
            <Link to="/questoes">Resolver questões <FiArrowRight /></Link>
            <span className="solid-card-number">03</span>
          </article>

          <article className="solid-feature-card is-light">
            <span className="solid-feature-icon"><FiRefreshCw /></span>
            <small>REVISÕES ESPAÇADAS</small>
            <h3>Reencontre o conteúdo antes de esquecer.</h3>
            <p>Algoritmo de repetição inteligente que agenda a retomada de cada caso no intervalo ideal de fixação.</p>
            <Link to="/revisoes">Abrir revisões <FiArrowRight /></Link>
            <span className="solid-card-number">04</span>
          </article>

          <article className="solid-feature-card is-light">
            <span className="solid-feature-icon"><FiBookOpen /></span>
            <small>CADERNO DE ERROS</small>
            <h3>Transforme lacunas em domínio clínico.</h3>
            <p>Cada omissão ou conduta incorreta identificada na simulação vira material de estudo focado.</p>
            <Link to="/caderno-erros">Ver meu caderno <FiArrowRight /></Link>
            <span className="solid-card-number">05</span>
          </article>

          <article className="solid-feature-card is-wide is-navy">
            <span className="solid-feature-icon"><FiLayers /></span>
            <small>JORNADA MÉDICA CONECTADA</small>
            <h3>Trilhas de formação clínica do básico ao avançado.</h3>
            <p>Continue de onde parou, acompanhe sua evolução em radar e transforme cada dificuldade em ação clara de melhoria.</p>
            <Link to="/trilhas">Explorar trilhas <FiArrowRight /></Link>
            <span className="solid-card-number">06</span>
          </article>
        </div>

        <div className="home-manifesto-box">
          <div className="manifesto-badge">
            <FiShield aria-hidden="true" />
            POSICIONAMENTO AUTORAL
          </div>
          <h3>O MedSync não é mais um gerador de resumos genéricos de IA.</h3>
          <p>
            Medicina não se aprende com prompts genéricos ou respostas prontas de chatbot. Aprende-se
            investigando cenários reais, sustentando hipóteses diagnósticas e assumindo a responsabilidade
            de cada conduta sob rigor clínico.
          </p>
        </div>
      </section>

      {/* BLOCO 9: CONTROLE DE ERROS & RETENÇÃO */}
      <section className="home-retention-section home-reveal" data-home-reveal aria-labelledby="retention-title">
        <header className="solid-section-heading">
          <span className="section-eyebrow-tag">
            <FiTrendingUp aria-hidden="true" />
            CONTROLE DE ERROS & RETENÇÃO
          </span>
          <h2 id="retention-title">O raciocínio construído que não se perde no tempo.</h2>
          <p>De nada adianta resolver casos se o aprendizado se dissipar semanas depois. O MedSync fecha o ciclo.</p>
        </header>

        <div className="retention-flow-grid">
          <article className="retention-card">
            <div className="retention-card-header">
              <span className="retention-icon"><FiBookOpen /></span>
              <div>
                <small>ETAPA 01 · IDENTIFICAÇÃO</small>
                <h3>Caderno de Erros Automático</h3>
              </div>
            </div>
            <p>
              Toda vez que a Synapse identifica uma omissão de exame crítico ou uma falha de conduta, o caso
              é catalogado automaticamente com a explicação do motivo e a recomendação de estudo.
            </p>
            <div className="retention-pill">
              <FiCheckCircle />
              <span>Sem retrabalho: o caderno se constrói sozinho</span>
            </div>
          </article>

          <article className="retention-card">
            <div className="retention-card-header">
              <span className="retention-icon"><FiRefreshCw /></span>
              <div>
                <small>ETAPA 02 · CONSOLIDAÇÃO</small>
                <h3>Algoritmo de Revisões Espaçadas</h3>
              </div>
            </div>
            <p>
              O sistema calcula a curva de retenção de cada conceito clínico e insere na sua agenda o momento
              exato de retestar aquele raciocínio antes do esquecimento agir.
            </p>
            <div className="retention-pill">
              <FiCheckCircle />
              <span>Intervalos inteligentes de 1, 7, 30 e 60 dias</span>
            </div>
          </article>
        </div>
      </section>

      {/* BLOCO 10: CREDIBILIDADE & RIGOR CLÍNICO */}
      <section className="home-credibility home-reveal" data-home-reveal aria-labelledby="credibility-title">
        <header className="solid-section-heading">
          <span className="section-eyebrow-tag">
            <FiShield aria-hidden="true" />
            RIGOR CLÍNICO & ÉTICA
          </span>
          <h2 id="credibility-title">Robustez que o estudante consegue enxergar.</h2>
          <p>Sem promessas vagas: a confiança vem de critérios, referências e explicações presentes em cada resultado.</p>
        </header>

        <div className="credibility-layout">
          <article className="credibility-ledger">
            <header>
              <div>
                <span><FiShield /></span>
                <div>
                  <small>ESTRUTURA DE AVALIAÇÃO</small>
                  <h3>O que sustenta o feedback da Synapse</h3>
                </div>
              </div>
              <span className="credibility-status"><i /> ATIVO</span>
            </header>
            <ol>
              <li>
                <span>01</span>
                <div>
                  <strong>O diagnóstico fica protegido</strong>
                  <p>A resposta de referência aparece somente depois que o estudante conclui sua resolução.</p>
                </div>
                <FiCheck />
              </li>
              <li>
                <span>02</span>
                <div>
                  <strong>As decisões são avaliadas em conjunto</strong>
                  <p>Avaliações, exames, hipótese, conduta e segurança fazem parte da mesma análise.</p>
                </div>
                <FiCheck />
              </li>
              <li>
                <span>03</span>
                <div>
                  <strong>A nota pode ser compreendida</strong>
                  <p>O resultado explica a composição do desempenho em uma escala simples de 0 a 10.</p>
                </div>
                <FiCheck />
              </li>
              <li>
                <span>04</span>
                <div>
                  <strong>O aprendizado continua</strong>
                  <p>O feedback termina com referências e um plano rápido de melhoria para o próximo caso.</p>
                </div>
                <FiCheck />
              </li>
            </ol>
          </article>

          <div className="credibility-pillar-grid">
            {TRUST_PILLARS.map((pillar) => {
              const PillarIcon = pillar.icon;
              return (
                <article key={pillar.title}>
                  <span><PillarIcon aria-hidden="true" /></span>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
  </>
);

export default HomeEcosystemSections;
