import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../styles/learning-paths.css';
import {
  FiActivity,
  FiArrowLeft,
  FiArrowRight,
  FiAward,
  FiBarChart2,
  FiBookOpen,
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiCompass,
  FiImage,
  FiLayers,
  FiPlay,
  FiTarget,
  FiTrendingUp,
  FiZap,
} from 'react-icons/fi';
import { ApiError, api } from '../services/api';

const PATH_ICONS = {
  'emergencias-essenciais': FiZap,
  'cardiopulmonar-na-pratica': FiActivity,
  'diagnostico-por-imagem': FiImage,
  'fundamentos-diagnosticos': FiLayers,
};

const activityUrl = (path, activity) => {
  const params = new URLSearchParams({
    trilha: path.id,
    atividade: activity.id,
  });
  if (activity.tipo === 'desafio_visual') {
    params.set('desafio', activity.referencia_id);
    return `/desafios?${params.toString()}`;
  }
  return `/casos/${activity.referencia_id}?${params.toString()}`;
};

const findNextActivity = (path) => path.modulos
  .flatMap((module) => module.atividades)
  .find((activity) => !activity.progresso.concluida);

const PathCard = ({ path }) => {
  const PathIcon = PATH_ICONS[path.id] || FiBookOpen;
  const nextActivity = findNextActivity(path);
  return (
    <article className={`learning-path-card path-${path.cor}`}>
      <div className="learning-path-card-top">
        <span className="learning-path-icon"><PathIcon aria-hidden="true" /></span>
        <span className="learning-path-level">{path.nivel}</span>
      </div>
      <span className="learning-path-specialty">{path.especialidade}</span>
      <h2>{path.titulo}</h2>
      <p>{path.subtitulo}</p>

      <div className="learning-path-card-meta">
        <span><FiClock /> {path.duracao_minutos} min</span>
        <span><FiLayers /> {path.modulos.length} módulos</span>
      </div>

      <div className="learning-path-progress-copy">
        <span>{path.progresso.concluidas} de {path.progresso.total} atividades</span>
        <strong>{path.progresso.percentual}%</strong>
      </div>
      <div className="learning-path-progress" aria-hidden="true">
        <span style={{ width: `${path.progresso.percentual}%` }} />
      </div>

      <Link to={`/trilhas/${path.id}`} className="learning-path-open">
        {path.progresso.percentual === 100
          ? 'Revisar trilha'
          : path.progresso.concluidas > 0
            ? 'Continuar trilha'
            : 'Conhecer trilha'}
        <FiArrowRight />
      </Link>
      {nextActivity && path.progresso.concluidas > 0 && (
        <small className="learning-path-next">Próxima: {nextActivity.titulo}</small>
      )}
    </article>
  );
};

const TrilhasPage = () => {
  const { trilhaId } = useParams();
  const navigate = useNavigate();
  const [paths, setPaths] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getLearningPaths()
      .then(setPaths)
      .catch((requestError) => {
        if (requestError instanceof ApiError && requestError.status === 401) {
          navigate('/login', { replace: true });
          return;
        }
        setError(requestError.message);
      })
      .finally(() => setIsLoading(false));
  }, [navigate]);

  const selectedPath = paths.find((path) => path.id === trilhaId);
  const totals = useMemo(() => ({
    activities: paths.reduce((sum, path) => sum + path.progresso.total, 0),
    completedActivities: paths.reduce((sum, path) => sum + path.progresso.concluidas, 0),
    activePaths: paths.filter((path) => path.progresso.percentual > 0 && path.progresso.percentual < 100).length,
    completedPaths: paths.filter((path) => path.progresso.percentual === 100).length,
  }), [paths]);

  if (isLoading) {
    return <div className="page-container learning-paths-state">Preparando suas trilhas...</div>;
  }
  if (error) {
    return <div className="page-container learning-paths-state"><p>{error}</p></div>;
  }
  if (trilhaId && !selectedPath) {
    return (
      <div className="page-container learning-paths-state">
        <h1>Trilha não encontrada</h1>
        <Link to="/trilhas">Ver todas as trilhas</Link>
      </div>
    );
  }

  if (selectedPath) {
    const PathIcon = PATH_ICONS[selectedPath.id] || FiBookOpen;
    const nextActivity = findNextActivity(selectedPath);
    const firstActivity = selectedPath.modulos[0]?.atividades[0];
    const continueActivity = nextActivity || firstActivity;

    return (
      <div className={`page-container learning-path-detail path-${selectedPath.cor}`}>
        <Link to="/trilhas" className="learning-path-back"><FiArrowLeft /> Todas as trilhas</Link>

        <header className="learning-path-detail-hero">
          <div className="learning-path-detail-copy">
            <span className="learning-path-detail-icon"><PathIcon /></span>
            <div>
              <span className="learning-path-detail-kicker">{selectedPath.especialidade} · {selectedPath.nivel}</span>
              <h1>{selectedPath.titulo}</h1>
              <p>{selectedPath.descricao}</p>
              <div className="learning-path-detail-meta">
                <span><FiClock /> {selectedPath.duracao_minutos} minutos</span>
                <span><FiLayers /> {selectedPath.modulos.length} módulos</span>
                <span><FiTarget /> {selectedPath.progresso.total} atividades</span>
              </div>
            </div>
          </div>

          <div className="learning-path-detail-progress">
            <div className="learning-path-ring" style={{ '--path-progress': `${selectedPath.progresso.percentual * 3.6}deg` }}>
              <strong>{selectedPath.progresso.percentual}%</strong>
            </div>
            <span>{selectedPath.progresso.concluidas} de {selectedPath.progresso.total} concluídas</span>
            {continueActivity && (
              <Link to={activityUrl(selectedPath, continueActivity)}>
                <FiPlay /> {selectedPath.progresso.concluidas ? 'Continuar agora' : 'Começar trilha'}
              </Link>
            )}
          </div>
        </header>

        <section className="learning-path-objectives">
          <div><FiCompass /><span><small>AO FINAL DESTA TRILHA</small><strong>Você será capaz de</strong></span></div>
          <ul>{selectedPath.objetivos.map((objective) => <li key={objective}><FiCheck /> {objective}</li>)}</ul>
        </section>

        <section className="learning-modules">
          <div className="learning-section-heading">
            <div><span>SEQUÊNCIA RECOMENDADA</span><h2>Módulos da trilha</h2></div>
            <strong>{selectedPath.progresso.media_melhores_notas}% <small>média das melhores notas</small></strong>
          </div>

          {selectedPath.modulos.map((module, moduleIndex) => (
            <article className="learning-module" key={module.id}>
              <div className="learning-module-heading">
                <span>{String(moduleIndex + 1).padStart(2, '0')}</span>
                <div><h3>{module.titulo}</h3><p>{module.descricao}</p></div>
                <strong>{module.progresso.concluidas}/{module.progresso.total}</strong>
              </div>

              <div className="learning-activities">
                {module.atividades.map((activity, activityIndex) => (
                  <article className={`learning-activity ${activity.progresso.concluida ? 'is-complete' : ''}`} key={activity.id}>
                    <span className="learning-activity-marker">
                      {activity.progresso.concluida ? <FiCheck /> : activityIndex + 1}
                    </span>
                    <span className="learning-activity-type">
                      {activity.tipo === 'desafio_visual' ? <FiImage /> : <FiActivity />}
                    </span>
                    <div className="learning-activity-copy">
                      <small>{activity.tipo === 'desafio_visual' ? 'DESAFIO VISUAL' : 'CASO CLÍNICO'} · {activity.especialidade}</small>
                      <h4>{activity.titulo}</h4>
                      <span><FiClock /> {activity.minutos} min</span>
                    </div>
                    {activity.progresso.concluida && (
                      <div className="learning-activity-score">
                        <strong>{activity.progresso.melhor_pontuacao}</strong><small>melhor nota</small>
                      </div>
                    )}
                    <Link to={activityUrl(selectedPath, activity)}>
                      {activity.progresso.concluida ? 'Refazer' : 'Iniciar'} <FiArrowRight />
                    </Link>
                  </article>
                ))}
              </div>
            </article>
          ))}
        </section>
      </div>
    );
  }

  return (
    <div className="page-container learning-paths-page">
      <header className="learning-paths-hero">
        <div>
          <span className="learning-paths-kicker"><FiCompass /> APRENDIZADO GUIADO</span>
          <h1>Trilhas para transformar prática em domínio clínico</h1>
          <p>Siga uma sequência planejada de desafios e casos, acompanhe sua evolução e retome exatamente de onde parou.</p>
        </div>
        <div className="learning-paths-hero-art" aria-hidden="true">
          <span><FiTarget /></span><span><FiActivity /></span><span><FiAward /></span>
        </div>
      </header>

      <section className="learning-path-summary" aria-label="Resumo das trilhas">
        <article><FiBookOpen /><div><small>TRILHAS DISPONÍVEIS</small><strong>{paths.length}</strong></div></article>
        <article><FiTrendingUp /><div><small>EM ANDAMENTO</small><strong>{totals.activePaths}</strong></div></article>
        <article><FiCheckCircle /><div><small>ATIVIDADES CONCLUÍDAS</small><strong>{totals.completedActivities}<span>/{totals.activities}</span></strong></div></article>
        <article><FiAward /><div><small>TRILHAS DOMINADAS</small><strong>{totals.completedPaths}</strong></div></article>
      </section>

      <section className="learning-paths-catalog">
        <div className="learning-section-heading">
          <div><span>ESCOLHA SEU FOCO</span><h2>Trilhas disponíveis</h2></div>
          <p>Você pode começar por qualquer trilha e avançar no seu ritmo.</p>
        </div>
        <div className="learning-path-grid">{paths.map((path) => <PathCard path={path} key={path.id} />)}</div>
      </section>

      <section className="learning-paths-how">
        <div><FiCompass /><span><strong>1. Escolha</strong><small>Defina a habilidade clínica que deseja fortalecer.</small></span></div>
        <FiArrowRight />
        <div><FiPlay /><span><strong>2. Pratique</strong><small>Conclua desafios e casos na sequência recomendada.</small></span></div>
        <FiArrowRight />
        <div><FiBarChart2 /><span><strong>3. Evolua</strong><small>Acompanhe conclusão, tentativas e melhores notas.</small></span></div>
      </section>
    </div>
  );
};

export default TrilhasPage;
