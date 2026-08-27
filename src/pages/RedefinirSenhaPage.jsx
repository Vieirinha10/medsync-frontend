import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { api, clearAuthToken } from '../services/api';

const RedefinirSenhaPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(token ? '' : 'O link de recuperação é inválido ou está incompleto.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (password !== confirmation) {
      setError('As senhas não coincidem.');
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await api.resetPassword(token, password);
      clearAuthToken();
      setMessage(result.message);
      setPassword('');
      setConfirmation('');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <h1>Crie uma nova senha</h1>
      <p>Use pelo menos 8 caracteres. O link só pode ser utilizado uma vez.</p>
      {message ? (
        <>
          <p className="success-message" role="status">{message}</p>
          <Link className="btn-submit auth-action-link" to="/login">Entrar na MedSync</Link>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="new_password">Nova senha</label>
            <input
              id="new_password"
              type="password"
              autoComplete="new-password"
              minLength="8"
              maxLength="72"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              disabled={!token}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password_confirmation">Confirme a nova senha</label>
            <input
              id="password_confirmation"
              type="password"
              autoComplete="new-password"
              minLength="8"
              maxLength="72"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              required
              disabled={!token}
            />
          </div>
          {error && <p className="error-message" role="alert">{error}</p>}
          <button type="submit" className="btn-submit" disabled={isSubmitting || !token}>
            {isSubmitting ? 'Salvando...' : 'Salvar nova senha'}
          </button>
          <div className="auth-link"><Link to="/recuperar-senha">Solicitar outro link</Link></div>
        </form>
      )}
    </div>
  );
};

export default RedefinirSenhaPage;
