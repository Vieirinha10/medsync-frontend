import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, ApiError } from '../services/api';

const CasosListPage = () => {
    const [casos, setCasos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        api.getCases()
        .then(data => {
            setCasos(data);
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
    }, [navigate]);

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
