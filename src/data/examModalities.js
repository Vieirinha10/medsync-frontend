const EXAM_MODALITY_INFO = {
  'Radiografia de tórax': {
    examClass: 'Diagnóstico por imagem',
    purpose: 'Avalia pulmões, pleuras, mediastino e silhueta cardíaca. É útil na investigação de dispneia, dor torácica, trauma e infecções respiratórias.',
  },
  Eletrocardiograma: {
    examClass: 'Traçado cardiológico',
    purpose: 'Registra a atividade elétrica do coração para analisar ritmo, frequência, condução e sinais de sobrecarga ou isquemia.',
  },
  'Tomografia de crânio': {
    examClass: 'Diagnóstico por imagem',
    purpose: 'Produz cortes detalhados do crânio e do encéfalo para identificar hemorragias, fraturas, efeito de massa e sinais de acidente vascular cerebral.',
  },
  'Fotografia clínica': {
    examClass: 'Imagem clínica',
    purpose: 'Documenta a aparência e a distribuição de lesões visíveis, ajudando a reconhecer padrões morfológicos e acompanhar sua evolução.',
  },
  Fundoscopia: {
    examClass: 'Exame oftalmológico',
    purpose: 'Permite observar retina, vasos e disco óptico para reconhecer alterações vasculares, hemorrágicas e do nervo óptico.',
  },
  'Esfregaço periférico': {
    examClass: 'Microscopia',
    purpose: 'Examina a morfologia das células do sangue e auxilia na investigação de anemias, hemólise e outras doenças hematológicas.',
  },
  'Ultrassonografia abdominal': {
    examClass: 'Diagnóstico por imagem',
    purpose: 'Avalia órgãos e estruturas abdominais em tempo real, sem radiação, demonstrando alterações como espessamento, líquido, cálculos e compressibilidade.',
  },
  'Tomografia de abdome': {
    examClass: 'Diagnóstico por imagem',
    purpose: 'Fornece cortes detalhados do abdome e retroperitônio para localizar cálculos, obstruções, inflamações e massas.',
  },
  'Fotografia clínica ocular': {
    examClass: 'Exame oftalmológico',
    purpose: 'Documenta estruturas externas do olho e ajuda a reconhecer alterações da conjuntiva, córnea, pupila e pálpebras.',
  },
  Otoscopia: {
    examClass: 'Exame otorrinolaringológico',
    purpose: 'Permite observar o conduto auditivo e a membrana timpânica para identificar inflamação, secreção, abaulamento e perfurações.',
  },
  'Inspeção da orofaringe': {
    examClass: 'Exame otorrinolaringológico',
    purpose: 'Avalia tonsilas, palato, úvula e parede da faringe, demonstrando edema, assimetrias, lesões e exsudatos.',
  },
  'Ultrassonografia renal': {
    examClass: 'Diagnóstico por imagem',
    purpose: 'Avalia rins e sistema coletor sem radiação, auxiliando na identificação de dilatações, cálculos, cistos e massas.',
  },
  'Radiografia de punho': {
    examClass: 'Diagnóstico por imagem',
    purpose: 'Demonstra alinhamento ósseo e articular do punho, sendo utilizada principalmente na avaliação de fraturas e luxações.',
  },
};

const FALLBACK_INFO = {
  examClass: 'Avaliação visual',
  purpose: 'Este recurso visual auxilia no reconhecimento de padrões e deve ser interpretado em conjunto com o contexto clínico.',
};

export const getExamModalityInfo = (modality = '') => (
  EXAM_MODALITY_INFO[modality] || FALLBACK_INFO
);

export const enrichVisualChallenge = (challenge) => ({
  ...challenge,
  ...getExamModalityInfo(challenge.modality),
});
