import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const CasosListPage = () => {
    const [casos, setCasos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/casos-clinicos/`)
            .then(res => res.json()).then(data => {
                setCasos(data);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) return <div className="page-container">Carregando...</div>;
    // ... (o resto do código do componente permanece o mesmo)
};

export default CasosListPage;