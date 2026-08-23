import { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';

import { api } from '../services/api';

const VerificarEmailPage = () => {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [email, setEmail] = useState(location.state?.email || '');
    const [status, setStatus] = useState(token ? 'verifying' : 'pending');
    const [message, setMessage] = useState(
        token
            ? 'Confirmando seu e-mail...'
            : 'Enviamos um link de confirmação. Verifique sua caixa de entrada e o spam.',
    );
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        if (!token) return undefined;
        let active = true;
        api.verifyEmail(token)
            .then((result) => {
                if (!active) return;
                setStatus('success');
                setMessage(result.message);
            })
            .catch((error) => {
                if (!active) return;
                setStatus('error');
                setMessage(error.message);
            });
        return () => { active = false; };
    }, [token]);

    const handleResend = async (event) => {
        event.preventDefault();
        setIsResending(true);
        try {
            const result = await api.resendEmailVerification(email);
            setStatus('pending');
            setMessage(result.message);
        } catch (error) {
            setStatus('error');
            setMessage(error.message);
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="auth-container">
            <h1>Confirme seu e-mail</h1>
            <p className={status === 'error' ? 'error-message' : 'success-message'} role="status">
                {message}
            </p>

            {status === 'success' ? (
                <Link className="btn-submit auth-action-link" to="/login">Entrar na MedSync</Link>
            ) : (
                <form onSubmit={handleResend}>
                    <div className="form-group">
                        <label htmlFor="verification_email">E-mail</label>
                        <input
                            id="verification_email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-submit" disabled={isResending || status === 'verifying'}>
                        {isResending ? 'Enviando...' : 'Reenviar confirmação'}
                    </button>
                    <div className="auth-link"><Link to="/login">Voltar ao login</Link></div>
                </form>
            )}
        </div>
    );
};

export default VerificarEmailPage;
