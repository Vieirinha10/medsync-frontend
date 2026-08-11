export const FREE_PLAN = {
  id: 'gratuito',
  name: 'Gratuito',
  price: 'R$ 0',
  billingLabel: 'para começar',
};

export const PREMIUM_BILLING_OPTIONS = [
  {
    id: 'avulso',
    name: 'Mensal avulso',
    price: 'R$ 25,90',
    billingLabel: '30 dias de acesso',
    paymentMethod: 'Pix',
    badge: 'SEM RENOVAÇÃO AUTOMÁTICA',
    description: 'Liberdade para ativar o Premium somente quando quiser, sem cobrança futura.',
    highlights: [
      'Pagamento único via Pix',
      '30 dias de acesso Premium',
      'Sem renovação automática',
    ],
  },
  {
    id: 'recorrente',
    name: 'Mensal recorrente',
    price: 'R$ 23,90',
    billingLabel: 'por mês',
    paymentMethod: 'Cartão',
    badge: 'MAIS ESCOLHIDO',
    description: 'O equilíbrio ideal entre economia, praticidade e flexibilidade para estudar todo mês.',
    highlights: [
      'Renovação automática no cartão',
      'Cancele quando quiser',
      'Economize R$ 24 por ano',
    ],
    featured: true,
  },
  {
    id: 'trimestral',
    name: 'Trimestral',
    price: 'R$ 65,90',
    billingLabel: 'por 3 meses',
    paymentMethod: 'Cartão',
    badge: 'MELHOR CUSTO-BENEFÍCIO',
    description: 'Três meses de continuidade com o menor valor mensal entre as opções Premium.',
    highlights: [
      'Equivale a R$ 21,97 por mês',
      'Pagamento único no cartão',
      'Parcelamento em até 3x',
    ],
    bestValue: true,
  },
];

export const MONTHLY_ONE_TIME_PLAN = PREMIUM_BILLING_OPTIONS[0];
export const MONTHLY_RECURRING_PLAN = PREMIUM_BILLING_OPTIONS[1];
export const QUARTERLY_PLAN = PREMIUM_BILLING_OPTIONS[2];

export const PREMIUM_ANNUAL_SAVINGS = 'R$ 24';
export const QUARTERLY_VS_ONE_TIME_SAVINGS = 'R$ 11,80';
