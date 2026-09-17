import { createElement, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiActivity,
  FiArrowLeft,
  FiArrowRight,
  FiBarChart2,
  FiCalendar,
  FiCheck,
  FiClipboard,
  FiCreditCard,
  FiFileText,
  FiImage,
  FiLayers,
  FiLock,
  FiMessageCircle,
  FiMonitor,
  FiRefreshCw,
  FiShield,
  FiTarget,
} from 'react-icons/fi';
import { FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';
import { FREE_PLAN, PREMIUM_BILLING_OPTIONS } from '../../config/pricing';
import { ACADEMIC_INSTITUTIONS } from './homeContent';

const AI_NETWORKS = [
  {
    id: 'chatgpt', name: 'ChatGPT', provider: 'OPENAI', icon: '/images/ai-icons/chatgpt.png',
    text: 'Estruturação do raciocínio e explicações claras.',
  },
  {
    id: 'grok', name: 'Grok', provider: 'xAI', icon: '/images/ai-icons/grok.png',
    text: 'Auditoria crítica e hipóteses alternativas.',
  },
  {
    id: 'gemini', name: 'Gemini', provider: 'GOOGLE', icon: '/images/ai-icons/gemini.png',
    text: 'Integração de dados e contexto multimodal.',
  },
  {
    id: 'claude', name: 'Claude', provider: 'ANTHROPIC', icon: '/images/ai-icons/claude.png',
    text: 'Análise cuidadosa e síntese pedagógica.',
  },
  {
    id: 'deepseek', name: 'DeepSeek', provider: 'DEEPSEEK', icon: '/images/ai-icons/deepseek.png',
    text: 'Comparação lógica de hipóteses e condutas.',
  },
];

const FEATURES = [
  {
    id: 'casos', title: 'Casos clínicos', icon: FiClipboard, tone: 'blue', to: '/casos', action: 'Explorar casos',
    text: 'Solicite exames, construa uma hipótese e defina a conduta. A Synapse devolve uma análise completa das suas decisões.',
    tags: ['Raciocínio clínico', 'Feedback da Synapse', '80 casos'],
  },
  {
    id: 'desafios', title: 'Desafios visuais', icon: FiImage, tone: 'cyan', to: '/desafios', action: 'Explorar desafios',
    text: 'Treine o olhar clínico com imagens, alternativas e explicações organizadas para uma revisão rápida.',
    tags: ['150 desafios', 'Diversas áreas', 'Explicação após resposta'],
  },
  {
    id: 'questoes', title: 'Mais de 200 mil questões', icon: FiFileText, tone: 'coral', to: '/questoes', action: 'Resolver questões',
    text: 'Pratique com filtros por especialidade, tema, assunto e ano, em um banco preparado para estudo direcionado.',
    tags: ['Filtros clínicos', 'Análise por alternativa', 'Treino direcionado'],
  },
  {
    id: 'revisoes', title: 'Caderno de revisão', icon: FiCalendar, tone: 'violet', to: '/revisoes', action: 'Acessar revisões',
    text: 'Revisões espaçadas reúnem o que precisa voltar no momento certo, com foco nos seus pontos mais frágeis.',
    tags: ['Revisão espaçada', 'Controle dos erros', 'Próximos estudos'],
  },
  {
    id: 'trilhas', title: 'Trilhas de estudo', icon: FiTarget, tone: 'sky', to: '/trilhas', action: 'Explorar trilhas',
    text: 'Conecte prática, revisão e evolução clínica em percursos organizados por especialidade.',
    tags: ['Por especialidade', 'Conteúdo estruturado', 'Acompanhamento'],
  },
];

const SectionHeading = ({ headingId, eyebrow, title, accent, description }) => (
  <header className="preview-section-heading">
    <span className="preview-eyebrow">{eyebrow}</span>
    <h2 id={headingId}>{title} <em>{accent}</em></h2>
    {description && <p>{description}</p>}
  </header>
);

const SynapseSection = () => {
  const [activeNetwork, setActiveNetwork] = useState(null);
  return (
  <section id="synapse" className="preview-light-section preview-synapse-section" data-home-reveal aria-labelledby="synapse-title">
    <div className="preview-section-orbit preview-section-orbit-left" aria-hidden="true" />
    <SectionHeading
      headingId="synapse-title"
      eyebrow="Cinco IAs ativas · Uma única Synapse"
      title="Cinco perspectivas clínicas,"
      accent="organizadas em uma única experiência."
      description="ChatGPT, Grok, Gemini, Claude e DeepSeek atuam em papéis complementares. A Synapse reúne essas perspectivas em um feedback clínico claro e voltado para o seu aprendizado."
    />
    <div className="preview-synapse-hub" aria-hidden="true"><FiActivity /> Synapse<span /><span /><span /><span /><span /></div>
    <div className="preview-ai-grid" role="list" aria-label="Perspectivas da Synapse">
      {AI_NETWORKS.map((network) => (
        <article className={`preview-ai-card is-${network.id}`} role="listitem" key={network.id}>
          <div className="preview-ai-icon"><img src={network.icon} alt="" width="58" height="58" loading="lazy" /></div>
          <h3>{network.name}</h3>
          <button className="preview-disclosure" type="button" aria-expanded={activeNetwork === network.id} aria-controls={`ai-detail-${network.id}`} onClick={() => setActiveNetwork(activeNetwork === network.id ? null : network.id)}>Entender seu papel <FiArrowRight aria-hidden="true" /></button>
          <div id={`ai-detail-${network.id}`} className={`preview-expand${activeNetwork === network.id ? ' is-open' : ''}`} inert={activeNetwork === network.id ? undefined : ''}><div><p>{network.text}</p></div></div>
          <span>{network.provider}</span>

        </article>
      ))}
    </div>
    <div className="preview-benefit-strip" aria-label="Benefícios da Synapse">
      <div><FiLayers /><strong>Perspectivas complementares</strong><span>Mais profundidade na análise</span></div>
      <div><FiTarget /><strong>Feedback clínico integrado</strong><span>Uma leitura organizada do caso</span></div>
      <div><FiShield /><strong>Segurança em destaque</strong><span>Riscos e prioridades visíveis</span></div>
      <div><FiBarChart2 /><strong>Evolução contínua</strong><span>Próximos passos mais claros</span></div>
    </div>
    <blockquote className="preview-section-quote">
      Diferentes inteligências. Um único propósito: ajudar você a compreender melhor cada decisão.
      <cite>MedSync</cite>
    </blockquote>
  </section>
  );
};

const CommunitySection = ({ formattedStudentCount }) => {
  const trackRef = useRef(null);
  const moveTrack = (direction) => trackRef.current?.scrollBy({ left: direction * 360, behavior: 'smooth' });

  return (
    <section id="comunidade" className="preview-light-section preview-community-section" data-home-reveal aria-labelledby="community-title">
      <SectionHeading
        headingId="community-title"
        eyebrow="Comunidade acadêmica"
        title="Estudantes de diferentes instituições"
        accent="já estudam com o MedSync."
        description="Uma comunidade em formação, reunida pelo mesmo objetivo: transformar estudo em decisões mais seguras."
      />
      <div className="preview-carousel-shell">
        <button type="button" onClick={() => moveTrack(-1)} aria-label="Ver instituições anteriores"><FiArrowLeft /></button>
        <div className="preview-institution-track" ref={trackRef} tabIndex={0} aria-label="Instituições presentes na comunidade MedSync">
          {ACADEMIC_INSTITUTIONS.map((institution) => (
            <article className="preview-institution-card" key={institution.acronym}>
              <span>
                {institution.logo
                  ? <img src={institution.logo} alt="" width="58" height="58" loading="lazy" />
                  : institution.acronym}
              </span>
              <strong>{institution.acronym}</strong>
              <small>{institution.name}</small>
              <b>{institution.state}</b>
            </article>
          ))}
        </div>
        <button type="button" onClick={() => moveTrack(1)} aria-label="Ver próximas instituições"><FiArrowRight /></button>
      </div>
      <p className="preview-institution-note">A presença de estudantes não representa vínculo ou parceria institucional.</p>

      <div className="preview-testimonial-heading">
        <span className="preview-eyebrow">Histórias da comunidade</span>
        <h2>Este espaço começa <em>com a sua experiência.</em></h2>
        <p>Os depoimentos serão publicados apenas com autorização de estudantes reais.</p>
      </div>
      <div className="preview-testimonial-track" aria-label="Espaço para futuros depoimentos">
        <article className="preview-testimonial-card is-side" aria-hidden="true"><FiMessageCircle /></article>
        <article className="preview-testimonial-card is-main">
          <FiMessageCircle aria-hidden="true" />
          <h3>Experimente o MedSync e conte como foi.</h3>
          <p>Seu relato pode ajudar outros estudantes e fazer parte da construção da plataforma.</p>
          <Link to="/cadastro">Começar gratuitamente <FiArrowRight aria-hidden="true" /></Link>
        </article>
        <article className="preview-testimonial-card is-side" aria-hidden="true"><FiMessageCircle /></article>
      </div>
      <div className="preview-proof-strip" aria-label="Números atuais do MedSync">
        <div><strong>80</strong><span>casos clínicos</span></div>
        <div><strong>150</strong><span>desafios visuais</span></div>
        <div><strong>226 mil+</strong><span>questões no catálogo</span></div>
        <div><strong>{formattedStudentCount}</strong><span>estudantes cadastrados</span></div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  const [expanded, setExpanded] = useState(null);
  return (
  <section id="funcionalidades" className="preview-light-section preview-features-section" data-home-reveal aria-labelledby="features-title">
    <SectionHeading
      headingId="features-title"
      eyebrow="Funcionalidades"
      title="Tudo o que você precisa para"
      accent="evoluir em um só lugar."
      description="Prática clínica, questões, revisão e trilhas reunidas em uma experiência contínua."
    />
    <div className="preview-feature-grid">
      {FEATURES.map(({ id, title, icon: Icon, tone, to, action, text, tags }) => (
        <article className={`preview-feature-card is-${tone}`} key={id}>
          <div className="preview-feature-topline">
            <span className="preview-feature-icon">{createElement(Icon, { 'aria-hidden': true })}</span>
            <div><small>MedSync</small><h3>{title}</h3></div>
          </div>
          <button className="preview-disclosure" type="button" aria-expanded={expanded === id} aria-controls={`feature-detail-${id}`} onClick={() => setExpanded(expanded === id ? null : id)}>{title} <FiArrowRight aria-hidden="true" /></button>
          <div id={`feature-detail-${id}`} className={`preview-expand${expanded === id ? ' is-open' : ''}`} inert={expanded === id ? undefined : ''}><div><p>{text}</p></div></div>
          <div className="preview-feature-tags">{tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          <Link to={to}>{action} <FiArrowRight aria-hidden="true" /></Link>
        </article>
      ))}
    </div>
  </section>
  );
};

const PLAN_ICON = {
  gratuito: FiLayers,
  avulso: FiCreditCard,
  recorrente: FiRefreshCw,
  trimestral: FiBarChart2,
};

const PricingSection = () => {
  const plans = [
    {
      ...FREE_PLAN,
      label: 'Para conhecer',
      description: 'Explore a plataforma e experimente a prática clínica interativa.',
      features: ['5 casos clínicos por mês', '10 questões por dia', 'Desafios introdutórios', 'Trilhas de demonstração'],
      action: 'Criar conta gratuita',
      to: '/cadastro',
    },
    ...PREMIUM_BILLING_OPTIONS.map((plan) => ({
      ...plan,
      label: plan.id === 'avulso' ? 'Acesso por 30 dias' : plan.id === 'recorrente' ? 'Praticidade e economia' : 'Mais continuidade',
      features: [...plan.highlights, '80 casos e 150 desafios', 'Mais de 200 mil questões', 'Revisões e trilhas completas'],
      action: plan.id === 'avulso' ? 'Assinar via Pix' : plan.id === 'trimestral' ? 'Assinar no cartão (até 3x)' : 'Assinar no cartão',
      to: '/assinatura',
    })),
  ];

  return (
    <section id="planos" className="preview-light-section preview-pricing-section" data-home-reveal aria-labelledby="pricing-title">
      <SectionHeading
        headingId="pricing-title"
        eyebrow="Planos"
        title="Escolha o acesso que acompanha"
        accent="o seu ritmo de estudo."
        description="Comece gratuitamente. Quando quiser avançar, escolha entre pagamento avulso, mensal ou trimestral."
      />
      <div className="preview-pricing-grid">
        {plans.map((plan) => {
          const Icon = PLAN_ICON[plan.id] || FiCreditCard;
          return (
            <article className={`preview-plan-card${plan.featured ? ' is-featured' : ''}`} key={plan.id}>
              {plan.featured && <span className="preview-plan-badge">Mais escolhido</span>}
              <header><div><small>{plan.label}</small><h3>{plan.name}</h3></div><Icon aria-hidden="true" /></header>
              <div className="preview-plan-price">{plan.price}<small>{plan.billingLabel}</small></div>
              <p>{plan.description}</p>
              <ul>{plan.features.map((feature) => <li key={feature}><FiCheck aria-hidden="true" /> {feature}</li>)}</ul>
              <Link to={plan.to}>{plan.action} <FiArrowRight aria-hidden="true" /></Link>
            </article>
          );
        })}
      </div>
      <div className="preview-trust-strip">
        <div><FiLock /><strong>Ambiente seguro</strong><span>Seus dados protegidos</span></div>
        <div><FiMonitor /><strong>Acesse de qualquer lugar</strong><span>Web, tablet e celular</span></div>
        <div><FiMessageCircle /><strong>Suporte humanizado</strong><span>Via WhatsApp</span></div>
        <div><FiShield /><strong>Cancelamento simples</strong><span>Sem burocracia</span></div>
      </div>
    </section>
  );
};

const HomePreviewFooter = () => (
  <footer className="preview-footer">
    <div className="preview-footer-wave" aria-hidden="true" />
    <div className="preview-footer-grid">
      <section>
        <img src="/logo-medsync.png" alt="MedSync" />
        <p>Prática clínica guiada para estudantes de medicina que querem transformar conhecimento em decisões mais seguras.</p>
        <small>Plataforma educacional. Não substitui avaliação, diagnóstico ou conduta médica.</small>
        <div className="preview-footer-socials">
          <a href="https://www.instagram.com/medsync.educacional/" target="_blank" rel="noreferrer"><FaInstagram /> Instagram</a>
          <a href="https://www.tiktok.com/@medsync.edu?is_from_webapp=1&sender_device=pc" target="_blank" rel="noreferrer"><FaTiktok /> TikTok</a>
          <a href="https://contate.me/5586988063766" target="_blank" rel="noreferrer"><FaWhatsapp /> WhatsApp</a>
        </div>
      </section>
      <nav aria-label="Links do rodapé">
        <div><h2>Explore</h2><Link to="/casos">Casos clínicos</Link><Link to="/desafios">Desafios visuais</Link><Link to="/questoes">Questões</Link><Link to="/revisoes">Revisões</Link><Link to="/trilhas">Trilhas</Link><Link to="/assinatura">Planos</Link></div>
        <div><h2>MedSync</h2><Link to="/sobre">Sobre o MedSync</Link><Link to="/diferenciais">Nossos diferenciais</Link><Link to="/embaixadores">Seja nosso embaixador</Link></div>
        <div><h2>Transparência</h2><Link to="/termos">Termos de Uso</Link><Link to="/privacidade">Política de Privacidade</Link></div>
      </nav>
    </div>
    <div className="preview-footer-bottom">
      <div>Copyright © {new Date().getFullYear()} MedSync. Todos os direitos reservados.<br />MEDSYNC TECNOLOGIA EM SAUDE INOVA SIMPLES I.S. - ME · CNPJ 63.108.735/0001-53</div>
      <p>Mais preparo. Mais clareza. Melhores decisões.</p>
    </div>
  </footer>
);

const HomePreviewSections = ({ formattedStudentCount }) => (
  <>
    <section className="preview-purpose-section" aria-labelledby="purpose-title" data-home-reveal>
      <span className="preview-eyebrow">Por trás de cada caso, um propósito</span>
      <h2 id="purpose-title">Muito mais que uma plataforma.<br /><em>Um novo jeito de estudar Medicina.</em></h2>
      <p>Casos clínicos, questões, desafios visuais e inteligência educacional no mesmo lugar, com método e propósito.</p>
    </section>
    <SynapseSection />
    <CommunitySection formattedStudentCount={formattedStudentCount} />
    <FeaturesSection />
    <PricingSection />
    <HomePreviewFooter />
  </>
);

export default HomePreviewSections;
