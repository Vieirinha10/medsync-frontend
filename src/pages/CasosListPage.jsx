// Arquivo: src/pages/CasosListPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CasosListPage = () => {
    const [casos, setCasos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/casos-clinicos/')
            .then(res => res.json()).then(data => {
                setCasos(data);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) return <div>Carregando...</div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Explore Nossos Casos Clínicos</h1>
                <p>Selecione uma especialidade e comece a aprimorar seu raciocínio clínico agora mesmo.</p>
            </div>

            <div className="toolbar">
                <input type="search" placeholder="Buscar por palavra-chave..." />
                <select>
                    <option>Toda as Especialidades</option>
                    <option>Cardiologia</option>
                    <option>Pneumologia</option>
                </select>
                <select>
                    <option>Toda as Dificuldades</option>
                    <option>Fácil</option>
                    <option>Intermediário</option>
                </select>
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
                
                <div className="cta-card">
                    <h3>Desbloqueie todos os casos</h3>
                    <p>Tenha acesso ilimitado a centenas de casos clinicos com o plano Premium.</p>
                    <Link to="/assinatura" className="plan-button">Conheça os Planos</Link>
                </div>
            </div>
        </div>
    );
};

export default CasosListPage;