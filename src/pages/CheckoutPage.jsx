import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  FiArrowLeft,
  FiCheck,
  FiCheckCircle,
  FiCopy,
  FiCreditCard,
  FiLoader,
  FiLock,
  FiMapPin,
  FiPhone,
  FiRefreshCw,
  FiShield,
  FiStar,
  FiZap,
} from 'react-icons/fi';
import { PREMIUM_BILLING_OPTIONS } from '../config/pricing';
import { api } from '../services/api';

const emptyForm = {
  cpfCnpj: '', telefone: '', cep: '', numeroEndereco: '', complemento: '',
  titular: '', numeroCartao: '', mesValidade: '', anoValidade: '', ccv: '', parcelas: '1',
};

const onlyDigits = (value) => value.replace(/\D/g, '');
const formatCardNumber = (value) => onlyDigits(value).slice(0, 19).replace(/(.{4})/g, '$1 ').trim();
const formatCpfCnpj = (value) => onlyDigits(value).slice(0, 14);
const formatPhone = (value) => onlyDigits(value).slice(0, 11);
const formatCep = (value) => onlyDigits(value).slice(0, 8);

const CheckoutPage = () => {
  const { planId } = useParams();
  const [form, setForm] = useState(emptyForm);
  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [payment, setPayment] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [copied, setCopied] = useState(false);
  const plan = useMemo(
    () => PREMIUM_BILLING_OPTIONS.find((option) => option.id === planId),
    [planId],
  );
  const isPix = plan?.id === 'avulso';

  useEffect(() => {
    api.getCurrentUser()
      .then((currentUser) => {
        setUser(currentUser);
        setForm((current) => ({ ...current, titular: currentUser.nome || '' }));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!payment?.pedido_id || paymentStatus?.premium_ativo) return undefined;
    const refresh = async () => {
      try {
        const status = await api.getPaymentStatus(payment.pedido_id);
        setPaymentStatus(status);
      } catch {
        // O webhook continuará sendo consultado na próxima tentativa.
      }
    };
    refresh();
    const interval = window.setInterval(refresh, 3000);
    return () => window.clearInterval(interval);
  }, [payment?.pedido_id, paymentStatus?.premium_ativo]);

  if (!plan) return <Navigate to="/assinatura" replace />;

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const validate = () => {
    if (![11, 14].includes(onlyDigits(form.cpfCnpj).length)) return 'Informe um CPF ou CNPJ válido.';
    if (![10, 11].includes(onlyDigits(form.telefone).length)) return 'Informe um telefone com DDD.';
    if (onlyDigits(form.cep).length !== 8) return 'Informe um CEP válido.';
    if (!form.numeroEndereco.trim()) return 'Informe o número do endereço.';
    if (!isPix) {
      if (form.titular.trim().length < 3) return 'Informe o nome impresso no cartão.';
      if (onlyDigits(form.numeroCartao).length < 13) return 'Informe um cartão válido.';
      if (!form.mesValidade || !form.anoValidade || onlyDigits(form.ccv).length < 3) return 'Confira a validade e o código de segurança.';
    }
    return '';
  };

  const submitPayment = async (event) => {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      const payload = {
        plano_id: plan.id,
        parcelas: Number(form.parcelas),
        pagador: {
          cpf_cnpj: form.cpfCnpj,
          telefone: form.telefone,
          cep: form.cep,
          numero_endereco: form.numeroEndereco,
          complemento: form.complemento || null,
        },
      };
      if (!isPix) {
        payload.cartao = {
          titular: form.titular,
          numero: form.numeroCartao,
          mes_validade: form.mesValidade,
          ano_validade: form.anoValidade,
          ccv: form.ccv,
        };
      }
      const result = await api.createTransparentPayment(payload);
      setPayment(result);
      setPaymentStatus(null);
      setForm((current) => ({ ...current, numeroCartao: '', ccv: '' }));
    } catch (requestError) {
      setError(requestError.message);
      setForm((current) => ({ ...current, ccv: '' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyPix = async () => {
    await navigator.clipboard.writeText(payment.pix_copia_cola);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const premiumActive = paymentStatus?.premium_ativo;
  const qrSource = payment?.pix_qr_code?.startsWith('data:')
    ? payment.pix_qr_code
    : `data:image/png;base64,${payment?.pix_qr_code || ''}`;

  return (
    <div className="checkout-page checkout-transparent-page">
      <div className="checkout-shell">
        <header className="checkout-header">
          <Link to="/assinatura"><FiArrowLeft /> Voltar aos planos</Link>
          <span><FiLock /> CHECKOUT TRANSPARENTE · ASAAS</span>
        </header>

        <main className="transparent-checkout-layout">
          <aside className="transparent-order-panel">
            <span className="checkout-eyebrow"><FiStar /> MEDSYNC PREMIUM</span>
            <h1>Resumo do pedido</h1>
            <article className="transparent-plan-card">
              <div className="transparent-plan-top">
                <span>{isPix ? <FiZap /> : <FiRefreshCw />}</span>
                <div><small>PLANO SELECIONADO</small><h2>{plan.name}</h2></div>
                <b>{plan.badge}</b>
              </div>
              <p>{plan.description}</p>
              <strong className="transparent-plan-price">{plan.price}<small>{plan.billingLabel}</small></strong>
            </article>

            <div className="transparent-benefits">
              <span><FiCheck /> Biblioteca completa de casos clínicos</span>
              <span><FiCheck /> Desafios Premium por especialidade</span>
              <span><FiCheck /> Feedback detalhado das decisões</span>
              <span><FiCheck /> Indicadores avançados de desempenho</span>
            </div>

            <div className="transparent-total"><span>Total</span><strong>{plan.price}</strong></div>
            <div className="transparent-secure"><FiShield /><span><strong>Compra protegida</strong><small>Processamento financeiro realizado pela Asaas.</small></span></div>
          </aside>

          <section className="transparent-payment-panel">
            {premiumActive ? (
              <div className="transparent-result is-success">
                <FiCheckCircle />
                <span>ASSINATURA CONFIRMADA</span>
                <h2>Seu Premium já está ativo!</h2>
                <p>O pagamento foi confirmado e todos os recursos foram liberados.</p>
                <Link to="/dashboard">Ir para meu painel</Link>
              </div>
            ) : payment?.forma_pagamento === 'PIX' ? (
              <div className="transparent-result is-pix">
                <span>PAGAMENTO VIA PIX</span>
                <h2>Escaneie para concluir</h2>
                <p>Abra o aplicativo do seu banco e pague o QR Code abaixo. Esta tela atualiza automaticamente.</p>
                <div className="transparent-qr"><img src={qrSource} alt="QR Code Pix do pedido MedSync" /></div>
                <button type="button" className="transparent-copy" onClick={copyPix}>
                  {copied ? <><FiCheck /> Código copiado</> : <><FiCopy /> Copiar código Pix</>}
                </button>
                <div className="transparent-wait"><FiLoader /><span><strong>Aguardando pagamento</strong><small>Não feche esta página enquanto realiza o Pix.</small></span></div>
              </div>
            ) : payment ? (
              <div className="transparent-result is-card-waiting">
                <FiLoader className="checkout-spinner" />
                <span>PAGAMENTO EM ANÁLISE</span>
                <h2>Estamos confirmando seu cartão</h2>
                <p>A resposta costuma chegar em poucos instantes. O Premium será liberado automaticamente após a confirmação.</p>
                <small>Pedido {payment.pedido_id.slice(0, 8).toUpperCase()}</small>
              </div>
            ) : (
              <form onSubmit={submitPayment} noValidate>
                <div className="transparent-form-heading">
                  <span className="checkout-eyebrow">PAGAMENTO SEM SAIR DO MEDSYNC</span>
                  <h2>{isPix ? 'Gere seu Pix com segurança' : 'Informe os dados do cartão'}</h2>
                  <p>{user?.email || 'Seus dados serão vinculados à conta MedSync autenticada.'}</p>
                </div>

                <div className="transparent-method">
                  <div className="is-selected">{isPix ? <FiZap /> : <FiCreditCard />}<span><strong>{isPix ? 'Pix à vista' : 'Cartão de crédito'}</strong><small>{isPix ? 'Liberação após a confirmação' : 'Processado instantaneamente'}</small></span><FiCheckCircle /></div>
                </div>

                {!isPix && (
                  <fieldset className="transparent-fieldset">
                    <legend><FiCreditCard /> Dados do cartão</legend>
                    <label className="is-wide">Número do cartão<input inputMode="numeric" autoComplete="cc-number" value={form.numeroCartao} onChange={(e) => setField('numeroCartao', formatCardNumber(e.target.value))} placeholder="0000 0000 0000 0000" /></label>
                    <label className="is-wide">Nome impresso no cartão<input autoComplete="cc-name" value={form.titular} onChange={(e) => setField('titular', e.target.value)} placeholder="Nome do titular" /></label>
                    <label>Validade<input inputMode="numeric" autoComplete="cc-exp-month" value={form.mesValidade} onChange={(e) => setField('mesValidade', onlyDigits(e.target.value).slice(0, 2))} placeholder="MM" /></label>
                    <label>Ano<input inputMode="numeric" autoComplete="cc-exp-year" value={form.anoValidade} onChange={(e) => setField('anoValidade', onlyDigits(e.target.value).slice(0, 4))} placeholder="AAAA" /></label>
                    <label>CVV<input type="password" inputMode="numeric" autoComplete="cc-csc" value={form.ccv} onChange={(e) => setField('ccv', onlyDigits(e.target.value).slice(0, 4))} placeholder="•••" /></label>
                    {plan.id === 'trimestral' && <label>Parcelas<select value={form.parcelas} onChange={(e) => setField('parcelas', e.target.value)}><option value="1">1x de R$ 65,90</option><option value="2">2x de R$ 32,95</option><option value="3">3x de R$ 21,97</option></select></label>}
                  </fieldset>
                )}

                <fieldset className="transparent-fieldset">
                  <legend><FiMapPin /> Identificação e cobrança</legend>
                  <label>CPF ou CNPJ<input inputMode="numeric" autoComplete="off" value={form.cpfCnpj} onChange={(e) => setField('cpfCnpj', formatCpfCnpj(e.target.value))} placeholder="Somente números" /></label>
                  <label><FiPhone /> Telefone<input inputMode="tel" autoComplete="tel" value={form.telefone} onChange={(e) => setField('telefone', formatPhone(e.target.value))} placeholder="DDD + número" /></label>
                  <label>CEP<input inputMode="numeric" autoComplete="postal-code" value={form.cep} onChange={(e) => setField('cep', formatCep(e.target.value))} placeholder="00000000" /></label>
                  <label>Número<input autoComplete="address-line2" value={form.numeroEndereco} onChange={(e) => setField('numeroEndereco', e.target.value.slice(0, 20))} placeholder="123" /></label>
                  <label className="is-wide">Complemento (opcional)<input autoComplete="address-line3" value={form.complemento} onChange={(e) => setField('complemento', e.target.value.slice(0, 80))} placeholder="Apartamento, bloco ou referência" /></label>
                </fieldset>

                {error && <p className="checkout-error" role="alert">{error}</p>}
                <button className="transparent-submit" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <><FiLoader className="checkout-spinner" /> Processando com segurança...</> : <>{isPix ? 'Gerar QR Code Pix' : `Pagar ${plan.price}`} <FiLock /></>}
                </button>
                <small className="checkout-terms">Ao finalizar, você concorda com os <Link to="/termos">Termos de Uso</Link> e a <Link to="/privacidade">Política de Privacidade</Link>.</small>
                <div className="transparent-card-security"><FiShield /><p><strong>Dados protegidos em trânsito.</strong> O MedSync não armazena número do cartão nem CVV.</p></div>
              </form>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default CheckoutPage;
