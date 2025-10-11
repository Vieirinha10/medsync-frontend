// Arquivo: src/pages/CadastroPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirecionar o usuário

const CadastroPage = () => {
    // "Memória" para guardar o que o usuário digita
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Ferramenta para navegar entre páginas

    // Função chamada quando o formulário é enviado
    const handleCadastro = async (event) => {
        event.preventDefault(); // Previne o recarregamento padrão da página
        setError(null); // Limpa erros antigos

        const userData = { nome, email, password };

        try {
            const response = await fetch('http://127.0.0.1:8000/usuarios/registrar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Falha ao cadastrar.');
            }

            // Se o cadastro deu certo...
            alert('Cadastro realizado com sucesso! Você será redirecionado para o login.');
            navigate('/login'); // Redireciona o usuário para a página de login

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
                    <input 
                        type="text" 
                        id="name" 
                        value={nome} 
                        onChange={(e) => setNome(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email_reg">Email</label>
                    <input 
                        type="email" 
                        id="email_reg" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password_reg">Senha</label>
                    <input 
                        type="password" 
                        id="password_reg" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="btn-submit">Criar minha conta</button>
            </form>
        </div>
    );
};

export default CadastroPage;