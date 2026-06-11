/* cafes.js — banco de cafés + motor de recomendação de água.
   Carregado por recomendador.html DEPOIS de data.js (usa M, KEYS).

   Ideia central: o que decide a água NÃO é a variedade (o mesmo Mundo Novo
   pode dar xícaras opostas), e sim o PROCESSO + a TORRA. Esses dois definem
   três eixos — acidez, corpo e aroma/fermentação (0–10) — e o motor traduz
   esses eixos num alvo de ppm (mg/ca/na/k), calibrado contra os PRESETS de
   data.js. A acidez/corpo/aroma ficam editáveis: se o pacote surpreender,
   você sobrescreve. */

// DNA de cada processo (acidez / corpo / aroma numa escala 0–10).
// É o ponto de partida quando você monta um café manualmente.
// Chaves antigas (lavado/honey/natural/fermentado/barrica) não mudam de nome:
// cafés salvos no localStorage referenciam essas chaves.
const PROCESSOS = {
  lavado:       {n:'Lavado',                                    acidez:7,   corpo:4,   aroma:3},
  cereja:       {n:'Cereja descascada (pulped natural)',        acidez:6,   corpo:5,   aroma:3},
  honey:        {n:'Honey (amarelo / vermelho / preto)',        acidez:5,   corpo:6,   aroma:4},
  natural:      {n:'Natural',                                   acidez:4,   corpo:7,   aroma:5},
  dupla:        {n:'Dupla fermentação / duplo lavado',          acidez:8,   corpo:4,   aroma:5},
  anaerobico:   {n:'Fermentado anaeróbico',                     acidez:8,   corpo:5,   aroma:8},
  carbonica:    {n:'Maceração carbônica',                       acidez:8.5, corpo:4.5, aroma:9},
  lactica:      {n:'Fermentação láctica',                       acidez:7.5, corpo:6,   aroma:8},
  koji:         {n:'Koji / leveduras inoculadas',               acidez:7,   corpo:6,   aroma:9.5},
  fermentado:   {n:'Fermentado (outro / não especificado)',     acidez:8,   corpo:5,   aroma:9},
  barrica:      {n:'Envelhecido em barrica (barrel-aged)',      acidez:3,   corpo:8,   aroma:8},
  descafeinado: {n:'Descafeinado (Swiss Water / EA)',           acidez:4,   corpo:6,   aroma:3},
};

// Fermentações intensas: ácidas/aromáticas demais para render bem no espresso
// (ver aptidao). O 'dupla' fica de fora: é fermentação de limpeza, não de fruta.
const FERMENTADOS = ['fermentado','anaerobico','carbonica','lactica','koji'];

// A torra empurra o DNA (somado aos eixos, depois recortado em 0–10).
const TORRAS = {
  clara:  {n:'Clara',  dAcidez:+1.5, dCorpo:-1,   dAroma:0},
  media:  {n:'Média',  dAcidez:0,    dCorpo:0,    dAroma:0},
  escura: {n:'Escura', dAcidez:-2,   dCorpo:+1.5, dAroma:0},
};

const clamp10 = x => Math.max(0, Math.min(10, x));

// Eixos de partida a partir de processo + torra (modo manual / autofill).
function baselineEixos(proc, torra){
  const p = PROCESSOS[proc] || PROCESSOS.honey;
  const t = TORRAS[torra]   || TORRAS.media;
  return {
    acidez: clamp10(p.acidez + t.dAcidez),
    corpo:  clamp10(p.corpo  + t.dCorpo),
    aroma:  clamp10(p.aroma  + t.dAroma),
  };
}

/* Motor: eixos (0–10) → alvo de ppm para COADO/FILTRADO.
   - Magnésio puxa acidez E aroma (fermentados pedem mais Mg).
   - Cálcio dá corpo.
   - Buffer (K, bicarbonato) sobe com o corpo e DESCE com acidez/aroma,
     para não achatar cafés vivos.
   Coeficientes calibrados para que os extremos batam com os PRESETS de
   data.js (Brilhante/leve ↔ Encorpado). Sódio fica 0 aqui: é a alavanca
   do espresso (ver nota de aptidão), não do coado. */
function alvoPpm({acidez, corpo, aroma}){
  const a = clamp10(acidez)/10, c = clamp10(corpo)/10, ar = clamp10(aroma)/10;
  const mg = Math.round(5 + 4*a + 4*ar);
  const ca = Math.round(2 + 23*c);
  const k  = Math.round(Math.max(6, 14 + 22*c - 8*a - 6*ar));
  return {mg, ca, na:0, k};
}

/* Aptidão para espresso (a bebida, não a água): corpo encorpado e acidez
   baixa caem bem no espresso; cafés ácidos/aromáticos ficam agressivos e
   rendem mais no coado. Retorna {nivel, rotulo, metodo}. */
