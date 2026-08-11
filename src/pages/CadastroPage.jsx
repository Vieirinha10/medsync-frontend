import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

const COURSE_PERIODS = Array.from({ length: 12 }, (_, index) => index + 1);

const CadastroPage = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [periodoCurso, setPeriodoCurso] = useState('');
    const [faculdade, setFaculdade] = useState('');
    const [password, setPassword] = useState('');
    const [acceptedLegal, setAcceptedLegal] = useState(false);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleCadastro = async (event) => {
        event.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            await api.registerUser({
                nome,
                email,
                periodo_curso: Number(periodoCurso),
                faculdade,
                password,
                aceite_termos: acceptedLegal,
            });
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
        <div className="auth-container registration-container">
            <h1>Crie sua conta</h1>
            <p>Conte um pouco sobre sua jornada acadêmica e comece a treinar com casos clínicos.</p>
            <form onSubmit={handleCadastro}>
                <div className="form-group">
                    <label htmlFor="name">Nome Completo</label>
                    <input type="text" id="name" value={nome} onChange={(e) => setNome(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="email_reg">Email</label>
                    <input type="email" id="email_reg" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="academic-fields">
                    <div className="form-group">
                        <label htmlFor="periodo_curso">Período do curso</label>
                        <select id="periodo_curso" value={periodoCurso} onChange={(e) => setPeriodoCurso(e.target.value)} required>
                            <option value="" disabled>Selecione</option>
                            {COURSE_PERIODS.map((period) => (
                                <option key={period} value={period}>{period}º período</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="faculdade">Faculdade</label>
                        <input type="text" id="faculdade" value={faculdade} onChange={(e) => setFaculdade(e.target.value)} maxLength="180" placeholder="Ex.: UFMA" required />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="password_reg">Senha</label>
                    <input type="password" id="password_reg" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} minLength="8" maxLength="72" required />
                </div>
                <label className="registration-legal-acceptance">
                    <input type="checkbox" checked={acceptedLegal} onChange={(event) => setAcceptedLegal(event.target.checked)} required />
                    <span>Li e aceito os <Link to="/termos" target="_blank">Termos de Uso</Link> e a <Link to="/privacidade" target="_blank">Política de Privacidade</Link>, versão de 11/08/2026.</span>
                </label>
                <p className="registration-privacy-note">Seus dados acadêmicos ajudam o MedSync a entender sua comunidade e melhorar ações educacionais, preferencialmente com informações agregadas ou anonimizadas.</p>
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
