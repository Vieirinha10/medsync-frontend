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
                throw new Error('Falha na autenticação ou erro no servidor.');
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
    }, []);

    if (isLoading) return <div className="page-container">Carregando casos clínicos...</div>;
    if (error) return <div className="page-container">Erro ao carregar os casos: {error}</div>;

    // O resto do código visual do componente permanece o mesmo...
    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Explore Nossos Casos Clínicos</h1>
                <p>Selecione um caso abaixo para iniciar a simulação e testar seus conhecimentos.</p>
            </div>
            
            <div className="toolbar">
                <input type="search" placeholder="Buscar por palavra-chave..." />
                <select><option>Toda as Especialidades</option></select>
                <select><option>Toda as Dificuldades</option></select>
            </div>
            
            <div className="casos-grid">
                {casos.map(caso => (
                    <Link to={`/casos/${caso.id}`} key={caso.id} className="caso-card">
                         {/* ... (código do card) ... */}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CasosListPage;
