import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const CasosListPage = () => {
    const [casos, setCasos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('authToken'); // Pega o "crachá"

        fetch(`${API_URL}/casos-clinicos/`, {
            // AQUI ESTÁ A CORREÇÃO:
            // Adicionamos o cabeçalho de autorização para "mostrar o crachá"
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                // Se o servidor responder com um erro (ex: 401 Não Autorizado), nós o capturamos.
                throw new Error('Falha ao buscar os casos. Verifique se você está logado.');
            }
            return response.json();
        })
        .then(data => {
            setCasos(data);
            setIsLoading(false);
        })
        .catch(error => {
            setError(error.message);
            setIsLoading(false);
        });
    }, []); // O array vazio [] garante que esta ação só rode uma vez

    if (isLoading) return <div className="page-container">A carregar os casos clínicos...</div>;
    if (error) return <div className="page-container">Erro ao carregar os casos: {error}</div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Explore os Nossos Casos Clínicos</h1>
                <p>Selecione um caso abaixo para iniciar a simulação e testar os seus conhecimentos.</p>
            </div>
            
            <div className="toolbar">
                <input type="search" placeholder="Buscar por palavra-chave..." />
                <select><option>Todas as Especialidades</option></select>
                <select><option>Todas as Dificuldades</option></select>
            </div>
            
            <div className="casos-grid">
                {casos.map(caso => (
                    <Link to={`/casos/${caso.id}`} key={caso.id} className="caso-card">
                        {caso.nivel_dificuldade === 'Difícil' && <div className="premium-tag">Premium</div>}
                        <div className="card-content">
                            <span className="specialty">{caso.especialidade}</span>
                            <h3>{caso.titulo}</h3>
                            <div className="card-footer">
                                <span>Dificuldade: {caso.nivel_dificuldade}</span>
                                <span>Tempo: 15 min</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CasosListPage;