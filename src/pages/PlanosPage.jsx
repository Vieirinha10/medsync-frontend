import React from 'react';
import { Link } from 'react-router-dom';

const PlanosPage = () => {
  return (
    <div className="page-container">
      <div className="plans-section">
        <h2>Escolha o plano ideal para você</h2>
        <p className="subtitle">Comece de graça ou desbloqueie todo o potencial do MEDSYNC com o plano Premium.</p>
        
        <div className="plans-container">
          <div className="plan-card">
            <h3>Gratuito</h3>
            <div className="price">R$0</div>
            <ul>
              <li>✔️ 5 Casos Clínicos por mês</li>
              <li>✔️ 50 Questões de Quiz</li>
              <li>✔️ Feedback Básico da IA</li>
              <li>❌ Acesso a Conteúdo de Mentores</li>
              <li>❌ Estatísticas de Desempenho Avançadas</li>
            </ul>
            <Link to="/cadastro" className="plan-button">Começar Agora</Link>
          </div>

          <div className="plan-card premium">
            <h3>Premium</h3>
            <div className="price">R$9<small>,90/mês</small></div>
            <ul>
              <li>✔️ Casos Clínicos Ilimitados</li>
              <li>✔️ Quizzes Ilimitados</li>
              <li>✔️ IA com Análise Avançada de Raciocínio</li>
              <li>✔️ Acesso a Conteúdo Exclusivo de Mentores</li>
              <li>✔️ Estatísticas de Desempenho Avançadas</li>
            </ul>
            {/* Este link pode levar para uma página de checkout no futuro */}
            <Link to="/cadastro" className="plan-button">Assinar Premium</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanosPage;