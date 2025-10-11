import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const DashboardPage = () => {
    const [progresso, setProgresso] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('authToken'); // Pega o "crachá"

        fetch(`${API_URL}/progresso/meu`, {
            // AQUI ESTÁ A CORREÇÃO:
            // Adicionamos o cabeçalho de autorização para "mostrar o crachá"
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setProgresso(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Erro ao buscar progresso:", error);
                setIsLoading(false);
            });
    }, []);
    
    // Calcula algumas estatísticas simples
    const totalCasos = progresso.length;
    const pontuacaoMedia = totalCasos > 0 
        ? (progresso.reduce((acc, p) => acc + p.pontuacao, 0) / totalCasos).toFixed(0)
        : 0;

    if (isLoading) return <div className="page-container">Carregando seu progresso...</div>;

    return (
        <div className="page-container">
            <div className="dashboard-header">
              <h1>Bem-vindo(a) de volta!</h1>
              <p>Continue seu progresso e se torne um profissional ainda mais preparado.</p>
            </div>
            
            <div className="dashboard-grid">
                <div className="dashboard-card span-2">
                    <h3>Resumo de Desempenho</h3>
                    <div className="stats-container">
                        <div className="stat">
                            <div className="value">{totalCasos}</div>
                            <div className="label">Casos Concluídos</div>
                        </div>
                        <div className="stat">
                            <div className="value">{pontuacaoMedia}%</div>
                            <div className="label">Pontuação Média</div>
                        </div>
                        <div className="stat">
                            <div className="value">0</div>
                            <div className="label">Dias de Sequência</div>
                        </div>
                    </div>
                </div>

                <div className="dashboard-card">
                    <h3>Continue de Onde Parou</h3>
                    <p className="case-title">Navegue pelos casos clínicos e comece um novo desafio.</p>
                    <Link to="/casos" className="resume-button">Ver Casos →</Link>
                </div>

                <div className="dashboard-card span-2">
                    <h3>Progresso por Especialidade</h3>
                    <div className="chart-container">
                        <div className="chart-bar" style={{ height: '80%' }}><span className="label">Cardio</span></div>
                        <div className="chart-bar" style={{ height: '60%' }}><span className="label">Pneumo</span></div>
                        <div className="chart-bar" style={{ height: '45%' }}><span className="label">Neuro</span></div>
                        <div className="chart-bar" style={{ height: '70%' }}><span className="label">Endócrino</span></div>
                        <div className="chart-bar" style={{ height: '30%' }}><span className="label">Nefro</span></div>
                    </div>
                </div>

                <div className="dashboard-card">
                    <h3>Conquistas Recentes</h3>
                    <div className="achievements-container">
                        <span>🏆</span> <span>🧠</span> <span>🔥</span> <span>🤓</span>
                    </div>
                </div>

                <div className="dashboard-card">
                    <h3>Recomendações para Você</h3>
                    <ul className="recommendation-list">
                        <li><a href="#">Revisar: Manejo de IAM com supra de ST</a></li>
                        <li><a href="#">Praticar: Caso de embolia pulmonar</a></li>
                        <li><a href="#">Explorar: Introdução à Nefrologia</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;