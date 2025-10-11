// Arquivo: src/pages/HomePage.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="home-container">
            {/* Seção Principal (Hero Section) */}
            <section className="hero-section">
                <h1>Raciocínio Clínico que Salva Vidas. Treine com Inteligência Artificial.</h1>
                <p className="subtitle">
                    Junte-se a milhares de estudantes e residentes que estão se preparando para a realidade da prática médica com casos clínicos interativos e feedback em tempo real.
                </p>
                <Link to="/cadastro" className="cta-button">Comece a Treinar de Graça</Link>
            </section>

            {/* Seção de Funcionalidades */}
            <section className="features-section">
                <h2>Uma plataforma completa para o seu aprendizado</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <h3>🧠 Simulador de Casos com IA</h3>
                        <p>Enfrente desafios clinicos realistas e receba feedback instantáneo sobre seu diagnóstico e conduta.</p>
                    </div>
                    <div className="feature-card">
                        <h3>🩸 Banco de Questões</h3>
                        <p>Teste seus conhecimentos com milhares de questões e quizzes interativos por especialidade.</p>
                    </div>
                    <div className="feature-card">
                        <h3>🎓 Aprendizado Guiado</h3>
                        <p>Siga trilhas de estudo personalizadas que a nossa IA adapta com base no seu desempenho.</p>
                    </div>
                    <div className="feature-card">
                        <h3>🧑‍🏫 Conteúdo de Mentores</h3>
                        <p>Aprenda com resumos e casos clínicos criados por médicos e residentes experientes</p>
                    </div>
                </div>
            </section>

            {/* Seção de Como Funciona */}
            <section className="how-it-works-section">
                <h2>Comece a evoluir em 3 passos</h2>
                <div className="steps-container">
                    <div className="step">
                        <div className="step-number">1</div>
                        <h3>Escolha um Caso</h3>
                        <p>Navegue por especialidades e selecione um dos nossos desafios clinicos realistas.</p>
                    </div>
                    <div className="step">
                        <div className="step-number">2</div>
                        <h3>Interaja e Decida</h3>
                        <p>Solicite exames, formule hipóteses e defina a melhor conduta para o seu paciente virtual</p>
                    </div>
                    <div className="step">
                        <div className="step-number">3</div>
                        <h3>Evolua com Feedback</h3>
                        <p>Receba uma análise completa do seu raciocinio e aprenda com explicações detalhadas da IA</p>
                    </div>
                </div>
            </section>

            {/* Seção de Planos */}
            <section className="plans-section">
                <h2>Escolha o plano ideal para você</h2>
                <div className="plans-container">
                    <div className="plan-card">
                        <h3>Gratuito</h3>
                        <div className="price">R$0</div>
                        <ul>
                            <li>✔️ 5 Casos Clinicos/mês</li>
                            <li>✔️ 50 Questões de Quiz</li>
                            <li>✔️ Feedback Básico da IA</li>
                            <li>❌ Conteúdo de Mentores</li>
                        </ul>
                        <Link to="/cadastro" className="plan-button">Começar Agora</Link>
                    </div>
                    <div className="plan-card premium">
                        <h3>Premium</h3>
                        <div className="price">R$9,90<small>/mês</small></div>
                        <ul>
                            <li>✔️ Casos Ilimitados</li>
                            <li>✔️ Quizzes Ilimitados</li>
                            <li>✔️ IA com Análise Avançada</li>
                            <li>✔️ Conteúdo de Mentores</li>
                        </ul>
                        <Link to="/assinatura" className="plan-button">Assinar Premium</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;