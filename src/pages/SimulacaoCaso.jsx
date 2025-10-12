import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const SimulacaoCaso = () => {
    const { casoId } = useParams(); // Pega o ID do caso da URL
    const navigate = useNavigate();

    const [caso, setCaso] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('exames');
    
    const [selectedExams, setSelectedExams] = useState({});
    const [examResults, setExamResults] = useState([]);
    const [hipotese, setHipotese] = useState('');
    const [conduta, setConduta] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('authToken'); // Pega o "crachá"

        fetch(`${API_URL}/casos-clinicos/${casoId}`, {
            // AQUI ESTÁ A CORREÇÃO:
            // Adicionamos o cabeçalho de autorização para "mostrar o crachá"
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Falha ao carregar o caso clínico.');
            }
            return res.json();
        })
        .then(data => {
            setCaso(data);
            setIsLoading(false);
        })
        .catch(error => {
            console.error("Erro ao carregar o caso:", error);
            setIsLoading(false);
        });
    }, [casoId]);

    const handleSubmit = async () => {
        // Lógica para enviar o progresso...
        alert("Respostas submetidas! (Funcionalidade de análise da IA em desenvolvimento)");
        navigate('/dashboard'); 
    };

    if (isLoading) return <div className="page-container">A carregar o caso clínico...</div>;
    if (!caso) return <div className="page-container">Não foi possível carregar o caso. Verifique a sua conexão.</div>;

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
                    <p>(Os resultados dos exames que você solicitar aparecerão aqui)</p>
                </div>
            </div>
            <div className="action-panel">
                <div className="tabs">
                    <button onClick={() => setActiveTab('exames')} className={`tab-button ${activeTab === 'exames' ? 'active' : ''}`}>Solicitar Exames</button>
                    <button onClick={() => setActiveTab('hipotese')} className={`tab-button ${activeTab === 'hipotese' ? 'active' : ''}`}>Hipótese Diagnóstica</button>
                    <button onClick={() => setActiveTab('conduta')} className={`tab-button ${activeTab === 'conduta' ? 'active' : ''}`}>Definir Conduta</button>
                </div>

                {activeTab === 'hipotese' && (
                    <div className="tab-content">
                        <h4>Descreva a sua hipótese principal e os diagnósticos diferenciais:</h4>
                        <textarea value={hipotese} onChange={(e) => setHipotese(e.target.value)} rows="10"></textarea>
                    </div>
                )}
                
                {/* ... (outras abas) ... */}

                <button onClick={handleSubmit} className="btn-submit">Finalizar e Submeter Respostas</button>
            </div>
        </div>
    );
};

export default SimulacaoCaso;