function aptidao({acidez, corpo, aroma, processo}){
  let score = corpo - acidez;
  if(processo === 'natural' || processo === 'barrica') score += 1;   // doces/chocolatados
  if(FERMENTADOS.includes(processo)) score -= 2;                     // ácido/aromático
  if(score >= 3){
    return {nivel:'espresso', rotulo:'⭐ Ótimo para espresso',
            metodo:'Espresso, Moka ou prensa francesa — também vai bem no coado.'};
  }
  if(score <= -1){
    return {nivel:'coado', rotulo:'Melhor coado / filtrado',
            metodo:'V60 / filtro de papel — no espresso a acidez tende a ficar agressiva.'};
  }
  return {nivel:'versatil', rotulo:'Versátil',
          metodo:'V60 / coado é o ponto de equilíbrio; aguenta espresso também.'};
}

/* Banco de cafés (seed). Cada item guarda os campos descritivos (exibição)
   e os três eixos já ajustados à xícara real que provamos/lemos.
   Cadastrar um café novo = adicionar um objeto aqui. */
const CAFES = [
  {
    id:'nice-arara', nome:'Doces · Café da Nice', torrefador:'Do Coado ao Espresso',
    origem:'Chapada Diamantina · Mucugê/BA', variedade:'Arara', altitude:1000, pontuacao:null,
    processo:'honey', torra:'media',
    acidez:5, corpo:6, aroma:4,
    notas:['açúcar mascavo','baunilha','caramelo','acidez cítrica média','corpo aveludado'],
  },
  {
    id:'crazy-koji', nome:'Raros/Premiados · Crazy Koji', torrefador:'Do Coado ao Espresso',
    origem:'Alta Mogiana · São Tomás de Aquino/MG', variedade:'Pau Brasil', altitude:1200, pontuacao:null,
    processo:'fermentado', torra:'media',
    acidez:8.5, corpo:5, aroma:10,
    notas:['floral','hibisco','framboesa','morango','damasco','nibs de cacau','carambola','corpo licoroso'],
  },
  {
    id:'mr-chocolate', nome:'Mr. Chocolate', torrefador:'Moka Clube',
    origem:'Brasil · blend', variedade:'Blend (vários produtores)', altitude:null, pontuacao:84,
    processo:'natural', torra:'media',
    acidez:2, corpo:9, aroma:5,
    notas:['chocolate','encorpado','cremoso','doçura natural','baixa acidez'],
  },
  {
    id:'cafe27-mundonovo', nome:'Mundo Novo · Ouro Fino', torrefador:'Café2ponto7',
    origem:'Sul de Minas · Ouro Fino/MG', variedade:'Mundo Novo', altitude:1200, pontuacao:82,
    processo:'natural', torra:'media',
    acidez:3, corpo:8, aroma:5,
    notas:['chocolate ao leite','castanha','mel','corpo marcante e cremoso','acidez baixa'],
  },
  {
    id:'tachikawa-black', nome:'Tachikawa Microlot · Black Edition', torrefador:'Tachikawa',
    origem:'Norte Pioneiro · Faz. Califórnia/PR', variedade:'Mundo Novo', altitude:750, pontuacao:88,
    processo:'fermentado', torra:'media',
    acidez:8, corpo:5, aroma:9,
    notas:['morango','ameixa vermelha','pêssego','acidez tartárica','toque vinhoso','finalização licorosa'],
  },
  {
    id:'bourbon-barrel', nome:'Bourbon Barrel Aged', torrefador:'Moka Clube',
    origem:'Brasil · blend · barrica de bourbon (45 dias)', variedade:'Blend (vários produtores)', altitude:null, pontuacao:null,
    processo:'barrica', torra:'media',
    acidez:3, corpo:8, aroma:8,
    notas:['baunilha','coco queimado','carvalho','amadeirado'],
  },
  {
    id:'shiraz-barrel', nome:'Shiraz Barrel Aged', torrefador:'Moka Clube',
    origem:'Brasil · blend · barrica de vinho Shiraz', variedade:'Blend (vários produtores)', altitude:null, pontuacao:null,
    processo:'barrica', torra:'media',
    acidez:4, corpo:8, aroma:8,
    notas:['carvalho','uva','vinhoso','licoroso','amadeirado'],
  },
  {
    id:'amburana-barrel', nome:'Amburana Barrel Aged', torrefador:'Moka Clube',
    origem:'Brasil · blend · barrica de amburana (cachaça)', variedade:'Blend (vários produtores)', altitude:null, pontuacao:null,
    processo:'barrica', torra:'media',
    acidez:3, corpo:8, aroma:8,
    notas:['amburana','açúcar mascavo','caramelo','toque etílico'],
  },
  {
    id:'rum-barrel', nome:'Rum Barrel Aged', torrefador:'Moka Clube',
    origem:'Brasil · blend · barrica de rum caribenho', variedade:'Blend (vários produtores)', altitude:null, pontuacao:null,
    processo:'barrica', torra:'media',
    acidez:3, corpo:8, aroma:8,
    notas:['rum','amêndoas','amadeirado','aquecido'],
  },
];
