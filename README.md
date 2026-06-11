# Mineralização de água para café

Portal de cálculo de soluções-mãe para remineralizar água destilada/osmose,
voltado para café especial (coados e espresso). Uma solução-mãe fixa serve
qualquer volume — só muda o número de gotas.

## Abrir

Abra `index.html` no navegador. Sem dependências e sem build. As fontes vêm do
Google Fonts (precisa de internet para a tipografia exata; sem rede, o navegador
cai numa fonte do sistema e o portal continua funcionando).

Para publicar online de graça: **Settings → Pages → Branch: `main` / root**.
O portal fica em `https://SEU_USUARIO.github.io/agua-cafe/`.

## Cinco páginas

- `index.html` — construir água do zero (base destilada/osmose). O estado vive
  no `#hash` da URL (link compartilhável) e o último perfil/volume fica lembrado
  no navegador.
- `recomendador.html` — **café → água ideal**: escolha um café cadastrado (ou
  monte pelo processo + torra do pacote) e receba o perfil de água sob medida —
  quantas gotas de cada mineral, GH/KH/TDS e a aptidão de preparo (espresso/coado).
  Quem decide a água é o **processo**, não a variedade. Dá para **cadastrar os
  seus cafés** direto na página (ficam salvos no navegador), compartilhar a
  água de um café por link, **exportar/importar backup em JSON** e fazer
  **merge a partir de uma planilha pública do Google** (Arquivo → Compartilhar →
  Publicar na web → CSV): cadastre na planilha quando quiser e importe — linhas
  novas entram, existentes atualizam, e os ajustes finos feitos na página são
  preservados quando a planilha não traz os eixos.
- `kit.html` — lista de minerais, equipamentos e acessórios com links de compra.
- `avaliador.html` — avaliar uma água mineral de rótulo e corrigir até o alvo.
  Se a água já passa do alvo em dureza/alcalinidade (ou tem sódio/cloreto/TDS
  altos), o app **não recomenda** adicionar e explica o porquê — mineral só se
  adiciona, nunca se remove.
- `etiquetas.html` — escolher, dimensionar e imprimir as etiquetas dos frascos
  (com linhas de corte) para recortar e colar em cada conta-gotas.

As constantes químicas, os perfis **e as fórmulas** (GH/KH/TDS/gotas) ficam em
`data.js` (fonte única), carregado pelas páginas de cálculo. O banco de cafés e
o motor `café → água` ficam em `cafes.js`, carregado por `recomendador.html`
(cadastrar um café permanente = adicionar um objeto a `CAFES`; cafés pessoais
podem ser cadastrados pela própria UI). O site tem um `manifest.json` — dá para
instalar como app no celular — e **tema claro/escuro**: segue o sistema por
padrão, com botão na navegação para fixar claro ou escuro (a escolha fica
salva no navegador).

## Planilha do Google (modelo)

Para cadastrar cafés direto de uma planilha sua: crie uma aba com este
cabeçalho (só `nome` e `processo` são obrigatórias — copie a tabela abaixo e
cole no Sheets, que as células se separam sozinhas):

| nome | torrefador | processo | torra | acidez | corpo | aroma | notas | origem | variedade |
|------|------------|----------|-------|--------|-------|-------|-------|--------|-----------|
| Crazy Koji | Do Coado ao Espresso | koji | média | 8,5 | 5 | 10 | floral; hibisco; framboesa | Alta Mogiana/MG | Pau Brasil |
| Mr. Chocolate | Moka Clube | natural | média | 2 | 9 | 5 | chocolate; cremoso | Brasil · blend | Blend |
| Catuaí da feira | | lavado | | | | | | | |

Regras:

- **processo** aceita a chave (`lavado`, `koji`, `carbonica`…) ou o nome por
  extenso com acento ("Maceração carbônica"). **torra**: clara / média / escura
  (vazio = média).
- **acidez/corpo/aroma** (0–10, vírgula decimal ok) são opcionais: vazios, o
  café herda o DNA do processo+torra — e reimportar **preserva** o ajuste fino
  que você fez na página. Preenchidos, a planilha manda.
- **notas** separadas por `;` (a vírgula é separador do CSV).
- Publique com **Arquivo → Compartilhar → Publicar na web → (aba) → CSV** e
  cole o link na seção "Backup & planilha" do recomendador. Reimportar faz
  merge: linha nova cadastra, existente atualiza (id = nome+torrefador), nada
  duplica. ⚠ O link publicado é legível por quem o tiver.

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

`labels/` traz os 4 PNGs prontos para impressão (300 DPI, ~6×9 cm). Para imprimir
e colar nos frascos, use a página `etiquetas.html` (escolhe quais, tamanho, cópias
e linhas de corte).

Para regerar os PNGs: `pip install pillow` e `python labels.py`. Na primeira
execução o script baixa as fontes (Zilla Slab + DejaVu Sans Mono) para `fonts/`;
as massas dos sais são calculadas a partir das mesmas constantes do portal.

## Desenvolvimento

Vanilla, sem build. As constantes de química, os perfis e as fórmulas ficam em
`data.js` (fonte única). Os invariantes da química têm uma rede de segurança:
abra `tests.html` no navegador e confira o resumo verde antes de publicar
mudanças em `data.js`/`cafes.js`. Para o padrão de ambiente (Python via WSL,
validação com Chrome headless, publicação) e as regras do projeto, veja
`AGENTS.md`. Para encerrar um trabalho de forma consistente, use o comando
`/finalizar` (no Claude Code).

## Crédito

Engenharia reversa inspirada na calculadora de Álvaro Magri
(https://alvaromagri.com/remineralization). Regra escondida descoberta:
soluções equimolares e 1 gota = 0,1 mmol/L no lote-alvo. Este projeto usa uma
abordagem de solução fixa (uma receita serve todos os volumes).
