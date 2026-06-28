/* data.js — fonte única de constantes químicas e perfis.
   Carregado por index.html e avaliador.html ANTES do script inline.
   Mantém um só lugar para massas molares, calibração e perfis-alvo,
   evitando que as páginas (e o labels.py) saiam de sincronia. */

// Massas molares dos íons (g/mol)
const ION_MM = {mg:24.305, ca:40.078, na:22.990, k:39.098, hco3:61.017, so4:96.06, cl:35.453};
// Massas molares dos sais (g/mol)
const SALT_MM = {mg:246.47, ca:147.01, na:84.007, k:100.115};

// Metadados de exibição por mineral
const MIN_META = {
  mg:{name:'Magnésio', salt:'MgSO₄·7H₂O', color:'var(--mg)', max:30},
  ca:{name:'Cálcio',   salt:'CaCl₂·2H₂O', color:'var(--ca)', max:40},
  na:{name:'Sódio',    salt:'NaHCO₃',     color:'var(--na)', max:30},
  k: {name:'Potássio', salt:'KHCO₃',      color:'var(--k)',  max:60},
};

const KEYS = ['mg','ca','na','k'];

// Calibração padrão das soluções-mãe
const STOCKM = 0.5;    // mol/L
const DROPV  = 0.062;  // mL por gota (17 gotas/mL)

// Volumes comuns de extração (mL)
const VOLS = [300,400,450,500,600,800,1000,2000,5000];

// Perfis-alvo (ppm de íon). cmp:true = só comparação (não aparece no avaliador)
const PRESETS = [
  {n:'Doçura & acidez', d:'Magnésio dominante, buffer baixo — acidez expressiva, doce.', v:{mg:12,ca:4,na:0,k:22.4}},
  {n:'Equilibrado', d:'Corpo e acidez em equilíbrio, buffer médio.', v:{mg:7,ca:17,na:0,k:30}},
  {n:'Brilhante / leve', d:'TDS baixo, muito limpo e ácido.', v:{mg:10,ca:2,na:0,k:12}},
  {n:'Encorpado', d:'Cálcio alto, corpo pesado, acidez contida.', v:{mg:8,ca:25,na:0,k:35}},
  {n:'🧂 Coado + toque de sódio', d:'Coado limpo com um traço de sódio: suprime o amargor e abre os aromáticos sem achatar a acidez. Sódio é toque — não exagere.', v:{mg:10,ca:6,na:6,k:12}},
  {n:'☕ Espresso doce & encorpado', d:'Sem cálcio: zero cloreto → menos corrosão e sem calcário duro. Doçura do magnésio, corpo do sódio, buffer médio que protege a máquina.', v:{mg:15,ca:0,na:10,k:16}},
  {n:'Álvaro 10·10·5·5', d:'O exemplo da calculadora original, para comparar.', v:{mg:10,ca:10,na:5,k:5}, cmp:true},
];

// Objeto M no formato usado pelo index (meta + massas molares)
const M = Object.fromEntries(KEYS.map(k => [k, {
  name: MIN_META[k].name, salt: MIN_META[k].salt, color: MIN_META[k].color,
  max: MIN_META[k].max, mmIon: ION_MM[k], mmSalt: SALT_MM[k],
}]));

// Alias usado pelo avaliador
const ION = ION_MM;

/* --- Química compartilhada (fonte única das fórmulas; as páginas usam
       estas funções em vez de repetir os fatores numéricos) --- */

// Equivalente CaCO₃ e fatores derivados (GH 4,118/2,497 · KH 0,8201)
const MM_CACO3 = 100.0869;
const GH_MG = MM_CACO3 / ION_MM.mg;
const GH_CA = MM_CACO3 / ION_MM.ca;
const KH_HCO3 = MM_CACO3 / (2 * ION_MM.hco3);

// GH (ppm CaCO₃) a partir dos ppm dos cátions de dureza
function ghPpm(mg, ca){ return mg*GH_MG + ca*GH_CA; }
// KH (ppm CaCO₃) a partir do bicarbonato (mg/L)
function khPpm(hco3){ return hco3*KH_HCO3; }
// Bicarbonato (mg/L) gerado pelos dois sais de HCO₃ (NaHCO₃ + KHCO₃)
function hco3FromCations(na, k){
  return (na/ION_MM.na + k/ION_MM.k) * ION_MM.hco3;
}
// TDS aproximado de um alvo {mg,ca,na,k}: soma os contra-íons dos sais
// (SO₄ do MgSO₄, 2 Cl do CaCl₂, HCO₃ dos bicarbonatos)
function tdsOf(p){
  const so4 = p.mg/ION_MM.mg*ION_MM.so4;
  const cl  = p.ca/ION_MM.ca*(2*ION_MM.cl);
  return p.mg + p.ca + p.na + p.k + so4 + cl + hco3FromCations(p.na, p.k);
}
// Gotas exatas para levar `ppm` de um íon a `volMl` de água
function dropsExact(ppm, ionMM, volMl, stockm=STOCKM, dropv=DROPV){
  return (ppm/ionMM) * (volMl/1000) / (stockm*dropv);
}
// ppm real do íon depois de arredondar para `drops` gotas inteiras
function ppmFromDrops(drops, ionMM, volMl, stockm=STOCKM, dropv=DROPV){
  return drops*stockm*dropv / (volMl/1000) * ionMM;
}
