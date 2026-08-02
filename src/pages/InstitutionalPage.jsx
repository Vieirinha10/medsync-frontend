import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiAward,
  FiBookOpen,
  FiCheckCircle,
  FiCompass,
  FiHeart,
  FiLayers,
  FiShield,
  FiTarget,
  FiTrendingUp,
  FiUsers,
  FiZap,
} from 'react-icons/fi';

const companyName = 'MEDSYNC TECNOLOGIA EM SAUDE INOVA SIMPLES I.S. - ME';
const companyCnpj = '63.108.735/0001-53';

const pages = {
  sobre: {
    kicker: 'SOBRE O MEDSYNC',
    title: 'Treinar decisões clínicas muda a forma de aprender medicina.',
    intro: 'O MedSync nasceu para aproximar o estudo teórico do raciocínio necessário diante de um paciente. Nossa proposta é oferecer prática clínica guiada, feedback estruturado e evolução mensurável em uma experiência simples e envolvente.',
    icon: FiHeart,
    highlights: [
      { icon: FiTarget, title: 'Nossa missão', text: 'Ajudar estudantes de medicina a desenvolver raciocínio clínico com prática deliberada, segurança e clareza.' },
      { icon: FiCompass, title: 'Nossa visão', text: 'Ser uma plataforma brasileira de referência na formação prática e contínua de estudantes e profissionais de saúde.' },
      { icon: FiShield, title: 'Nosso compromisso', text: 'Construir conteúdo educacional responsável, transparente e orientado por critérios clínicos revisados.' },
    ],
    sections: [
      { title: 'Do conhecimento à decisão', paragraphs: ['Ler sobre uma doença é diferente de decidir quais exames solicitar, organizar hipóteses e propor uma conduta. Por isso, o MedSync transforma o conteúdo em experiências interativas que exigem participação ativa.', 'Cada recurso é pensado para ajudar o usuário a identificar acertos, lacunas e próximos passos, respeitando o caráter exclusivamente educacional da plataforma.'] },
      { title: 'Tecnologia com propósito educacional', paragraphs: ['Usamos tecnologia para tornar o estudo mais organizado, visual e personalizado. A plataforma acompanha o progresso e apresenta informações úteis para que o estudante escolha onde concentrar sua prática.'] },
    ],
    cta: { title: 'Pronto para praticar?', text: 'Explore casos clínicos e transforme o estudo em raciocínio aplicado.', label: 'Conhecer os casos', to: '/casos' },
  },
  diferenciais: {
    kicker: 'DIFERENCIAIS MEDSYNC',
    title: 'Uma plataforma construída ao redor do raciocínio clínico.',
    intro: 'O MedSync combina simulação, diagnóstico visual e acompanhamento de desempenho para criar uma jornada de prática mais ativa, objetiva e próxima dos desafios da formação médica.',
    icon: FiZap,
    highlights: [
      { icon: FiLayers, title: 'Simulação em etapas', text: 'O usuário solicita exames, registra hipóteses e define a conduta dentro de um fluxo clínico organizado.' },
      { icon: FiCheckCircle, title: 'Feedback estruturado', text: 'A avaliação compara as decisões com critérios clínicos revisados e aponta oportunidades concretas de melhoria.' },
      { icon: FiTrendingUp, title: 'Evolução mensurável', text: 'O painel reúne notas, histórico, especialidades, conquistas e áreas que precisam de mais atenção.' },
      { icon: FiBookOpen, title: 'Prática ativa', text: 'Casos completos e desafios visuais rápidos ajudam a treinar diferentes dimensões do conhecimento médico.' },
      { icon: FiShield, title: 'Transparência educacional', text: 'A plataforma diferencia conteúdo de estudo de orientação médica e identifica recursos ainda em revisão.' },
      { icon: FiTarget, title: 'Foco no próximo passo', text: 'As informações do painel ajudam o estudante a decidir o que revisar e qual área praticar em seguida.' },
    ],
    sections: [
      { title: 'Mais do que responder questões', paragraphs: ['Em vez de apresentar apenas perguntas isoladas, o MedSync estimula a construção completa do raciocínio: investigação, diagnóstico e cuidado inicial.', 'A experiência foi desenhada para valorizar decisões justificadas, evitar solicitações desnecessárias e reforçar a segurança da conduta.'] },
    ],
    cta: { title: 'Experimente uma forma mais ativa de estudar', text: 'Crie sua conta e acompanhe sua evolução clínica.', label: 'Começar agora', to: '/cadastro' },
  },
  embaixadores: {
    kicker: 'PROGRAMA DE EMBAIXADORES',
    title: 'Ajude a construir uma nova comunidade de educação médica.',
    intro: 'O programa de embaixadores MedSync é voltado a estudantes que gostam de conectar pessoas, compartilhar conhecimento e representar iniciativas de inovação dentro da universidade.',
    icon: FiUsers,
    highlights: [
      { icon: FiUsers, title: 'Represente sua instituição', text: 'Seja o ponto de conexão entre o MedSync e estudantes do seu curso ou região.' },
      { icon: FiAward, title: 'Desenvolva sua liderança', text: 'Participe de ações, campanhas e experiências que fortalecem comunicação e protagonismo.' },
      { icon: FiHeart, title: 'Construa conosco', text: 'Compartilhe percepções da comunidade e ajude a melhorar recursos pensados para estudantes.' },
    ],
    sections: [
      { title: 'O que um embaixador pode fazer', items: ['Apresentar o MedSync a colegas e grupos acadêmicos.', 'Apoiar divulgações e ações educacionais na universidade.', 'Coletar sugestões e necessidades dos estudantes.', 'Participar de campanhas, testes e lançamentos da plataforma.'] },
      { title: 'Quem procuramos', paragraphs: ['Estudantes de medicina comunicativos, responsáveis e interessados em educação, tecnologia e inovação. Não é necessário ter experiência prévia com marketing ou produção de conteúdo.'] },
      { title: 'Como demonstrar interesse', paragraphs: ['A seleção e as condições do programa serão divulgadas pelos canais oficiais do MedSync. Siga nosso Instagram para acompanhar a abertura das próximas turmas.'] },
    ],
    externalCta: { title: 'Acompanhe a abertura das inscrições', text: 'As novidades do programa serão publicadas no perfil oficial do MedSync.', label: 'Seguir no Instagram', href: 'https://www.instagram.com/medsync.educacional/' },
  },
};

