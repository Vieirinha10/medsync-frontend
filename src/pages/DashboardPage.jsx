import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Define a URL da API, usando a variável de ambiente ou o endereço local como padrão
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const DashboardPage = () => {
    const [progresso, setProgresso] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Busca os dados do histórico de progresso no endpoint correto
        fetch(`${API_URL}/progresso/meu`, { // Usa a variável API_URL
            headers: {
                // Em uma aplicação real, enviaríamos o token de autenticação aqui
                // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`
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
            {/* O restante do layout do dashboard que já tínhamos */}
            <div className="dashboard-grid">
              {/* Cards de estatísticas, etc. */}
            </div>
        </div>
    );
};

export default DashboardPage;
