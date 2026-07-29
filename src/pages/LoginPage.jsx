import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { api, setAuthToken } from '../services/api';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const data = await api.login({ email, password });
            setAuthToken(data.access_token);
            navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-container">
            <h1>Bem-vindo(a) de volta!</h1>
            <p>Acesse sua conta para continuar seu progresso.</p>
            <form onSubmit={handleLogin}>
                {location.state?.message && (
                    <p className="success-message">{location.state.message}</p>
                )}
                <div className="form-group">
                    <label htmlFor="email_login">Email</label>
                    <input type="email" id="email_login" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="password_login">Senha</label>
                    <input type="password" id="password_login" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="btn-submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Entrando...' : 'Entrar'}
                </button>
                <div className="auth-link">
                    <span>Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link></span>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;
