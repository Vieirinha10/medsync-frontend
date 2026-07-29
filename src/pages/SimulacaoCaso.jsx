import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, ApiError } from '../services/api';

const SimulacaoCaso = () => {
    const { casoId } = useParams();
    const navigate = useNavigate();

    const [caso, setCaso] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('exames');
    
    const [selectedExams, setSelectedExams] = useState({});
    const [examResults, setExamResults] = useState([]);
    const [hipotese, setHipotese] = useState('');
    const [conduta, setConduta] = useState('');

    useEffect(() => {
        api.getCase(casoId)
        .then(data => {
            setCaso(data);
            setIsLoading(false);
        })
        .catch(error => {
            if (error instanceof ApiError && error.status === 401) {
                navigate('/login', { replace: true });
                return;
            }
            setError(error.message);
            setIsLoading(false);
        });
    }, [casoId, navigate]);

    const handleExamSelection = (examId) => {
        setSelectedExams(prev => ({ ...prev, [examId]: !prev[examId] }));
    };

    const handleShowResults = () => {
        if (!caso || !caso.exames_disponiveis) return;
        const results = caso.exames_disponiveis.filter(ex => selectedExams[ex.id]);
        setExamResults(results);
        alert(`${results.length} resultado(s) de exame foram liberados!`);
    };

    const handleSubmit = async () => {
        const respostas_usuario = {
            exames_solicitados: Object.keys(selectedExams).filter(id => selectedExams[id]),
            hipotese_diagnostica: hipotese,
            conduta_proposta: conduta
        };

        setIsSubmitting(true);
        try {
            await api.saveProgress({
                id_caso: Number(casoId),
                respostas_usuario,
                pontuacao: 85,
            });
            navigate('/dashboard');
        } catch (error) {
            if (error instanceof ApiError && error.status === 401) {
                navigate('/login', { replace: true });
                return;
            }
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="page-container">A carregar o caso clínico...</div>;
    if (error) return <div className="page-container">Erro: {error}</div>;
    if (!caso) return <div className="page-container">Não foi possível carregar o caso.</div>;

    return (
        <div className="simulation-container page-container">
            <div className="info-panel">
                <div className="case-section">
                    <h3>História Clínica</h3>
                    <p>{caso.historia_clinica}</p>
                </div>
                <div className="case-section">
                    <h3>Exame Físico</h3>
                    <p>{caso.exame_fisico}</p>
                </div>
                <div className="case-section">
                    <h3>Resultados de Exames</h3>
                    {examResults.length > 0 ? (
                        <ul>
                            {examResults.map(res => (
                                <li key={res.id}><strong>{res.nome}:</strong> {res.resultado}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>(Os resultados dos exames que você solicitar aparecerão aqui)</p>
                    )}
                </div>
            </div>
            <div className="action-panel">
                <div className="tabs">
                    <button onClick={() => setActiveTab('exames')} className={`tab-button ${activeTab === 'exames' ? 'active' : ''}`}>Solicitar Exames</button>
                    <button onClick={() => setActiveTab('hipotese')} className={`tab-button ${activeTab === 'hipotese' ? 'active' : ''}`}>Hipótese Diagnóstica</button>
                    <button onClick={() => setActiveTab('conduta')} className={`tab-button ${activeTab === 'conduta' ? 'active' : ''}`}>Definir Conduta</button>
                </div>

                {activeTab === 'exames' && (
                    <div className="tab-content">
                        {/* --- INÍCIO DA MUDANÇA --- */}
                        <div className="tab-title-container">
                            <h4>Selecione os exames que deseja solicitar:</h4>
                            <div className="tooltip-container">
                                <span className="info-icon">ⓘ</span>
                                <div className="tooltip-text">
                                    Lembre-se de solicitar apenas os exames necessários. A solicitação de exames que não estejam relacionados ao raciocínio clínico e ao posterior diagnóstico serão levados em consideração na sua pontuação final.
                                </div>
                            </div>
                        </div>
                        {/* --- FIM DA MUDANÇA --- */}

                        <div className="exam-list">
                            {caso.exames_disponiveis.map(exam => (
                                <label key={exam.id}>
                                    <input type="checkbox" checked={!!selectedExams[exam.id]} onChange={() => handleExamSelection(exam.id)} />
                                    {exam.nome}
                                </label>
                            ))}
                        </div>
                        <button onClick={handleShowResults} className="btn-secondary">Ver Resultados</button>
                    </div>
                )}

                {activeTab === 'hipotese' && (
                    <div className="tab-content">
                        <h4>Descreva a sua hipótese principal e os diagnósticos diferenciais:</h4>
                        {/* ATUALIZAÇÃO: Classe e placeholder adicionados */}
                        <textarea 
                            value={hipotese} 
                            onChange={(e) => setHipotese(e.target.value)} 
                            rows="10"
                            className="transcription-box" /* <--- CLASSE ADICIONADA */
                            placeholder="Digite sua hipótese diagnóstica..."
                        />
                    </div>
                )}
                
                {activeTab === 'conduta' && (
                    <div className="tab-content">
                        <h4>Descreva a conduta inicial para este paciente:</h4>
                        {/* ATUALIZAÇÃO: Classe e placeholder adicionados */}
                        <textarea 
                            value={conduta} 
                            onChange={(e) => setConduta(e.target.value)} 
                            rows="10"
                            className="transcription-box" /* <--- CLASSE ADICIONADA */
                            placeholder="Digite a conduta proposta..."
                        />
                    </div>
                )}

                <button onClick={handleSubmit} className="btn-submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Enviando...' : 'Finalizar e Submeter Respostas'}
                </button>
            </div>
        </div>
    );
};

export default SimulacaoCaso;
