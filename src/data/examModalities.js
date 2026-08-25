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
  'Histopatologia cutânea': {
    examClass: 'Microscopia anatomopatológica',
    purpose: 'Avalia a arquitetura da epiderme e da derme e a morfologia celular para diferenciar neoplasias, inflamações e outras dermatoses.',
  },
  Biomicroscopia: {
    examClass: 'Exame oftalmológico',
    purpose: 'Utiliza a lâmpada de fenda para examinar com ampliação córnea, câmara anterior, íris e cristalino, identificando opacidades e inflamações.',
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
  'Rinoscopia anterior': {
    examClass: 'Exame otorrinolaringológico',
    purpose: 'Permite inspecionar septo, cornetos e porção anterior das fossas nasais para identificar edema, secreções, massas e alterações estruturais.',
  },
  'Fotografia clínica oral': {
    examClass: 'Exame da cavidade oral',
    purpose: 'Documenta mucosas, língua, gengivas e palato para reconhecer placas, úlceras, pigmentações e padrões inflamatórios ou infecciosos.',
  },
  'Coloração de Gram': {
    examClass: 'Microscopia microbiológica',
    purpose: 'Diferencia bactérias pela estrutura da parede celular e demonstra sua morfologia e agrupamento, orientando a identificação inicial do agente.',
  },
  'Baciloscopia (Ziehl-Neelsen)': {
    examClass: 'Microscopia microbiológica',
    purpose: 'Pesquisa bacilos álcool-ácido resistentes em amostras clínicas, sendo utilizada principalmente na investigação inicial da tuberculose.',
  },
  'Esfregaço sanguíneo': {
    examClass: 'Microscopia parasitológica',
    purpose: 'Permite observar parasitos e formas evolutivas no sangue periférico, auxiliando no diagnóstico e na diferenciação das espécies de malária.',
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
  'Ressonância magnética cerebral (SWI)': {
    examClass: 'Diagnóstico por imagem',
    purpose: 'A sequência ponderada por suscetibilidade destaca sangue e produtos de degradação da hemoglobina, sendo útil para identificar micro-hemorragias traumáticas.',
  },
  'Radiografia do ombro': {
    examClass: 'Diagnóstico por imagem',
    purpose: 'Avalia congruência glenoumeral, articulação acromioclavicular e estruturas ósseas do ombro em casos de trauma, dor e deformidade.',
  },
  'Radiografia de pelve': {
    examClass: 'Diagnóstico por imagem',
    purpose: 'Examina o anel pélvico e os quadris para reconhecer fraturas, luxações e alterações do alinhamento articular.',
  },
  'Radiografia do pé': {
    examClass: 'Diagnóstico por imagem',
    purpose: 'Demonstra ossos e articulações do pé, incluindo o alinhamento tarsometatarsal, para investigar fraturas e luxações traumáticas.',
  },
  'Inspeção retroauricular': {
    examClass: 'Exame físico visual',
    purpose: 'Avalia pele e tecidos atrás da orelha em busca de equimose, edema, inflamação e sinais externos associados ao trauma craniano.',
  },
  'Exame físico da mão': {
    examClass: 'Exame neurológico e musculoesquelético',
    purpose: 'Observa postura, trofismo e movimentos dos dedos para reconhecer deformidades e padrões de comprometimento nervoso periférico.',
  },
  'Ultrassonografia FAST': {
    examClass: 'Ultrassonografia à beira-leito',
    purpose: 'Pesquisa rapidamente líquido livre intraperitoneal e pericárdico em pacientes traumatizados, orientando prioridades da avaliação inicial.',
  },
  'Exame neuro-oftalmológico': {
    examClass: 'Exame neurológico ocular',
    purpose: 'Avalia pálpebras, pupilas, posição ocular e movimentos extrínsecos para localizar alterações de nervos cranianos e vias oculomotoras.',
  },
  'Angiotomografia de tórax': {
    examClass: 'Diagnóstico por imagem',
    purpose: 'Avalia as artérias pulmonares após contraste intravenoso e permite identificar falhas de enchimento compatíveis com embolia pulmonar.',
  },
  'Angiotomografia da aorta': {
    examClass: 'Diagnóstico por imagem',
    purpose: 'Demonstra a luz e a parede da aorta após contraste, permitindo reconhecer aneurismas, rupturas, flap íntimal e dissecção.',
  },
  'Ecocardiografia à beira-leito': {
    examClass: 'Ultrassonografia cardíaca',
    purpose: 'Avalia rapidamente câmaras cardíacas, contratilidade, volume intravascular e presença de líquido pericárdico no ponto de atendimento.',
  },
  'Ultrassonografia pulmonar': {
    examClass: 'Ultrassonografia à beira-leito',
    purpose: 'Analisa pleura e artefatos pulmonares para reconhecer padrões de edema intersticial, consolidação, derrame pleural e pneumotórax.',
  },
  'Ultrassonografia vascular': {
    examClass: 'Diagnóstico vascular',
    purpose: 'Avalia vasos em modo bidimensional e Doppler, incluindo compressibilidade venosa, fluxo e presença de trombos.',
  },
  Espirometria: {
    examClass: 'Prova de função pulmonar',
    purpose: 'Mede volumes e fluxos respiratórios para identificar padrões ventilatórios obstrutivos, restritivos e alterações de vias aéreas superiores.',
  },
  'Radiografia de abdome': {
    examClass: 'Diagnóstico por imagem',
    purpose: 'Avalia o padrão de gás intestinal, níveis hidroaéreos, calcificações e ar livre, auxiliando na investigação inicial de dor, distensão e obstrução abdominal.',
  },
  Cistoscopia: {
    examClass: 'Endoscopia urológica',
    purpose: 'Permite inspecionar diretamente uretra e bexiga para reconhecer tumores, cálculos, sangramento e alterações inflamatórias da mucosa.',
  },
  'Ultrassonografia com Doppler': {
    examClass: 'Diagnóstico por imagem',
    purpose: 'Combina a anatomia em modo bidimensional com a avaliação do fluxo sanguíneo, sendo útil em emergências vasculares testiculares e ovarianas.',
  },
  'Ultrassonografia transvaginal': {
    examClass: 'Diagnóstico ginecológico por imagem',
    purpose: 'Avalia útero, endométrio, ovários e anexos em alta resolução, incluindo a localização da gestação inicial e massas pélvicas.',
  },
  'Ultrassonografia obstétrica': {
    examClass: 'Diagnóstico obstétrico por imagem',
    purpose: 'Avalia feto, placenta, líquido amniótico e colo uterino para acompanhar a gestação e reconhecer complicações obstétricas.',
  },
  'Ilustração anatômica obstétrica': {
    examClass: 'Recurso educacional anatômico',
    purpose: 'Representa relações anatômicas entre feto, placenta, segmento uterino inferior e colo para facilitar o reconhecimento de complicações obstétricas.',
  },
  'Endoscopia digestiva alta': {
    examClass: 'Endoscopia digestiva',
    purpose: 'Inspeciona diretamente esôfago, estômago e duodeno para identificar úlceras, varizes, inflamações, sangramento e neoplasias.',
  },
  'Ultrassonografia pediátrica': {
    examClass: 'Diagnóstico pediátrico por imagem',
    purpose: 'Avalia estruturas abdominais de crianças sem radiação, sendo especialmente útil para reconhecer invaginação intestinal e alterações do piloro.',
  },
  Citologia: {
    examClass: 'Microscopia citopatológica',
    purpose: 'Analisa células isoladas ou agrupadas para reconhecer padrões de inflamação, atipia e neoplasia.',
  },
  Histopatologia: {
    examClass: 'Microscopia anatomopatológica',
    purpose: 'Avalia arquitetura tecidual e morfologia celular em lâminas coradas para identificar inflamações, displasias e neoplasias.',
  },
  'Microscopia urinária': {
    examClass: 'Microscopia laboratorial',
    purpose: 'Examina o sedimento urinário para identificar células, cilindros, microrganismos e cristais que orientam diagnósticos renais, metabólicos e toxicológicos.',
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
