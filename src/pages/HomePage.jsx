// Arquivo: src/pages/HomePage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import {
    FiActivity,
    FiArrowRight,
    FiBarChart2,
    FiBookOpen,
    FiCheck,
    FiCheckCircle,
    FiClock,
    FiCompass,
    FiFileText,
    FiLayers,
    FiTarget,
    FiUsers,
} from 'react-icons/fi';

const HomePage = () => {
    return (
        <div className="home-container">
            <section className="home-hero">
                <div className="hero-copy">
                    <span className="eyebrow">
                        <FiActivity aria-hidden="true" />
                        Simulação clínica para estudantes de medicina
                    </span>
                    <h1>
                        Do caso à conduta:
                        <span> treine seu raciocínio clínico.</span>
                    </h1>
                    <p className="subtitle">
                        Pratique decisões médicas em casos interativos, solicite exames,
                        construa hipóteses e acompanhe sua evolução em um só lugar.
                    </p>
                    <div className="hero-actions">
                        <Link to="/cadastro" className="cta-button">
                            Começar gratuitamente
                            <FiArrowRight aria-hidden="true" />
                        </Link>
                        <Link to="/casos" className="secondary-link">
                            Explorar casos
                        </Link>
                    </div>
                    <div className="hero-proof" aria-label="Destaques da plataforma">
                        <span><FiCheckCircle /> 40 casos disponíveis</span>
                        <span><FiCheckCircle /> Progresso individual</span>
                    </div>
                </div>

                <div className="clinical-preview" aria-label="Prévia de um caso clínico">
                    <div className="preview-topbar">
                        <span />
                        <span />
                        <span />
                        <small>Simulação em andamento</small>
                    </div>
                    <div className="preview-patient">
                        <div className="patient-icon"><FiActivity /></div>
                        <div>
                            <span className="preview-label">CASO 01 · CARDIOLOGIA</span>
                            <h2>Dor torácica em adulto jovem</h2>
                        </div>
                    </div>
                    <div className="patient-data">
                        <span><strong>32</strong> anos</span>
                        <span><strong>7</strong> dias</span>
                        <span><strong>15</strong> min</span>
                    </div>
                    <div className="clinical-step">
                        <span className="step-icon"><FiFileText /></span>
                        <div>
                            <strong>História clínica analisada</strong>
                            <small>Agora selecione os exames necessários.</small>
                        </div>
                        <FiCheckCircle className="step-status" />
                    </div>
                    <div className="clinical-decision">
                        <div>
                            <span>Próxima decisão</span>
                            <strong>Solicitar exames</strong>
                        </div>
                        <button type="button" aria-label="Avançar na demonstração">
                            <FiArrowRight />
                        </button>
                    </div>
                </div>
            </section>

            <section className="features-section">
                <div className="section-heading">
                    <span className="eyebrow">APRENDIZADO ATIVO</span>
                    <h2>Mais prática, menos estudo passivo</h2>
                    <p>Uma jornada organizada para transformar conteúdo em decisão clínica.</p>
                </div>
                <div className="features-grid">
                    <div className="feature-card">
                        <span className="feature-icon"><FiActivity /></span>
                        <h3>Casos interativos</h3>
                        <p>Enfrente situações clínicas estruturadas e avance tomando decisões.</p>
                    </div>
                    <div className="feature-card">
                        <span className="feature-icon"><FiTarget /></span>
                        <h3>Raciocínio por etapas</h3>
                        <p>Solicite exames, organize hipóteses e proponha uma conduta inicial.</p>
                    </div>
                    <div className="feature-card">
                        <span className="feature-icon"><FiBarChart2 /></span>
                        <h3>Evolução visível</h3>
                        <p>Acompanhe casos concluídos e seu histórico de desempenho no painel.</p>
                    </div>
                    <div className="feature-card">
                        <span className="feature-icon"><FiLayers /></span>
                        <h3>Várias especialidades</h3>
                        <p>Pratique cardiologia, neurologia, cirurgia, urgência e muito mais.</p>
                    </div>
                </div>
            </section>

            <section className="how-it-works-section">
                <div className="section-heading">
                    <span className="eyebrow">COMO FUNCIONA</span>
                    <h2>Uma consulta simulada, passo a passo</h2>
                </div>
                <div className="steps-container">
                    <div className="step">
                        <div className="step-number"><FiCompass /></div>
                        <span>01</span>
                        <h3>Escolha o caso</h3>
                        <p>Filtre por especialidade e dificuldade para iniciar seu treino.</p>
                    </div>
                    <div className="step">
                        <div className="step-number"><FiBookOpen /></div>
                        <span>02</span>
                        <h3>Analise e decida</h3>
                        <p>Leia o caso, solicite exames e registre seu raciocínio clínico.</p>
                    </div>
                    <div className="step">
                        <div className="step-number"><FiBarChart2 /></div>
                        <span>03</span>
                        <h3>Acompanhe a evolução</h3>
                        <p>Conclua o desafio e consulte seu progresso no painel pessoal.</p>
                    </div>
                </div>
            </section>

            <section className="plans-section">
                <div className="section-heading">
                    <span className="eyebrow">PLANOS</span>
                    <h2>Comece hoje. Evolua no seu ritmo.</h2>
                    <p>Experimente gratuitamente e avance para o Premium quando quiser.</p>
                </div>
                <div className="plans-container">
                    <div className="plan-card">
                        <span className="plan-kicker">Para começar</span>
                        <h3>Gratuito</h3>
                        <div className="price">R$0</div>
                        <ul>
                            <li><FiCheck /> 5 casos clínicos por mês</li>
                            <li><FiCheck /> Acesso ao painel pessoal</li>
                            <li><FiCheck /> Histórico de desempenho</li>
                        </ul>
                        <Link to="/cadastro" className="plan-button">Criar conta grátis</Link>
                    </div>
                    <div className="plan-card premium">
                        <span className="popular-badge">Mais completo</span>
                        <span className="plan-kicker">Para ir além</span>
                        <h3>Premium</h3>
                        <div className="price">R$9,90<small>/mês</small></div>
                        <ul>
                            <li><FiCheck /> Casos clínicos ilimitados</li>
                            <li><FiCheck /> Todas as especialidades</li>
                            <li><FiCheck /> Análises avançadas</li>
                        </ul>
                        <Link to="/assinatura" className="plan-button">Conhecer o Premium</Link>
                    </div>
                </div>
            </section>

            <section className="final-cta">
                <div>
                    <span className="eyebrow"><FiUsers /> PARA QUEM VIVE A MEDICINA</span>
                    <h2>Seu próximo caso começa agora.</h2>
                    <p>Crie sua conta gratuita e transforme revisão em prática clínica.</p>
                </div>
                <Link to="/cadastro" className="cta-button">
                    Começar agora
                    <FiArrowRight />
                </Link>
            </section>
        </div>
    );
};

export default HomePage;
