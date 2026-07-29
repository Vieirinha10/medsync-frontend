import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

const CadastroPage = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleCadastro = async (event) => {
        event.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            await api.registerUser({ nome, email, password });
            navigate('/login', {
                replace: true,
                state: { message: 'Cadastro realizado. Entre com sua nova conta.' },
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-container">
            <h1>Crie sua conta</h1>
            <p>Comece a treinar com casos clínicos reais hoje mesmo.</p>
            <form onSubmit={handleCadastro}>
                <div className="form-group">
                    <label htmlFor="name">Nome Completo</label>
                    <input type="text" id="name" value={nome} onChange={(e) => setNome(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="email_reg">Email</label>
                    <input type="email" id="email_reg" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="password_reg">Senha</label>
                    <input type="password" id="password_reg" value={password} onChange={(e) => setPassword(e.target.value)} minLength="8" maxLength="72" required />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="btn-submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Criando conta...' : 'Criar minha conta'}
                </button>
                <div className="auth-link">
                    <span>Já tem uma conta? <Link to="/login">Faça login</Link></span>
                </div>
            </form>
        </div>
    );
};

export default CadastroPage;
