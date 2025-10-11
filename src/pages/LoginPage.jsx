// Arquivo: src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
    // Memória para o email e senha
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Para redirecionar o usuário

    const handleLogin = async (event) => {
        event.preventDefault();
        setError(null);

        try {
            const response = await fetch('http://127.0.0.1:8000/usuarios/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Falha ao fazer login.');
            }

            // Se o login deu certo, o back-end nos envia o token
            const data = await response.json();

            // AQUI ESTÁ A NOVIDADE: Guardamos o token!
            // O localStorage é um "porta-malas" do navegador, onde podemos guardar informações.
            localStorage.setItem('authToken', data.access_token);
            
            console.log("Login bem-sucedido! Token salvo:", data.access_token);
            alert('Login realizado com sucesso!');
            
            // Redireciona o usuário para o seu painel
            navigate('/dashboard');

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-container">
            <h1>Bem-vindo(a) de volta!</h1>
            <p>Acesse sua conta para continuar seu progresso.</p>
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label htmlFor="email_login">Email</label>
                    <input 
                        type="email" 
                        id="email_login"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password_login">Senha</label>
                    <input 
                        type="password" 
                        id="password_login" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="btn-submit">Entrar</button>
                <div className="auth-link">
                    <span>Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link></span>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;