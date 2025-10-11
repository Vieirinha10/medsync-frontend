import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// Define a URL da API, usando a variável de ambiente ou o endereço local como padrão
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const CadastroPage = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleCadastro = async (event) => {
        event.preventDefault();
        setError(null);

        try {
            const response = await fetch(`${API_URL}/usuarios/registrar`, { // Usa a variável API_URL
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Falha ao cadastrar.');
            }

            alert('Cadastro realizado com sucesso! Você será redirecionado para o login.');
            navigate('/login');

        } catch (err) {
            setError(err.message);
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
                    <input type="password" id="password_reg" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="btn-submit">Criar minha conta</button>
                <div className="auth-link">
                    <span>Já tem uma conta? <Link to="/login">Faça login</Link></span>
                </div>
            </form>
        </div>
    );
};

export default CadastroPage;
