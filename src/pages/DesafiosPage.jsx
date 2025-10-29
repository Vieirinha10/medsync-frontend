import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // Ícones para os botões

// --- DADOS DOS DESAFIOS (Substitua pelos seus dados) ---
// Adicione objetos aqui com o caminho da imagem e a pergunta/diagnóstico
const challengesData = [
  {
    id: 1,
    imageSrc: '/images/challenge1.jpg', // Coloque suas imagens na pasta 'public/images/'
    question: 'Qual o diagnóstico provável para esta lesão dermatológica?',
    diagnosis: 'Molusco Contagioso' // Resposta (será usada no futuro)
  },
  {
    id: 2,
    imageSrc: '/images/challenge2.jpg',
    question: 'Qual alteração é visível neste ECG?',
    diagnosis: 'Fibrilação Atrial'
  },
  {
    id: 3,
    imageSrc: '/images/challenge3.jpg',
    question: 'Identifique a estrutura apontada na radiografia de tórax.',
    diagnosis: 'Nódulo Pulmonar Solitário'
  },
  // Adicione mais desafios aqui... (ex: { id: 4, imageSrc: '/images/challenge4.jpg', question: '...' })
];
// ---------------------------------------------------------

const DesafiosPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  // No futuro, podemos adicionar estado para mostrar a resposta:
  // const [showDiagnosis, setShowDiagnosis] = useState(false);

  const nextChallenge = () => {
    // setShowDiagnosis(false); // Esconde a resposta ao avançar
    setCurrentIndex((prevIndex) => (prevIndex + 1) % challengesData.length);
  };

  const prevChallenge = () => {
    // setShowDiagnosis(false);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + challengesData.length) % challengesData.length);
  };

  // Garante que temos um desafio para mostrar, mesmo que a lista esteja vazia inicialmente
  if (challengesData.length === 0) {
    return <div className="page-container"><p>Nenhum desafio disponível no momento.</p></div>;
  }

  const currentChallenge = challengesData[currentIndex];

  return (
    <div className="page-container desafios-container">
      <div className="page-header">
        <h1>Desafios Clínicos Visuais</h1>
        <p>Teste sua capacidade de diagnóstico rápido.</p>
      </div>

      <div className="challenge-card">
        <div className="image-navigation">
          <button onClick={prevChallenge} className="nav-button prev" aria-label="Desafio anterior">
            <FaChevronLeft size={24} />
          </button>

          <div className="challenge-content">
            <div className="image-wrapper">
              {/* Usamos a key para forçar o React a recriar o elemento img,
                  disparando a animação CSS a cada mudança */}
              <img
                key={currentChallenge.id}
                src={currentChallenge.imageSrc}
                alt={`Desafio Clínico ${currentChallenge.id}`}
                className="challenge-image animate-fade-in"
                onError={(e) => { e.target.onerror = null; e.target.src="/images/placeholder.png"}} // Imagem de fallback
              />
            </div>
            <p className="challenge-question">{currentChallenge.question}</p>
            {/* Espaço reservado para mostrar a resposta no futuro
            {showDiagnosis && <p className="challenge-answer">{currentChallenge.diagnosis}</p>}
            <button onClick={() => setShowDiagnosis(true)}>Ver Resposta</button>
            */}
          </div>

          <button onClick={nextChallenge} className="nav-button next" aria-label="Próximo desafio">
            <FaChevronRight size={24} />
          </button>
        </div>
        <div className="challenge-counter">
          {currentIndex + 1} / {challengesData.length}
        </div>
      </div>
    </div>
  );
};

export default DesafiosPage;