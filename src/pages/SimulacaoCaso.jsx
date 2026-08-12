import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    FiActivity,
    FiAlertCircle,
    FiArrowLeft,
    FiArrowRight,
    FiCheck,
    FiCheckCircle,
    FiClipboard,
    FiEdit3,
    FiFileText,
    FiHeart,
    FiTarget,
    FiThermometer,
    FiUser,
    FiWind,
} from 'react-icons/fi';
import ClinicalEvaluationLoader from '../components/ClinicalEvaluationLoader';
import { api, ApiError } from '../services/api';

const workflowSteps = [
    { id: 'apresentacao', label: 'Caso clínico', short: 'Conheça o paciente', icon: FiUser },
    { id: 'exames', label: 'Exames', short: 'Investigue com critério', icon: FiClipboard },
    { id: 'hipotese', label: 'Hipótese', short: 'Sintetize o diagnóstico', icon: FiTarget },
    { id: 'conduta', label: 'Conduta', short: 'Defina o cuidado', icon: FiActivity },
];

const vitalIcons = {
    pa: FiHeart,
    fc: FiActivity,
    fr: FiWind,
    spo2: FiWind,
    temperatura: FiThermometer,
};

const SimulacaoCaso = () => {
    const { casoId } = useParams();
    const navigate = useNavigate();
    const [caso, setCaso] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submissionError, setSubmissionError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [activeStep, setActiveStep] = useState(0);
    const [maxReachedStep, setMaxReachedStep] = useState(0);
    const [selectedExams, setSelectedExams] = useState({});
    const [examJustifications, setExamJustifications] = useState({});
    const [examResults, setExamResults] = useState([]);
    const [resultsReleased, setResultsReleased] = useState(false);
    const [hipotese, setHipotese] = useState('');
    const [conduta, setConduta] = useState('');

    useEffect(() => {
        api.getCase(casoId)
            .then((data) => { setCaso(data); setIsLoading(false); })
            .catch((requestError) => {
                if (requestError instanceof ApiError && requestError.status === 401) {
                    navigate('/login', { replace: true });
                    return;
                }
                setError(requestError.message);
                setIsLoading(false);
            });
    }, [casoId, navigate]);

    const selectedExamCount = useMemo(
        () => Object.values(selectedExams).filter(Boolean).length,
        [selectedExams],
    );

    const completedSteps = [
        activeStep > 0,
        resultsReleased,
        Boolean(hipotese.trim()),
        Boolean(conduta.trim()),
    ].filter(Boolean).length;

    const goToStep = (index) => {
        if (index < 0 || index > maxReachedStep || index >= workflowSteps.length) return;
        setSubmissionError(null);
        setActiveStep(index);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const advance = () => {
        if (activeStep === 1 && !resultsReleased) {
            setSubmissionError('Solicite ao menos um exame e libere o resultado antes de avançar.');
            return;
        }
        if (activeStep === 2 && !hipotese.trim()) {
            setSubmissionError('Registre sua hipótese diagnóstica antes de avançar.');
            return;
        }
        const next = Math.min(activeStep + 1, workflowSteps.length - 1);
        setSubmissionError(null);
        setMaxReachedStep((current) => Math.max(current, next));
        setActiveStep(next);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleExamSelection = (examId) => {
        const willSelect = !selectedExams[examId];
        setSelectedExams((previous) => ({ ...previous, [examId]: willSelect }));
        if (!willSelect) {
            setExamJustifications((current) => {
                const next = { ...current };
                delete next[examId];
                return next;
            });
        }
        setResultsReleased(false);
        setExamResults([]);
        setStatusMessage('');
    };

    const handleShowResults = () => {
        if (!selectedExamCount) {
            setStatusMessage('Selecione ao menos um exame antes de solicitar.');
            return;
        }
        const results = caso.exames_disponiveis.filter((exam) => selectedExams[exam.id]);
        setExamResults(results);
        setResultsReleased(true);
        setStatusMessage(`${results.length} resultado(s) incorporado(s) ao prontuário.`);
    };

    const handleSubmit = async () => {
        if (!hipotese.trim() || !conduta.trim()) {
            setSubmissionError('Preencha a hipótese diagnóstica e a conduta antes de finalizar.');
            return;
        }
        if (!caso.avaliacao_2_disponivel) {
            setSubmissionError('Este caso ainda está em revisão clínica e não pode receber uma pontuação segura.');
            return;
        }

        setSubmissionError(null);
        setIsSubmitting(true);
        try {
            const result = await api.finalizeSimulation(Number(casoId), {
                exames_solicitados: Object.keys(selectedExams).filter((id) => selectedExams[id]),
                justificativas_exames: Object.fromEntries(
                    Object.entries(examJustifications).filter(([, value]) => value.trim()),
                ),
                hipotese_diagnostica: hipotese,
                conduta_proposta: conduta,
            });
            const currentParams = new URLSearchParams(window.location.search);
            const resultParams = new URLSearchParams();
            if (currentParams.get('trilha') && currentParams.get('atividade')) {
                resultParams.set('trilha', currentParams.get('trilha'));
                resultParams.set('atividade', currentParams.get('atividade'));
            }
            const resultSearch = resultParams.toString();
            navigate(`/resultados/${result.progresso_id}${resultSearch ? `?${resultSearch}` : ''}`, { state: { result } });
        } catch (requestError) {
            if (requestError instanceof ApiError && requestError.status === 401) {
                navigate('/login', { replace: true });
                return;
            }
            setSubmissionError(requestError.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="page-container simulation-message">Preparando o prontuário...</div>;
    if (error) return <div className="page-container simulation-message">Erro: {error}</div>;
    if (!caso) return <div className="page-container simulation-message">Não foi possível carregar o caso.</div>;
    if (isSubmitting) return <ClinicalEvaluationLoader caseTitle={caso.titulo} />;

    const step = workflowSteps[activeStep];

    return (
        <div className="clinical-journey page-container">
            <header className="journey-header">
                <button type="button" className="journey-exit" onClick={() => navigate('/casos')}><FiArrowLeft /> Casos clínicos</button>
                <div className="journey-header-copy">
                    <div><span>{caso.especialidade}</span><small>SIMULAÇÃO CLÍNICA GUIADA</small></div>
                    <h1>{caso.titulo}</h1>
                </div>
                <div className="journey-progress" aria-label={`Etapa ${activeStep + 1} de 4`}>
                    <strong>{String(activeStep + 1).padStart(2, '0')}</strong><span>/ 04</span>
                </div>
            </header>

            <nav className="journey-stepper" aria-label="Etapas da simulação">
                {workflowSteps.map((item, index) => {
                    const Icon = item.icon;
                    const complete = index < activeStep || (index === 3 && Boolean(conduta.trim()));
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => goToStep(index)}
                            disabled={index > maxReachedStep}
                            className={`${index === activeStep ? 'is-active' : ''} ${complete ? 'is-complete' : ''}`}
                            aria-current={index === activeStep ? 'step' : undefined}
                        >
                            <span>{complete ? <FiCheck /> : <Icon />}</span>
                            <div><strong>{item.label}</strong><small>{item.short}</small></div>
                            {index < workflowSteps.length - 1 && <i aria-hidden="true" />}
                        </button>
                    );
                })}
            </nav>

            <main className={`journey-layout ${activeStep === 0 ? 'is-presentation' : ''}`}>
                <section className="journey-stage" key={step.id}>
                    {activeStep === 0 && <PresentationStage caso={caso} onAdvance={advance} />}
                    {activeStep === 1 && (
                        <ExamsStage
                            caso={caso}
                            selectedExams={selectedExams}
                            onSelect={handleExamSelection}
                            selectedCount={selectedExamCount}
                            results={examResults}
                            resultsReleased={resultsReleased}
                            onRelease={handleShowResults}
                            statusMessage={statusMessage}
                            justifications={examJustifications}
                            onJustificationChange={(examId, value) => setExamJustifications((current) => ({ ...current, [examId]: value }))}
                        />
                    )}
                    {activeStep === 2 && (
                        <ReasoningStage
                            kind="hypothesis"
                            value={hipotese}
                            onChange={setHipotese}
                        />
                    )}
                    {activeStep === 3 && (
                        <ReasoningStage
                            kind="conduct"
                            value={conduta}
                            onChange={setConduta}
                        />
                    )}

                    {activeStep > 0 && (
                        <div className="journey-actions">
                            <button type="button" className="journey-back" onClick={() => goToStep(activeStep - 1)}><FiArrowLeft /> Voltar</button>
                            {activeStep < 3 ? (
                                <button type="button" className="journey-next" onClick={advance}>Avançar para {workflowSteps[activeStep + 1].label.toLowerCase()} <FiArrowRight /></button>
                            ) : (
                                <button type="button" className="journey-submit" onClick={handleSubmit} disabled={!caso.avaliacao_2_disponivel}>
                                    <FiActivity /> {caso.avaliacao_2_disponivel ? 'Enviar para a Synapse' : 'Avaliação em revisão clínica'}
                                </button>
                            )}
                        </div>
                    )}
                    {submissionError && <p className="simulation-error journey-error" role="alert"><FiAlertCircle /> {submissionError}</p>}
                </section>

                {activeStep > 0 && (
                    <ClinicalMemory
                        caso={caso}
                        activeStep={activeStep}
                        results={examResults}
                        justifications={examJustifications}
                        hypothesis={hipotese}
                        completedSteps={completedSteps}
                        onReview={goToStep}
                    />
                )}
            </main>
        </div>
    );
};

const PresentationStage = ({ caso, onAdvance }) => (
    <div className="presentation-stage">
        <div className="stage-heading">
            <span>01 · APRESENTAÇÃO DO PACIENTE</span>
            <h2>Antes de decidir, observe.</h2>
            <p>Leia o prontuário com calma e identifique os achados que mudam a prioridade clínica.</p>
        </div>

        <div className="patient-record-grid">
            <article className="patient-record-card history">
                <span><FiFileText /></span>
                <div><small>HISTÓRIA CLÍNICA</small><h3>Queixa e contexto</h3><p>{caso.historia_clinica}</p></div>
            </article>
            <article className="patient-record-card physical">
                <span><FiUser /></span>
                <div><small>EXAME FÍSICO</small><h3>Achados ao exame</h3><p>{caso.exame_fisico}</p></div>
            </article>
        </div>

        <section className="vital-signs-section">
            <div className="vitals-heading">
                <div><span>SINAIS VITAIS</span><h3>Estado atual do paciente</h3></div>
                <p><i className="normal" /> Normal <i className="altered" /> Alterado</p>
            </div>
            <div className="vital-signs-grid">
                {(caso.sinais_vitais || []).map((vital) => <VitalCard key={vital.id} vital={vital} />)}
            </div>
            <small className="vital-reference-note">Faixas gerais para adultos em repouso. Interprete sempre no contexto clínico.</small>
        </section>

        <div className="presentation-advance">
            <div><FiCheckCircle /><p><strong>Terminou a leitura?</strong><span>As informações permanecerão disponíveis nas próximas etapas.</span></p></div>
            <button type="button" onClick={onAdvance}>Iniciar investigação <FiArrowRight /></button>
        </div>
    </div>
);

const VitalCard = ({ vital }) => {
    const Icon = vitalIcons[vital.id] || FiActivity;
    const informed = vital.valor !== null && vital.valor !== undefined;
    return (
        <article className={`vital-card is-${vital.status}`}>
            <div className="vital-icon"><Icon /></div>
            <div className="vital-copy"><span>{vital.nome}</span><strong>{informed ? vital.valor : '—'} <small>{informed ? vital.unidade : 'não informado'}</small></strong></div>
            <div className="vital-status"><i />{vital.status === 'normal' ? 'Normal' : vital.status === 'alterado' ? 'Alterado' : 'Sem dado'}<small>Ref. {vital.referencia}</small></div>
        </article>
    );
};

const ExamsStage = ({ caso, selectedExams, onSelect, selectedCount, results, resultsReleased, onRelease, statusMessage, justifications, onJustificationChange }) => (
    <div className="decision-stage">
        <div className="stage-heading compact">
            <span>02 · INVESTIGAÇÃO</span>
            <h2>Quais exames mudariam sua decisão?</h2>
            <p>Escolha com intenção. Exames essenciais, omitidos e de baixo valor serão considerados no feedback.</p>
        </div>
        <div className="stage-tip"><FiAlertCircle /><span>Evite pedir tudo. Pense em probabilidade pré-teste, gravidade e impacto sobre a conduta.</span></div>
        <div className="journey-exam-grid">
            {caso.exames_disponiveis.map((exam) => {
                const selected = Boolean(selectedExams[exam.id]);
                return (
                    <label key={exam.id} className={selected ? 'is-selected' : ''}>
                        <input type="checkbox" checked={selected} onChange={() => onSelect(exam.id)} />
                        <span>{selected ? <FiCheck /> : <FiClipboard />}</span>
                        <strong>{exam.nome}</strong>
                    </label>
                );
            })}
        </div>
        {selectedCount > 0 && (
            <section className="exam-rationale-section">
                <div>
                    <span>JUSTIFICATIVA CLÍNICA · OPCIONAL</span>
                    <h3>O que você espera descobrir com cada exame?</h3>
                    <p>A Synapse avaliará se você compreendeu a utilidade do exame, sem alterar a pontuação por deixar o campo vazio.</p>
                </div>
                {caso.exames_disponiveis.filter((exam) => selectedExams[exam.id]).map((exam) => (
                    <label key={exam.id}>
                        <strong>{exam.nome}</strong>
                        <textarea
                            aria-label={`Justificativa para ${exam.nome}`}
                            rows="2"
                            maxLength="600"
                            value={justifications[exam.id] || ''}
                            onChange={(event) => onJustificationChange(String(exam.id), event.target.value)}
                            placeholder="Ex.: este resultado ajudaria a confirmar, excluir ou estratificar..."
                        />
                        <small>{(justifications[exam.id] || '').length}/600</small>
                    </label>
                ))}
            </section>
        )}
        <button type="button" className="release-results-button" onClick={onRelease}><FiClipboard /> Solicitar exames selecionados <b>{selectedCount}</b></button>
        {statusMessage && <p className="simulation-status" role="status">{statusMessage}</p>}
        {resultsReleased && (
            <section className="released-results">
                <div><span>RESULTADOS LIBERADOS</span><strong>{results.length} novo(s) dado(s) no prontuário</strong></div>
                {results.map((result, index) => (
                    <article key={result.id} style={{ '--delay': `${index * 80}ms` }}><FiCheckCircle /><div><strong>{result.nome}</strong><p>{result.resultado}</p></div></article>
                ))}
            </section>
        )}
    </div>
);

const ReasoningStage = ({ kind, value, onChange }) => {
    const hypothesis = kind === 'hypothesis';
    const title = hypothesis ? 'Qual é a sua hipótese diagnóstica?' : 'O que você faria por este paciente agora?';
    return (
        <div className="decision-stage reasoning-stage">
            <div className="stage-heading compact">
                <span>{hypothesis ? '03 · SÍNTESE DIAGNÓSTICA' : '04 · PLANO DE CUIDADO'}</span>
                <h2>{title}</h2>
                <p>{hypothesis ? 'Registre a hipótese principal, diferenciais relevantes e os achados que sustentam sua decisão.' : 'Defina prioridades, medidas imediatas, tratamento, monitorização e critérios de reavaliação.'}</p>
            </div>
            <div className="reasoning-scaffold">
                {(hypothesis
                    ? ['Hipótese principal', 'Diferenciais relevantes', 'Achados que sustentam']
                    : ['Estabilização e prioridades', 'Tratamento proposto', 'Monitorização e reavaliação']
                ).map((item, index) => <span key={item}><b>{index + 1}</b>{item}</span>)}
            </div>
            <label className="journey-textarea">
                <span>{hypothesis ? 'Seu raciocínio diagnóstico' : 'Sua conduta inicial'}</span>
                <textarea
                    aria-label={hypothesis ? 'Qual é a sua principal hipótese?' : 'Qual será sua conduta inicial?'}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    rows="12"
                    placeholder={hypothesis ? 'Minha principal hipótese é... porque os achados...' : 'Inicialmente, eu priorizaria... Em seguida... Reavaliaria...'}
                />
                <small><FiEdit3 /> {value.length} caracteres {value.trim() && <b><FiCheck /> resposta registrada</b>}</small>
            </label>
            {!hypothesis && <div className="synapse-submit-note"><FiActivity /><p><strong>A Synapse analisará sua decisão</strong><span>O feedback comparará hipótese e conduta com a rubrica clínica revisada e simulará a resposta esperada do paciente.</span></p></div>}
        </div>
    );
};

const ClinicalMemory = ({ caso, activeStep, results, justifications, hypothesis, completedSteps, onReview }) => (
    <aside className="clinical-memory" aria-label="Resumo clínico acumulado">
        <div className="memory-heading"><span><FiFileText /></span><div><small>PRONTUÁRIO ACUMULADO</small><h2>O que você já sabe</h2></div><b>{completedSteps}/4</b></div>
        <MemoryBlock number="01" title="Apresentação" onClick={() => onReview(0)}>
            <p>{caso.historia_clinica}</p><small>{caso.exame_fisico}</small>
        </MemoryBlock>
        {activeStep >= 2 && (
            <MemoryBlock number="02" title="Exames solicitados" onClick={() => onReview(1)}>
                {results.length ? results.map((item) => <div className="memory-exam" key={item.id}><p><strong>{item.nome}:</strong> {item.resultado}</p>{justifications[item.id] && <small><b>Sua justificativa:</b> {justifications[item.id]}</small>}</div>) : <p>Nenhum resultado liberado.</p>}
            </MemoryBlock>
        )}
        {activeStep >= 3 && (
            <MemoryBlock number="03" title="Sua hipótese" onClick={() => onReview(2)}>
                <p>{hypothesis || 'Hipótese ainda não registrada.'}</p>
            </MemoryBlock>
        )}
        <div className="memory-live"><i /><span>Etapa atual</span><strong>{workflowSteps[activeStep].label}</strong></div>
    </aside>
);

const MemoryBlock = ({ number, title, onClick, children }) => (
    <section className="memory-block">
        <header><span>{number}</span><strong>{title}</strong><button type="button" onClick={onClick}>Revisar</button></header>
        <div>{children}</div>
    </section>
);

export default SimulacaoCaso;
