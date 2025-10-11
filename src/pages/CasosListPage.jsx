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

    // ... (o resto do código visual do componente permanece o mesmo)
    // Se isLoading for verdadeiro, pode mostrar o skeleton loader aqui.
    // ...
};

export default CasosListPage;

