import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    FiActivity,
    FiAlertCircle,
    FiCheck,
    FiCheckCircle,
    FiChevronLeft,
    FiChevronRight,
    FiClipboard,
    FiEdit3,
    FiFileText,
    FiTarget,
} from 'react-icons/fi';
import ClinicalEvaluationLoader from '../components/ClinicalEvaluationLoader';
import { api, ApiError } from '../services/api';

const workflowSteps = [
    { id: 'exames', label: 'Exames', description: 'Selecione com critério', icon: FiClipboard },
    { id: 'hipotese', label: 'Hipótese', description: 'Organize o raciocínio', icon: FiTarget },
    { id: 'conduta', label: 'Conduta', description: 'Defina o cuidado inicial', icon: FiActivity },
];

const editorGuides = {
    hipotese: ['Hipótese principal', 'Diagnósticos diferenciais', 'Achados que sustentam sua decisão'],
    conduta: ['Medidas imediatas', 'Tratamento proposto', 'Monitorização e reavaliação'],
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
    const [activeTab, setActiveTab] = useState('exames');
    const [selectedExams, setSelectedExams] = useState({});
    const [examResults, setExamResults] = useState([]);
    const [hipotese, setHipotese] = useState('');
    const [conduta, setConduta] = useState('');

    useEffect(() => {
        api.getCase(casoId)
            .then((data) => {
                setCaso(data);
                setIsLoading(false);
            })
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

    const stepStatus = {
        exames: selectedExamCount > 0,
        hipotese: Boolean(hipotese.trim()),
        conduta: Boolean(conduta.trim()),
    };
    const completedSteps = Object.values(stepStatus).filter(Boolean).length;
    const activeStepIndex = workflowSteps.findIndex((step) => step.id === activeTab);

    const handleExamSelection = (examId) => {
        setSelectedExams((previous) => ({ ...previous, [examId]: !previous[examId] }));
        setStatusMessage('');
    };

    const handleShowResults = () => {
        if (!caso?.exames_disponiveis) return;
        const results = caso.exames_disponiveis.filter((exam) => selectedExams[exam.id]);
        setExamResults(results);
        setStatusMessage(
            results.length > 0
                ? `${results.length} resultado(s) de exame foram liberados.`
                : 'Selecione ao menos um exame para liberar resultados.',
        );
    };

    const moveToStep = (direction) => {
        const nextIndex = activeStepIndex + direction;
        if (nextIndex >= 0 && nextIndex < workflowSteps.length) {
            setActiveTab(workflowSteps[nextIndex].id);
        }
    };

    const handleSubmit = async () => {
        const respostasUsuario = {
            exames_solicitados: Object.keys(selectedExams).filter((id) => selectedExams[id]),
            hipotese_diagnostica: hipotese,
            conduta_proposta: conduta,
        };

        if (!hipotese.trim() || !conduta.trim()) {
            setSubmissionError('Preencha a hipótese diagnóstica e a conduta antes de finalizar.');
            return;
        }

        if (!caso.avaliacao_2_disponivel) {
            setSubmissionError(
                'Este caso ainda está em revisão clínica e não pode receber uma pontuação segura.',
            );
            return;
        }

        setSubmissionError(null);
        setStatusMessage('');
        setIsSubmitting(true);
        try {
            const result = await api.finalizeSimulation(Number(casoId), respostasUsuario);
            const currentParams = new URLSearchParams(window.location.search);
            const resultParams = new URLSearchParams();
            if (currentParams.get('trilha') && currentParams.get('atividade')) {
                resultParams.set('trilha', currentParams.get('trilha'));
                resultParams.set('atividade', currentParams.get('atividade'));
            }
            const resultSearch = resultParams.toString();
            navigate(
                `/resultados/${result.progresso_id}${resultSearch ? `?${resultSearch}` : ''}`,
                { state: { result } },
            );
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

    if (isLoading) return <div className="page-container simulation-message">A carregar o caso clínico...</div>;
    if (error) return <div className="page-container simulation-message">Erro: {error}</div>;
    if (!caso) return <div className="page-container simulation-message">Não foi possível carregar o caso.</div>;
    if (isSubmitting) return <ClinicalEvaluationLoader caseTitle={caso.titulo} />;

    return (
        <div className="simulation-workspace page-container">
            <header className="simulation-hero">
                <div>
                    <div className="simulation-hero-meta">
                        <span className="simulation-kicker">{caso.especialidade}</span>
                        {caso.avaliacao_2_disponivel && (
                            <span className="agent-feedback-tag"><FiActivity aria-hidden="true" /> Simulação 2.0</span>
                        )}
                    </div>
                    <h1>{caso.titulo}</h1>
                    <p>Analise o caso, escolha os exames com critério e registre seu raciocínio clínico.</p>
                </div>
                <div className="simulation-progress-card" aria-label={`${completedSteps} de 3 etapas preenchidas`}>
                    <strong>{completedSteps}/3</strong>
                    <span>etapas preenchidas</span>
                    <div className="simulation-progress-track" aria-hidden="true">
                        <span style={{ width: `${(completedSteps / workflowSteps.length) * 100}%` }} />
                    </div>
                </div>
            </header>

            <div className="simulation-container simulation-layout">
                <section className="info-panel clinical-case-panel" aria-label="Informações do caso clínico">
                    <div className="panel-heading">
                        <span className="panel-icon"><FiFileText aria-hidden="true" /></span>
                        <div>
                            <span className="panel-eyebrow">Prontuário do paciente</span>
                            <h2>Dados clínicos</h2>
                        </div>
                    </div>

                    <article className="case-section clinical-info-card">
                        <div className="case-section-title">
                            <span>01</span>
                            <h3>História clínica</h3>
                        </div>
                        <p>{caso.historia_clinica}</p>
                    </article>

                    <article className="case-section clinical-info-card">
                        <div className="case-section-title">
                            <span>02</span>
                            <h3>Exame físico</h3>
                        </div>
                        <p>{caso.exame_fisico}</p>
                    </article>

                    <article className={`case-section clinical-info-card exam-results-card ${examResults.length ? 'has-results' : ''}`}>
                        <div className="case-section-title">
                            <span>03</span>
                            <div>
                                <h3>Resultados liberados</h3>
                                <small>{examResults.length} exame(s) disponível(is)</small>
                            </div>
                        </div>
                        {examResults.length > 0 ? (
                            <ul className="exam-results-list">
                                {examResults.map((result) => (
                                    <li key={result.id}>
                                        <FiCheckCircle aria-hidden="true" />
                                        <div><strong>{result.nome}</strong><p>{result.resultado}</p></div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="results-empty-state">
                                <FiClipboard aria-hidden="true" />
                                <p>Os resultados aparecerão aqui após você selecionar e solicitar os exames.</p>
                            </div>
                        )}
                    </article>
                </section>

                <section className="action-panel decision-panel" aria-label="Painel de decisões clínicas">
                    <div className="decision-panel-header">
                        <div>
                            <span className="panel-eyebrow">Sua tomada de decisão</span>
                            <h2>Construa o raciocínio</h2>
                        </div>
                        <span className="active-step-count">Etapa {activeStepIndex + 1} de 3</span>
                    </div>

                    <div className="clinical-stepper" role="tablist" aria-label="Etapas da simulação">
                        {workflowSteps.map((step, index) => {
                            const StepIcon = step.icon;
                            const isActive = activeTab === step.id;
                            return (
                                <button
                                    key={step.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={isActive}
                                    aria-controls={`simulation-panel-${step.id}`}
                                    onClick={() => setActiveTab(step.id)}
                                    className={`clinical-step ${isActive ? 'active' : ''} ${stepStatus[step.id] ? 'complete' : ''}`}
                                >
                                    <span className="step-icon">
                                        {stepStatus[step.id] ? <FiCheck aria-hidden="true" /> : <StepIcon aria-hidden="true" />}
                                    </span>
                                    <span className="step-copy"><strong>{step.label}</strong><small>{step.description}</small></span>
                                    {index < workflowSteps.length - 1 && <span className="step-connector" aria-hidden="true" />}
                                </button>
                            );
                        })}
                    </div>

                    <div className="decision-content-shell">
                        {activeTab === 'exames' && (
                            <div className="tab-content clinical-tab-content" id="simulation-panel-exames" role="tabpanel">
                                <div className="decision-content-heading">
                                    <div>
                                        <span className="content-kicker">Investigação diagnóstica</span>
                                        <h3>Quais exames são realmente necessários?</h3>
                                        <p>Selecione apenas o que pode mudar sua hipótese ou conduta.</p>
                                    </div>
                                    <span className="selection-counter">{selectedExamCount} selecionado(s)</span>
                                </div>

                                <div className="clinical-tip">
                                    <FiAlertCircle aria-hidden="true" />
                                    <p>Exames de baixo valor também entram na avaliação final. Priorize custo-benefício e segurança.</p>
                                </div>

                                <div className="exam-grid">
                                    {caso.exames_disponiveis.map((exam) => {
                                        const isSelected = Boolean(selectedExams[exam.id]);
                                        return (
                                            <label key={exam.id} className={`exam-option-card ${isSelected ? 'selected' : ''}`}>
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => handleExamSelection(exam.id)}
                                                />
                                                <span className="exam-checkbox" aria-hidden="true">{isSelected && <FiCheck />}</span>
                                                <span className="exam-option-name">{exam.nome}</span>
                                            </label>
                                        );
                                    })}
                                </div>

                                <button type="button" onClick={handleShowResults} className="results-button">
                                    <FiClipboard aria-hidden="true" />
                                    Liberar resultados dos exames
                                    <span>{selectedExamCount}</span>
                                </button>
                                {statusMessage && <p className="simulation-status" role="status">{statusMessage}</p>}
                            </div>
                        )}

                        {activeTab === 'hipotese' && (
                            <ClinicalTextEditor
                                id="hipotese"
                                kicker="Síntese diagnóstica"
                                title="Qual é a sua principal hipótese?"
                                description="Organize a hipótese principal, os diferenciais relevantes e os dados que apoiam sua escolha."
                                value={hipotese}
                                onChange={setHipotese}
                                placeholder="Ex.: Minha principal hipótese é... Os principais diagnósticos diferenciais são..."
                                guideItems={editorGuides.hipotese}
                            />
                        )}

                        {activeTab === 'conduta' && (
                            <ClinicalTextEditor
                                id="conduta"
                                kicker="Plano terapêutico"
                                title="Qual será sua conduta inicial?"
                                description="Descreva prioridades, tratamento, monitorização e o momento da reavaliação."
                                value={conduta}
                                onChange={setConduta}
                                placeholder="Ex.: Inicialmente, estabilizaria o paciente e adotaria as seguintes medidas..."
                                guideItems={editorGuides.conduta}
                            />
                        )}
                    </div>

                    <div className="decision-navigation">
                        <button
                            type="button"
                            className="step-navigation-button back"
                            onClick={() => moveToStep(-1)}
                            disabled={activeStepIndex === 0}
                        >
                            <FiChevronLeft aria-hidden="true" /> Voltar
                        </button>
                        {activeStepIndex < workflowSteps.length - 1 ? (
                            <button type="button" className="step-navigation-button next" onClick={() => moveToStep(1)}>
                                Próxima etapa <FiChevronRight aria-hidden="true" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className={`btn-submit clinical-submit ${!caso.avaliacao_2_disponivel ? 'is-unavailable' : ''}`}
                                disabled={isSubmitting || !caso.avaliacao_2_disponivel}
                            >
                                <FiCheckCircle aria-hidden="true" />
                                {caso.avaliacao_2_disponivel ? 'Finalizar e receber feedback' : 'Avaliação em revisão clínica'}
                            </button>
                        )}
                    </div>

                    {submissionError && <p className="simulation-error" role="alert">{submissionError}</p>}
                    {caso.avaliacao_2_disponivel ? (
                        <p className="evaluation-note">Seu raciocínio será comparado ao gabarito clínico revisado deste caso.</p>
                    ) : (
                        <p className="evaluation-note evaluation-note-pending">
                            Você pode explorar o caso, mas a finalização será liberada após a revisão da rubrica clínica.
                        </p>
                    )}
                </section>
            </div>
        </div>
    );
};

const ClinicalTextEditor = ({ id, kicker, title, description, value, onChange, placeholder, guideItems }) => (
    <div className="tab-content clinical-tab-content clinical-editor" id={`simulation-panel-${id}`} role="tabpanel">
        <div className="decision-content-heading">
            <div>
                <span className="content-kicker">{kicker}</span>
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
            <span className={`draft-status ${value.trim() ? 'has-content' : ''}`}>
                {value.trim() ? <><FiCheckCircle aria-hidden="true" /> Preenchido</> : <><FiEdit3 aria-hidden="true" /> Em branco</>}
            </span>
        </div>
        <div className="editor-guide" aria-label="Sugestão de estrutura">
            {guideItems.map((item, index) => <span key={item}><b>{index + 1}</b>{item}</span>)}
        </div>
        <div className="clinical-editor-field">
            <textarea
                aria-label={title}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                rows="11"
                className="transcription-box"
                placeholder={placeholder}
            />
            <span className="character-counter">{value.length} caracteres</span>
        </div>
    </div>
);

export default SimulacaoCaso;
