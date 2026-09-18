import { createElement } from 'react';
import { Link } from 'react-router-dom';
import {
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

const PenNote = ({ children, side }) => (
  <aside className={`preview-pen-note is-${side}`}>
    <span>{children}</span>
    <svg viewBox="0 0 100 65" fill="none" aria-hidden="true" focusable="false">
      <path d="M86 8C83 37 61 52 18 46M31 34 16 46l18 8" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </aside>
);

const SectionHeading = ({ headingId, eyebrow, title, accent, description, note, noteSide = 'right' }) => (
  <div className={`preview-heading-composition${note ? ' has-note' : ''}`}>
  <header className="preview-section-heading">
    <span className="preview-eyebrow">{eyebrow}</span>
    <h2 id={headingId}>{title} <em>{accent}</em></h2>
    {description && <p>{description}</p>}
  </header>
  {note && <PenNote side={noteSide}>{note}</PenNote>}
  </div>
);

const SynapseSection = () => {
  return (
  <section id="synapse" className="preview-light-section preview-synapse-section" data-home-reveal aria-labelledby="synapse-title">
    <div className="preview-section-orbit preview-section-orbit-left" aria-hidden="true" />
    <SectionHeading
      headingId="synapse-title"
      eyebrow="Cinco IAs ativas · Uma única Synapse"
      note="Cada decisão merece um novo olhar."
      noteSide="left"
      title="Cinco perspectivas clínicas,"
      accent="organizadas em uma única experiência."
      description="ChatGPT, Grok, Gemini, Claude e DeepSeek atuam em papéis complementares. A Synapse reúne essas perspectivas em um feedback clínico claro e voltado para o seu aprendizado."
    />
    <div className="preview-ai-grid" role="list" aria-label="Perspectivas da Synapse">
      {AI_NETWORKS.map((network, index) => (
        <article
          className={`preview-ai-card is-${network.id}`}
          role="listitem"
          key={network.id}
          data-motion-card
          data-motion-reveal
          style={{ '--motion-delay': `${index * 70}ms` }}
        >
          <div className="preview-ai-icon"><img src={network.icon} alt="" width="58" height="58" loading="lazy" /></div>
          <h3>{network.name}</h3>
          <p>{network.text}</p>
          <span>{network.provider}</span>
          <Link to="/diferenciais" className="preview-ai-action">Ver como atua <FiArrowRight aria-hidden="true" /></Link>
        </article>
      ))}
    </div>
      <div className="preview-benefit-strip" data-motion-reveal aria-label="Benefícios da Synapse">
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
  const institutionLoop = [...ACADEMIC_INSTITUTIONS, ...ACADEMIC_INSTITUTIONS];

  return (
    <section id="comunidade" className="preview-light-section preview-community-section" data-home-reveal aria-labelledby="community-title">
      <SectionHeading
        headingId="community-title"
        eyebrow="Comunidade acadêmica"
        note="Essa história também pode ser sua."
        title="Estudantes de diferentes instituições"
        accent="já estudam com o MedSync."
        description="Uma comunidade em formação, reunida pelo mesmo objetivo: transformar estudo em decisões mais seguras."
      />
      <div
        className="preview-institution-marquee"
        role="region"
        tabIndex={0}
        aria-label="Instituições presentes na comunidade MedSync"
      >
        <div className="preview-institution-track">
          {institutionLoop.map((institution, index) => {
            const isClone = index >= ACADEMIC_INSTITUTIONS.length;
            return (
              <article
                className={`preview-institution-card${isClone ? ' is-clone' : ''}`}
                key={`${institution.acronym}-${index}`}
                aria-hidden={isClone || undefined}
              >
                <span>
                  {institution.logo
                    ? <img src={institution.logo} alt="" width="58" height="58" loading="lazy" />
                    : institution.acronym}
                </span>
                <strong>{institution.acronym}</strong>
                <small>{institution.name}</small>
                <b>{institution.state}</b>
              </article>
            );
          })}
        </div>
      </div>
      <p className="preview-institution-note">A presença de estudantes não representa vínculo ou parceria institucional.</p>

      <div className="preview-testimonial-heading">
        <span className="preview-eyebrow">Histórias da comunidade</span>
        <h2>Este espaço começa <em>com a sua experiência.</em></h2>
        <p>Os depoimentos serão publicados apenas com autorização de estudantes reais.</p>
      </div>
      <div className="preview-testimonial-track" aria-label="Espaço para futuros depoimentos">
        <article className="preview-testimonial-card is-side" data-motion-reveal aria-hidden="true"><FiMessageCircle /></article>
        <article className="preview-testimonial-card is-main" data-motion-card data-motion-reveal>
          <FiMessageCircle aria-hidden="true" />
          <h3>Experimente o MedSync e conte como foi.</h3>
          <p>Seu relato pode ajudar outros estudantes e fazer parte da construção da plataforma.</p>
          <Link to="/cadastro">Começar gratuitamente <FiArrowRight aria-hidden="true" /></Link>
        </article>
        <article className="preview-testimonial-card is-side" data-motion-reveal aria-hidden="true"><FiMessageCircle /></article>
      </div>
      <div className={`preview-proof-strip${formattedStudentCount && formattedStudentCount !== '—' ? '' : ' has-three-items'}`} data-motion-reveal aria-label="Números atuais do MedSync">
        <div><strong>80</strong><span>casos clínicos</span></div>
        <div><strong>150</strong><span>desafios visuais</span></div>
        <div><strong>226 mil+</strong><span>questões no catálogo</span></div>
        {formattedStudentCount && formattedStudentCount !== '—' && <div><strong>{formattedStudentCount}</strong><span>estudantes cadastrados</span></div>}
      </div>
    </section>
  );
};

const FeatureIllustration = ({ kind }) => (
  <svg className={`preview-feature-art is-${kind}`} viewBox="0 0 160 160" fill="none" aria-hidden="true" focusable="false">
    {kind === 'trilhas' ? <>
      <path d="M25 130 113 105 48 76 126 40" stroke="#b2dfff" strokeWidth="16" strokeLinejoin="round" />
      <path d="m25 125 88-25-65-29 78-36" stroke="#fff" strokeWidth="4" strokeLinejoin="round" />
      {[ [25,125], [113,100], [48,71], [126,35] ].map(([x,y]) => <g key={x}><ellipse cx={x} cy={y+7} rx="14" ry="6" fill="#87caff" opacity=".45"/><circle cx={x} cy={y} r="8" fill="#118aff" stroke="#eefaff" strokeWidth="4"/></g>)}
      <path d="M126 29V9l19 5-19 6" stroke="#118aff" strokeWidth="3" fill="#40baff" />
    </> : <>
      <rect x="41" y="20" width="99" height="125" rx="12" fill="currentColor" opacity=".12" transform="rotate(12 90 80)"/>
      <rect x="30" y="17" width="99" height="125" rx="12" fill="#fff" opacity=".65" transform="rotate(5 80 80)"/>
      <rect x="20" y="24" width="101" height="125" rx="11" fill="#fff" stroke="currentColor" strokeOpacity=".17"/>
      {kind === 'revisoes' ? <>
        <rect x="49" y="49" width="40" height="37" rx="6" fill="currentColor" opacity=".12"/>
        <path d="M58 45v10m21-10v10M51 61h36" stroke="currentColor" strokeWidth="3"/>
        <path d="M44 105h53m-42 9h31" stroke="currentColor" strokeOpacity=".45" strokeWidth="4" strokeLinecap="round"/>
        {[52,70,88].map((x,i)=><circle key={x} cx={x} cy="133" r="4" fill={['#a39aff','#7fceff','#ffbd98'][i]}/>)}
      </> : kind === 'desafios' ? <>
        <rect x="29" y="37" width="83" height="97" rx="5" fill="#15354e"/>
        <path d="M70 48v70m-5-65C43 56 35 75 40 107c8 10 22 4 24-8Zm11 0c22 3 30 22 25 54-8 10-22 4-24-8Z" stroke="#cce7f6" strokeWidth="2" opacity=".75"/>
        {[66,76,86,96].map(y=><path key={y} d={`M43 ${y}q10 7 20 2m15-2q10 7 20-2`} stroke="#b7deee" opacity=".6" strokeWidth="2"/>)}
      </> : kind === 'questoes' ? <>
        {[52,76,100,124].map((y,i)=><g key={y}><circle cx="40" cy={y} r="6" fill="currentColor" opacity={i===1 ? '.8':'.18'}/><path d={`M56 ${y}h47`} stroke="currentColor" strokeWidth="7" opacity=".16" strokeLinecap="round"/></g>)}
      </> : <>
        <path d="M36 43h45m-45 12h62m-62 12h35m-35 43h61m-61 12h45" stroke="currentColor" strokeWidth="4" opacity=".24" strokeLinecap="round"/>
        <path d="M34 91h22l6-10 7 24 8-37 7 23h22" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
      </>}
    </>}
  </svg>
);

const FeaturesSection = () => {
  return (
  <section id="funcionalidades" className="preview-light-section preview-features-section" data-home-reveal aria-labelledby="features-title">
    <SectionHeading
      headingId="features-title"
      eyebrow="Funcionalidades"
      note="Mais que estudo. Uma jornada."
      title="Tudo o que você precisa para"
      accent="evoluir em um só lugar."
      description="Prática clínica, questões, revisão e trilhas reunidas em uma experiência contínua."
    />
    <div className="preview-feature-grid">
      {FEATURES.map(({ id, title, icon: Icon, tone, to, action, text, tags }, index) => (
        <article
          className={`preview-feature-card is-${tone}`}
          key={id}
          data-motion-card
          data-motion-reveal
          style={{ '--motion-delay': `${index * 70}ms` }}
        >
          <FeatureIllustration kind={id} />
          <div className="preview-feature-topline">
            <span className="preview-feature-icon">{createElement(Icon, { 'aria-hidden': true })}</span>
            <div><h3>{title}</h3></div>
          </div>
          <p>{text}</p>
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
        note="Um passo de cada vez, no seu ritmo."
        noteSide="left"
        title="Escolha o acesso que acompanha"
        accent="o seu ritmo de estudo."
        description="Comece gratuitamente. Quando quiser avançar, escolha entre pagamento avulso, mensal ou trimestral."
      />
      <div className="preview-pricing-grid">
        {plans.map((plan, index) => {
          const Icon = PLAN_ICON[plan.id] || FiCreditCard;
          return (
            <article
              className={`preview-plan-card${plan.featured ? ' is-featured' : ''}`}
              key={plan.id}
              data-motion-card
              data-motion-reveal
              style={{ '--motion-delay': `${index * 70}ms` }}
            >
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
      <div className="preview-trust-strip" data-motion-reveal>
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
