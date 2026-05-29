# Mineralização de água para café

Portal de cálculo de soluções-mãe para remineralizar água destilada/osmose,
voltado para café especial (coados e espresso). Uma solução-mãe fixa serve
qualquer volume — só muda o número de gotas.

## Abrir

Abra `index.html` no navegador. Sem dependências, sem build, tudo offline.

Para publicar online de graça: **Settings → Pages → Branch: `main` / root**.
O portal fica em `https://SEU_USUARIO.github.io/agua-cafe/`.

## O que ele faz

- Perfis prontos (doçura & acidez, equilibrado, brilhante, encorpado, espresso sem cálcio).
- Edição livre dos íons-alvo: Mg, Ca, Na, K (ppm).
- Calcula GH, KH e TDS resultantes.
- Receita das 4 soluções-mãe (g por 100 mL) — fixas, dependem só da concentração.
- Quantas gotas pingar por volume, com o **ppm real após arredondamento**.
- Troca para mL de pipeta automaticamente em volumes grandes.
- Calibração de gota e concentração ajustáveis.

## Os 4 minerais

| Mineral   | Sal           | g / 100 mL (0,5 M) | Função              |
|-----------|---------------|--------------------|---------------------|
| Magnésio  | MgSO₄·7H₂O    | 12,32              | doçura + acidez     |
| Cálcio    | CaCl₂·2H₂O    | 7,35               | corpo / estrutura   |
| Sódio     | NaHCO₃        | 4,20               | corpo / buffer      |
| Potássio  | KHCO₃         | 5,01               | buffer limpo        |

Método: dissolver em ~70 mL de água destilada e **completar até a marca de 100 mL**
(não somar "100 − massa": o sal ocupa volume).

## Notas de química

- Magnésio e cálcio não vão no mesmo frasco: o sulfato do Mg + o cálcio
  precipitam como CaSO₄. Por isso 4 frascos separados.
- Sódio e potássio são os dois bicarbonatos — somam alcalinidade, não dobre.
- Espresso: o que corrói é o **cloreto** (do CaCl₂), não o cálcio em si;
  o cálcio causa **incrustação**. Perfil de espresso sem cálcio tira corpo do
  sódio e mantém um buffer médio que protege o metal.
- Sulfato de cálcio (gesso) não vira solução-mãe concentrada (solubilidade ~2,4 g/L).

## Etiquetas

`labels/` traz os 4 PNGs prontos para impressão (300 DPI, ~6×9 cm).
Para regerar: `python3 labels.py` (precisa de Pillow e das fontes Zilla Slab).

## Crédito

Engenharia reversa inspirada na calculadora de Álvaro Magri
(https://alvaromagri.com/remineralization). Regra escondida descoberta:
soluções equimolares e 1 gota = 0,1 mmol/L no lote-alvo. Este projeto usa uma
abordagem de solução fixa (uma receita serve todos os volumes).
