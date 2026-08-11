import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FiMessageCircle, FiX } from 'react-icons/fi';

const GUIDE_CONTEXTS = [
  {
    matches: (path) => path === '/dashboard',
    eyebrow: 'SEU COPILOTO',
    title: 'Vamos transformar dados em progresso?',
    message: 'Use os atalhos do painel para retomar seu próximo treino sem perder o ritmo.',
  },
  {
    matches: (path) => path === '/casos',
    eyebrow: 'DICA DO NEXO',
    title: 'Escolha pelo que precisa praticar',
    message: 'Especialidade e dificuldade ajudam a montar uma sessão de estudo mais intencional.',
  },
  {
    matches: (path) => path.startsWith('/trilhas'),
    eyebrow: 'ROTA DE ESTUDOS',
    title: 'Um passo por vez funciona melhor',
    message: 'Continue sua trilha atual antes de abrir uma nova frente de estudo.',
  },
  {
    matches: (path) => path === '/revisoes',
    eyebrow: 'REVISÃO INTELIGENTE',
    title: 'Revisar também é avançar',
    message: 'Priorize os conteúdos vencidos e os pontos em que você teve mais dificuldade.',
  },
  {
    matches: (path) => path === '/caderno-erros',
    eyebrow: 'APRENDA COM O PROCESSO',
    title: 'Seu erro virou material de estudo',
    message: 'Reveja o raciocínio antes de consultar a resposta e fortaleça a recuperação ativa.',
  },
  {
    matches: (path) => path === '/assinatura',
    eyebrow: 'ESCOLHA COM CALMA',
    title: 'Compare pelo seu ritmo de estudo',
    message: 'O melhor plano é o que combina com a frequência de treino que você consegue manter.',
  },
];

const isHiddenRoute = (path) => (
  path === '/'
  || path === '/desafios'
  || path === '/login'
  || path === '/cadastro'
  || path.startsWith('/admin')
  || /^\/casos\/[^/]+$/.test(path)
  || path.startsWith('/resultados/')
);

const NexoGuide = () => {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const context = GUIDE_CONTEXTS.find(({ matches }) => matches(pathname));

  if (!context || isHiddenRoute(pathname)) return null;

  return (
    <aside className={`nexo-guide ${isOpen ? 'is-open' : ''}`} aria-label="Ajuda contextual do NEXO">
      <div className="nexo-guide-message" aria-hidden={!isOpen}>
        <button
          type="button"
          className="nexo-guide-close"
          aria-label="Fechar dica do NEXO"
          disabled={!isOpen}
          onClick={() => setIsOpen(false)}
        >
          <FiX />
        </button>
        <span>{context.eyebrow}</span>
        <strong>{context.title}</strong>
        <p>{context.message}</p>
      </div>

      <button
        type="button"
        className="nexo-guide-trigger"
        aria-label={isOpen ? 'Fechar dica do NEXO' : 'Abrir dica do NEXO'}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className="nexo-guide-badge"><FiMessageCircle /></span>
        <img src="/images/nexo.webp" alt="" />
        <span className="nexo-guide-name">NEXO</span>
      </button>
    </aside>
  );
};

export default NexoGuide;