const legalPages = {
  termos: {
    kicker: 'TRANSPARÊNCIA',
    title: 'Termos de Uso',
    intro: `Estes Termos regulam o acesso e a utilização da plataforma MedSync, operada por ${companyName}, inscrita no CNPJ sob o nº ${companyCnpj}.`,
    updatedAt: 'Última atualização: 2 de agosto de 2026',
    sections: [
      { title: '1. Aceitação dos Termos', paragraphs: ['Ao criar uma conta, acessar ou utilizar o MedSync, o usuário declara ter lido e concordado com estes Termos e com a Política de Privacidade. Se não concordar, deverá interromper o uso da plataforma.'] },
      { title: '2. Finalidade educacional', paragraphs: ['O MedSync oferece recursos de estudo e simulação destinados à educação em saúde. O conteúdo não constitui consulta, diagnóstico, prescrição, laudo ou recomendação para casos reais e não substitui supervisão docente, protocolos institucionais ou avaliação por profissional habilitado.', 'Casos, imagens, respostas e feedbacks devem ser utilizados exclusivamente para aprendizagem.'] },
      { title: '3. Cadastro e segurança da conta', items: ['O usuário deve fornecer informações verdadeiras e manter suas credenciais em segurança.', 'A conta é pessoal e não deve ser compartilhada com terceiros.', 'O usuário deve comunicar o uso não autorizado assim que tomar conhecimento.', 'Podemos suspender acessos que representem fraude, abuso ou risco à plataforma.'] },
      { title: '4. Uso permitido', paragraphs: ['O usuário se compromete a utilizar a plataforma de forma lícita, ética e compatível com sua finalidade educacional. É proibido interferir no funcionamento do serviço, tentar acessar áreas restritas, extrair conteúdo de forma automatizada sem autorização ou utilizar a plataforma para violar direitos de terceiros.'] },
      { title: '5. Conteúdo e propriedade intelectual', paragraphs: ['A marca MedSync, a interface, os textos autorais, a organização dos casos, os recursos interativos e demais elementos próprios são protegidos pela legislação aplicável. Imagens ou materiais de terceiros permanecem sujeitos às respectivas licenças e atribuições.', 'O acesso à plataforma não transfere ao usuário direitos de propriedade intelectual.'] },
      { title: '6. Planos e pagamentos', paragraphs: ['Recursos gratuitos e pagos podem variar conforme o plano apresentado no momento da contratação. Preços, periodicidade, benefícios e condições aplicáveis serão informados antes da confirmação.', 'Cancelamentos, arrependimento e reembolsos observarão a legislação brasileira e as condições exibidas no processo de contratação.'] },
      { title: '7. Disponibilidade e atualizações', paragraphs: ['Buscamos manter o serviço disponível e seguro, mas interrupções podem ocorrer por manutenção, atualização, falha técnica ou evento fora de nosso controle. Recursos e conteúdos podem ser aprimorados, substituídos ou descontinuados, preservados os direitos legalmente assegurados.'] },
      { title: '8. Limitação de responsabilidade', paragraphs: ['O usuário é responsável por avaliar como utiliza o conteúdo educacional. O MedSync não deve ser usado para decidir sobre pacientes reais sem a validação de profissional habilitado e das normas aplicáveis.'] },
      { title: '9. Encerramento e redefinição de dados', paragraphs: ['O usuário pode redefinir suas estatísticas pela função disponível no painel. Essa ação remove o histórico indicado na confirmação, mas preserva a conta. Solicitações relacionadas à conta poderão ser realizadas pelos canais oficiais disponibilizados na plataforma.'] },
      { title: '10. Alterações e legislação aplicável', paragraphs: ['Estes Termos podem ser atualizados para refletir mudanças legais, operacionais ou de produto. A versão vigente permanecerá publicada nesta página.', 'Aplica-se a legislação da República Federativa do Brasil, incluindo normas de proteção do consumidor quando cabíveis.'] },
    ],
  },
  privacidade: {
    kicker: 'TRANSPARÊNCIA',
    title: 'Política de Privacidade',
    intro: `Esta Política explica como ${companyName}, CNPJ ${companyCnpj}, trata dados pessoais relacionados ao uso da plataforma MedSync, em conformidade com a Lei Geral de Proteção de Dados Pessoais — LGPD.`,
    updatedAt: 'Última atualização: 2 de agosto de 2026',
    sections: [
      { title: '1. Dados que podemos tratar', items: ['Dados de cadastro, como nome, e-mail e credenciais protegidas.', 'Dados de uso, como casos realizados, respostas, exames selecionados, notas e histórico de progresso.', 'Dados técnicos e de segurança, como registros de acesso, identificadores de requisição, dispositivo e informações necessárias à prevenção de abuso.', 'Dados de assinatura e pagamento, quando aplicável, processados com o apoio de prestadores especializados.'] },
      { title: '2. Para que utilizamos os dados', items: ['Criar, autenticar e proteger a conta do usuário.', 'Entregar simulações, avaliações, histórico e funcionalidades personalizadas.', 'Acompanhar desempenho e apresentar métricas educacionais.', 'Melhorar estabilidade, segurança, conteúdo e experiência da plataforma.', 'Cumprir obrigações legais, regulatórias e exercer direitos em processos.'] },
      { title: '3. Bases legais', paragraphs: ['O tratamento pode se basear na execução de contrato e procedimentos preliminares, cumprimento de obrigação legal, legítimo interesse com avaliação dos direitos do titular, exercício regular de direitos e consentimento quando essa for a base adequada.'] },
      { title: '4. Compartilhamento', paragraphs: ['Dados podem ser tratados por fornecedores que apoiam hospedagem, banco de dados, segurança, análise de desempenho, comunicação e pagamentos. Esses prestadores recebem apenas o necessário para executar suas funções e devem observar obrigações de proteção de dados.', 'Também poderemos compartilhar informações por obrigação legal, ordem de autoridade competente ou para proteger direitos e a segurança da plataforma e de seus usuários. Não comercializamos dados pessoais.'] },
      { title: '5. Armazenamento e segurança', paragraphs: ['Adotamos medidas técnicas e organizacionais compatíveis com os riscos do tratamento, incluindo controle de acesso, proteção de credenciais e monitoramento de segurança. Nenhum sistema é absolutamente invulnerável, mas trabalhamos para prevenir e responder a incidentes.', 'Os dados são mantidos pelo período necessário às finalidades informadas, ao cumprimento de obrigações legais e ao exercício de direitos.'] },
      { title: '6. Direitos do titular', items: ['Confirmar a existência de tratamento e solicitar acesso aos dados.', 'Solicitar correção de dados incompletos, inexatos ou desatualizados.', 'Solicitar anonimização, bloqueio ou eliminação quando aplicável.', 'Obter informações sobre compartilhamento e consequências do consentimento.', 'Revogar consentimento e solicitar portabilidade, quando cabível.', 'Solicitar revisão de decisões automatizadas nos termos da legislação.'] },
      { title: '7. Estatísticas e exclusão', paragraphs: ['A função “Resetar minhas estatísticas” remove tentativas, notas e avaliações associadas ao progresso, conforme indicado na confirmação. Essa função não exclui a conta ou os dados necessários para mantê-la ativa.', 'Outras solicitações de privacidade poderão ser encaminhadas pelos canais oficiais disponibilizados no rodapé da plataforma. Poderemos solicitar informações para confirmar a identidade do titular.'] },
      { title: '8. Cookies e tecnologias semelhantes', paragraphs: ['Podemos utilizar armazenamento local e tecnologias necessárias para autenticação, segurança, preferências e funcionamento da plataforma. Quando forem utilizados recursos não essenciais que exijam consentimento, serão apresentados controles apropriados.'] },
      { title: '9. Crianças e adolescentes', paragraphs: ['A plataforma é direcionada à educação médica e não é projetada para crianças. Caso o uso envolva adolescente, deverão ser observadas as autorizações e proteções previstas na legislação aplicável.'] },
      { title: '10. Atualizações desta Política', paragraphs: ['Esta Política pode ser atualizada diante de mudanças legais, operacionais ou tecnológicas. A versão atual e sua data permanecerão disponíveis nesta página.'] },
    ],
  },
};

