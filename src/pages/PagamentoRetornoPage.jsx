import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiRefreshCw,
  FiShield,
} from 'react-icons/fi';
import { api } from '../services/api';

const COPY = {
  cancelado: {
    icon: FiAlertCircle,
    tone: 'is-canceled',
    title: 'Pagamento cancelado',
    text: 'Nenhuma cobrança foi confirmada. Você pode voltar aos planos quando quiser.',
  },
  expirado: {
    icon: FiClock,
    tone: 'is-expired',
    title: 'O checkout expirou',
    text: 'Por segurança, o link deixou de ser válido. Gere um novo checkout na página de planos.',
  },
};

const PagamentoRetornoPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('pedido');
  const result = searchParams.get('resultado') || 'sucesso';
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const staticCopy = COPY[result];

  const refreshStatus = useCallback(async () => {
    if (!orderId || staticCopy) return;
    setRefreshing(true);
    try {
      setPayment(await api.getPaymentStatus(orderId));
      setError('');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setRefreshing(false);
    }
  }, [orderId, staticCopy]);

  useEffect(() => {
    refreshStatus();
    if (staticCopy) return undefined;
    const interval = window.setInterval(refreshStatus, 3000);
    return () => window.clearInterval(interval);
  }, [refreshStatus, staticCopy]);

  const confirmed = payment?.premium_ativo;
  const Icon = staticCopy?.icon || (confirmed ? FiCheckCircle : FiClock);
  const title = staticCopy?.title || (confirmed ? 'Premium liberado!' : 'Confirmando seu pagamento');
  const text = staticCopy?.text || (confirmed
    ? 'Seu acesso Premium já está ativo. Você pode continuar seus estudos agora.'
    : 'A Asaas está processando a confirmação. Esta tela será atualizada automaticamente.');

  return (
    <div className="payment-return-page">
      <section className={`payment-return-card ${staticCopy?.tone || (confirmed ? 'is-confirmed' : 'is-pending')}`}>
        <span className="payment-return-security"><FiShield aria-hidden="true" /> PAGAMENTO SEGURO · ASAAS</span>
        <div className="payment-return-icon"><Icon aria-hidden="true" /></div>
        <h1>{title}</h1>
        <p>{text}</p>

        {!staticCopy && payment && (
          <dl className="payment-return-details">
            <div><dt>Pedido</dt><dd>{payment.pedido_id.slice(0, 8).toUpperCase()}</dd></div>
            <div><dt>Status</dt><dd>{payment.status.replaceAll('_', ' ')}</dd></div>
          </dl>
        )}

        {error && <p className="payment-return-error" role="alert">{error}</p>}

        <div className="payment-return-actions">
          {confirmed ? (
            <Link to="/casos">Explorar casos clínicos</Link>
          ) : (
            <Link to="/assinatura">Voltar aos planos</Link>
          )}
          {!staticCopy && !confirmed && (
            <button type="button" onClick={refreshStatus} disabled={refreshing}>
              <FiRefreshCw aria-hidden="true" />
              {refreshing ? 'Verificando...' : 'Verificar agora'}
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default PagamentoRetornoPage;
