import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SimulacaoCaso = () => {
    const { casoId } = useParams(); // Pega o ID do caso da URL
    const navigate = useNavigate();

    // Memória do componente
    const [caso, setCaso] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('exames'); // Aba ativa
    
    // Memória para as respostas do usuário
    const [selectedExams, setSelectedExams] = useState({}); // Exames selecionados
    const [examResults, setExamResults] = useState([]); // Resultados para mostrar
    const [hipotese, setHipotese] = useState(''); // Texto da hipótese
    const [conduta, setConduta] = useState(''); // Texto da conduta

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/casos-clinicos/${casoId}`)
            .then(res => res.json())
            .then(data => {
                setCaso(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Erro ao carregar o caso:", error);
                setIsLoading(false);
            });
    }, [casoId]);

    const handleExamSelection = (examId) => {
        setSelectedExams(prev => ({ ...prev, [examId]: !prev[examId] }));
    };

    const handleShowResults = () => {
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
        
        // Lógica de envio para o back-end (POST /progresso/registrar)
        console.log("Enviando para a API:", respostas_usuario);
        alert("Respostas enviadas! No futuro, a IA irá analisar e dar o feedback aqui.");
        // Redireciona para o dashboard após a submissão
        navigate('/dashboard'); 
    };

    if (isLoading) return <div className="page-container">Carregando caso clínico...</div>;
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
                        <h4>Selecione os exames que deseja solicitar:</h4>
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
                        <h4>Descreva sua hipótese principal e os diagnósticos diferenciais:</h4>
                        <textarea value={hipotese} onChange={(e) => setHipotese(e.target.value)} rows="10"></textarea>
                    </div>
                )}
                
                {activeTab === 'conduta' && (
                    <div className="tab-content">
                        <h4>Descreva a conduta inicial para este paciente:</h4>
                        <textarea value={conduta} onChange={(e) => setConduta(e.target.value)} rows="10"></textarea>
                    </div>
                )}

                <button onClick={handleSubmit} className="btn-submit">Finalizar e Submeter Respostas</button>
            </div>
        </div>
    );
};

export default SimulacaoCaso;