const InstitutionalPage = ({ page }) => {
  const content = pages[page];
  const HeroIcon = content.icon;

  return (
    <div className="institutional-page page-container">
      <header className="institutional-hero">
        <div>
          <span className="institutional-kicker">{content.kicker}</span>
          <h1>{content.title}</h1>
          <p>{content.intro}</p>
        </div>
        <span className="institutional-hero-icon" aria-hidden="true"><HeroIcon /></span>
      </header>

      <section className={`institutional-highlights ${content.highlights.length > 3 ? 'is-wide' : ''}`}>
        {content.highlights.map((highlight) => {
          const HighlightIcon = highlight.icon;
          return (
            <article key={highlight.title}>
              <span><HighlightIcon /></span>
              <h2>{highlight.title}</h2>
              <p>{highlight.text}</p>
            </article>
          );
        })}
      </section>

      <div className="institutional-content">
        {content.sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {section.items && <BulletList items={section.items} />}
          </section>
        ))}
      </div>

      {content.cta && (
        <section className="institutional-cta">
          <div><h2>{content.cta.title}</h2><p>{content.cta.text}</p></div>
          <Link to={content.cta.to}>{content.cta.label} <FiArrowRight /></Link>
        </section>
      )}
      {content.externalCta && (
        <section className="institutional-cta">
          <div><h2>{content.externalCta.title}</h2><p>{content.externalCta.text}</p></div>
          <a href={content.externalCta.href} target="_blank" rel="noreferrer">{content.externalCta.label} <FiArrowRight /></a>
        </section>
      )}
    </div>
  );
};

const LegalPage = ({ page }) => {
  const content = legalPages[page];
  return (
    <div className="legal-page page-container">
      <header className="legal-hero">
        <span className="institutional-kicker">{content.kicker}</span>
        <h1>{content.title}</h1>
        <p>{content.intro}</p>
        <small>{content.updatedAt}</small>
      </header>
      <div className="legal-layout">
        <aside>
          <strong>Nesta página</strong>
          {content.sections.map((section, index) => <a key={section.title} href={`#secao-${index + 1}`}>{section.title}</a>)}
        </aside>
        <article className="legal-document">
          {content.sections.map((section, index) => (
            <section id={`secao-${index + 1}`} key={section.title}>
              <h2>{section.title}</h2>
              {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.items && <BulletList items={section.items} />}
            </section>
          ))}
        </article>
      </div>
    </div>
  );
};

const BulletList = ({ items }) => (
  <ul className="institutional-list">
    {items.map((item) => <li key={item}><FiCheckCircle aria-hidden="true" /><span>{item}</span></li>)}
  </ul>
);

export { InstitutionalPage, LegalPage };
