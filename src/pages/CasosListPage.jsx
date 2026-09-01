import React, { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/simulation-v2.css';
import '../styles/challenge-cards.css';
import '../styles/clinical-cards.css';
import {
    FiActivity,
    FiArrowRight,
    FiBarChart2,
    FiCheckCircle,
    FiStar,
} from 'react-icons/fi';
import { api, ApiError } from '../services/api';

const CasosListPage = () => {
    const [casos, setCasos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [difficulty, setDifficulty] = useState('');
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

    const specialties = useMemo(
        () => [...new Set(casos.map(caso => caso.especialidade))].sort(),
        [casos]
    );
    const difficulties = useMemo(
        () => [...new Set(casos.map(caso => caso.nivel_dificuldade))].sort(),
        [casos]
    );
    const filteredCases = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLocaleLowerCase('pt-BR');
        return casos.filter(caso => {
            const matchesSearch = !normalizedSearch
                || `${caso.titulo} ${caso.especialidade}`
                    .toLocaleLowerCase('pt-BR')
                    .includes(normalizedSearch);
            return matchesSearch
                && (!specialty || caso.especialidade === specialty)
                && (!difficulty || caso.nivel_dificuldade === difficulty);
        });
    }, [casos, difficulty, searchTerm, specialty]);

    if (isLoading) return <div className="page-container">A carregar os casos clínicos...</div>;
    if (error) return <div className="page-container">Erro ao carregar os casos: {error}</div>;

    return (
        <div className="page-container clinical-cases-page">
            <div className="page-header">
                <h1>Explore os Nossos Casos Clínicos</h1>
                <p>Selecione um caso abaixo para iniciar a simulação e testar os seus conhecimentos.</p>
            </div>
            
            <div className="toolbar">
                <input
                    type="search"
                    placeholder="Buscar por título ou especialidade..."
                    aria-label="Buscar casos"
                    value={searchTerm}
                    onChange={event => setSearchTerm(event.target.value)}
                />
                <select
                    aria-label="Filtrar por especialidade"
                    value={specialty}
                    onChange={event => setSpecialty(event.target.value)}
                >
                    <option value="">Todas as Especialidades</option>
                    {specialties.map(item => <option key={item} value={item}>{item}</option>)}
                </select>
                <select
                    aria-label="Filtrar por dificuldade"
                    value={difficulty}
                    onChange={event => setDifficulty(event.target.value)}
                >
                    <option value="">Todas as Dificuldades</option>
                    {difficulties.map(item => <option key={item} value={item}>{item}</option>)}
                </select>
            </div>

            <p className="case-results-summary" role="status">
                {filteredCases.length} de {casos.length} casos encontrados
            </p>
            
            <div className="casos-grid">
                {filteredCases.map(caso => {
                    const isPremium = caso.premium ?? caso.nivel_dificuldade === 'Difícil';
                    const difficultyClass = caso.nivel_dificuldade
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .toLocaleLowerCase('pt-BR');
                    return (
                    <Link
                        to={`/casos/${caso.id}`}
                        key={caso.id}
                        className={`caso-card clinical-case-card${isPremium ? ' is-premium' : ''}`}
                    >
                        <span className="clinical-card-orbit" aria-hidden="true" />
                        <div className="card-content">
                            <div className="clinical-card-topline">
                                <span className="clinical-case-number">CASO {String(caso.id).padStart(2, '0')}</span>
                                {isPremium && <span className="premium-tag"><FiStar /> Premium</span>}
                            </div>
                            <div className="case-card-kickers">
                                <span className="specialty"><FiActivity /> {caso.especialidade}</span>
                                {caso.avaliacao_2_disponivel && (
                                    <span className="agent-feedback-tag"><FiCheckCircle /> Feedback estruturado</span>
                                )}
                                {!caso.avaliacao_2_disponivel && (
                                    <span className="review-status-tag">Rubrica em revisão</span>
                                )}
                            </div>
                            <h3>{caso.titulo}</h3>
                            <p className="clinical-card-invitation">Analise o cenário, solicite avaliações e exames e defina a melhor conduta.</p>
                            <div className="card-footer">
                                <span className={`clinical-difficulty difficulty-${difficultyClass}`}>
                                    <FiBarChart2 />
                                    <span>Dificuldade</span>
                                    <strong>{caso.nivel_dificuldade}</strong>
                                </span>
                                <span className="clinical-card-start">Iniciar caso <FiArrowRight /></span>
                            </div>
                        </div>
                    </Link>
                    );
                })}
            </div>
            {filteredCases.length === 0 && (
                <div className="case-empty-state">
                    <h2>Nenhum caso encontrado</h2>
                    <p>Tente remover algum filtro ou buscar por outro termo.</p>
                </div>
            )}
        </div>
    );
};

export default CasosListPage;
