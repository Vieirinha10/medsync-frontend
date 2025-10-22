import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const CasosListPage = () => {
    // Memória para guardar a lista COMPLETA de casos
    const [allCasos, setAllCasos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- NOVOS ESTADOS PARA OS FILTROS ---
    const [searchTerm, setSearchTerm] = useState('');
    const [specialtyFilter, setSpecialtyFilter] = useState('Todas');
    const [difficultyFilter, setDifficultyFilter] = useState('Todas');

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        fetch(`${API_URL}/casos-clinicos/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => response.json())
        .then(data => {
            setAllCasos(data); // Guarda a lista completa
            setIsLoading(false);
        })
        .catch(error => {
            setError(error.message);
            setIsLoading(false);
        });
    }, []);

    // --- LÓGICA DE FILTRAGEM ---
    const filteredCasos = allCasos.filter(caso => {
        // Filtro por termo de busca (no título)
        const matchesSearchTerm = caso.titulo.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Filtro por especialidade
        const matchesSpecialty = specialtyFilter === 'Todas' || caso.especialidade === specialtyFilter;
        
        // Filtro por dificuldade
        const matchesDifficulty = difficultyFilter === 'Todas' || caso.nivel_dificuldade === difficultyFilter;

        return matchesSearchTerm && matchesSpecialty && matchesDifficulty;
    });

    if (isLoading) return <div className="page-container">A carregar os casos clínicos...</div>;
    if (error) return <div className="page-container">Erro ao carregar os casos: {error}</div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Explore os Nossos Casos Clínicos</h1>
                <p>Selecione um caso abaixo para iniciar a simulação e testar os seus conhecimentos.</p>
            </div>
            
            <div className="toolbar">
                <input 
                    type="search" 
                    placeholder="Buscar por palavra-chave..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select 
                    value={specialtyFilter}
                    onChange={(e) => setSpecialtyFilter(e.target.value)}
                >
                    <option value="Todas">Todas as Especialidades</option>
                    <option value="Cardiologia">Cardiologia</option>
                    <option value="Neurologia">Neurologia</option>
                    <option value="Cirurgia">Cirurgia</option>
                    <option value="Clínica Médica">Clínica Médica</option>
                    <option value="Dermatologia">Dermatologia</option>
                    <option value="Endocrinologia">Endocrinologia</option>
                    <option value="Gastroenterologia">Gastroenterologia</option>
                    <option value="Ginecologia">Ginecologia</option>
                    <option value="Infectologia">Infectologia</option>
                    <option value="Nutrologia">Nutrologia</option>
                    <option value="Otorrinolaringologia">Otorrinolaringologia</option>
                    <option value="Pediatria">Pediatria</option>
                    <option value="Urgência e Emergência">Urgência e Emergência</option>
                    <option value="Urologia">Urologia</option>
                </select>
                <select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                >
                    <option value="Todas">Todas as Dificuldades</option>
                    <option value="Fácil">Fácil</option>
                    <option value="Intermediário">Intermediário</option>
                    <option value="Difícil">Difícil</option>
                    <option value="Crítico">Crítico</option>
                </select>
            </div>
            
            <div className="casos-grid">
                {/* Mostra a lista JÁ FILTRADA */}
                {filteredCasos.length > 0 ? (
                    filteredCasos.map(caso => (
                        <Link to={`/casos/${caso.id}`} key={caso.id} className="caso-card">
                            {/* ... (código do card como estava antes) ... */}
                        </Link>
                    ))
                ) : (
                    <p>Nenhum caso clínico encontrado com os filtros selecionados.</p>
                )}
            </div>
        </div>
    );
};

export default CasosListPage;

