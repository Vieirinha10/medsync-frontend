import { useState } from 'react';
import { Link } from 'react-router-dom';

import { api } from '../services/api';

const RecuperarSenhaPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);
    try {
      const result = await api.requestPasswordRecovery(email);
      setMessage(result.message);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <h1>Recupere sua senha</h1>
      <p>Informe o e-mail da sua conta para receber um link temporário.</p>
      {message ? (
        <>
          <p className="success-message" role="status">{message}</p>
          <div className="auth-link"><Link to="/login">Voltar ao login</Link></div>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="recovery_email">E-mail</label>
            <input
              id="recovery_email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          {error && <p className="error-message" role="alert">{error}</p>}
          <button type="submit" className="btn-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Enviar link de recuperação'}
          </button>
          <div className="auth-link"><Link to="/login">Voltar ao login</Link></div>
        </form>
      )}
    </div>
  );
};

export default RecuperarSenhaPage;
