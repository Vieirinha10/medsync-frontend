import { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiClock,
  FiCreditCard,
  FiLayers,
  FiLoader,
  FiLock,
  FiRefreshCw,
  FiShield,
  FiStar,
  FiZap,
} from 'react-icons/fi';
import { PREMIUM_BILLING_OPTIONS } from '../config/pricing';
import { api } from '../services/api';

const planIcons = {
  avulso: FiZap,
  recorrente: FiRefreshCw,
  trimestral: FiLayers,
};

const paymentDetails = {
  avulso: {
    title: 'Pix à vista',
    text: 'Pagamento único, sem renovação automática.',
    icon: FiZap,
  },
  recorrente: {
    title: 'Cartão recorrente',
    text: 'Cobrança mensal automática. Cancele quando quiser.',
    icon: FiCreditCard,
  },
  trimestral: {
    title: 'Cartão em até 3x',
    text: 'Pagamento único de R$ 65,90, parcelável em até 3 vezes.',
    icon: FiCreditCard,
  },
};

const CheckoutPage = () => {
  const { planId } = useParams();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState('');
  const plan = useMemo(
    () => PREMIUM_BILLING_OPTIONS.find((option) => option.id === planId),
    [planId],
  );

  if (!plan) return <Navigate to="/assinatura" replace />;

  const PlanIcon = planIcons[plan.id] || FiStar;
  const method = paymentDetails[plan.id];
  const MethodIcon = method.icon;

  const continueToAsaas = async () => {
    setIsRedirecting(true);
    setError('');
    try {
      const checkout = await api.createPaymentCheckout(plan.id);
      window.location.assign(checkout.checkout_url);
    } catch (requestError) {
      setError(requestError.message);
      setIsRedirecting(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-shell">
        <header className="checkout-header">
          <Link to="/assinatura"><FiArrowLeft /> Voltar aos planos</Link>
          <span><FiLock /> AMBIENTE DE COMPRA PROTEGIDO</span>
        </header>

        <div className="checkout-progress" aria-label="Etapas da compra">
          <div className="is-active"><b>1</b><span><strong>Revisão</strong><small>Confira seu plano</small></span></div>
          <i aria-hidden="true" />
          <div><b>2</b><span><strong>Pagamento</strong><small>Ambiente seguro Asaas</small></span></div>
          <i aria-hidden="true" />
          <div><b>3</b><span><strong>Premium</strong><small>Liberação automática</small></span></div>
        </div>

        <main className="checkout-layout">
          <section className="checkout-main-card">
            <span className="checkout-eyebrow"><FiStar /> CHECKOUT MEDSYNC</span>
            <h1>Você está a um passo de liberar o Premium.</h1>
            <p className="checkout-lead">Revise sua escolha. Os dados de pagamento serão preenchidos na próxima tela, processada diretamente pela Asaas.</p>

            <article className="checkout-selected-plan">
              <div className="checkout-plan-icon"><PlanIcon /></div>
              <div>
                <small>PLANO SELECIONADO</small>
                <h2>{plan.name}</h2>
                <p>{plan.description}</p>
              </div>
              <span className="checkout-plan-badge">{plan.badge}</span>
            </article>

            <div className="checkout-method-card">
              <div><MethodIcon /></div>
              <span><small>FORMA DE PAGAMENTO</small><strong>{method.title}</strong><p>{method.text}</p></span>
              <FiCheck className="checkout-method-check" />
            </div>

            <div className="checkout-benefits">
              <h3>O que será liberado</h3>
              <div>
                <span><FiCheck /> Biblioteca completa de casos</span>
                <span><FiCheck /> Desafios e especialidades Premium</span>
                <span><FiCheck /> Feedback detalhado das decisões</span>
                <span><FiCheck /> Indicadores avançados de desempenho</span>
              </div>
            </div>

            <div className="checkout-security-note">
              <FiShield />
              <div><strong>Seus dados financeiros ficam protegidos</strong><p>O MedSync não recebe nem armazena o número do seu cartão. O processamento é realizado pela Asaas.</p></div>
            </div>
          </section>

          <aside className="checkout-summary-card">
            <span className="checkout-summary-label">RESUMO DA COMPRA</span>
            <div className="checkout-summary-plan"><strong>MedSync Premium</strong><span>{plan.name}</span></div>
            <div className="checkout-summary-row"><span>Plano</span><strong>{plan.billingLabel}</strong></div>
            <div className="checkout-summary-row"><span>Pagamento</span><strong>{plan.paymentMethod}</strong></div>
            {plan.id === 'trimestral' && <div className="checkout-installment"><FiCreditCard /><span><strong>3x de R$ 21,97</strong><small>ou R$ 65,90 à vista no cartão</small></span></div>}
            <div className="checkout-summary-total"><span>Total</span><strong>{plan.price}</strong></div>
            <button type="button" onClick={continueToAsaas} disabled={isRedirecting}>
              {isRedirecting ? <><FiLoader className="checkout-spinner" /> Preparando pagamento...</> : <>Continuar para pagamento <FiArrowRight /></>}
            </button>
            {error && <p className="checkout-error" role="alert">{error}</p>}
            <small className="checkout-terms">Ao continuar, você concorda com os <Link to="/termos">Termos de Uso</Link> e a <Link to="/privacidade">Política de Privacidade</Link>.</small>
            <div className="checkout-provider"><FiLock /><span><strong>Pagamento seguro</strong><small>Processado pela Asaas</small></span></div>
          </aside>
        </main>

        <footer className="checkout-help"><FiClock /><span>Após a confirmação, o Premium é ativado automaticamente. Pix costuma ser identificado em poucos instantes.</span></footer>
      </div>
    </div>
  );
};

export default CheckoutPage;
