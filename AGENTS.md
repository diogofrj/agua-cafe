# AGENTS.md — Água para Café

Site estático e sem dependências para mineralizar água destilada/osmose para café especial. HTML/CSS/JS puro: **sem build, sem backend, sem framework**. Hospedado no GitHub Pages. Edite os arquivos direto e dê push na `main`.

## Rodar / publicar
- Pré-visualizar: abra qualquer `.html` direto no navegador, ou `python3 -m http.server` e acesse http://localhost:8000
- Publicar: ao terminar, **sempre** `commit` + `push` na `main` → GitHub Pages serve a partir da raiz (`/`) e republica sozinho.

## Ambiente de desenvolvimento (qualquer máquina ou modelo)
Padrão para uma nova sessão/modelo retomar sem atrito:
- **Python roda pelo WSL**, não pelo `python` nativo do Windows (costuma ser só o stub da Microsoft Store). Ex.: `wsl bash -lc "cd /mnt/c/.../agua-cafe && python3 labels.py"`. Pillow: `pip install --user --break-system-packages Pillow` (PEP 668 bloqueia o pip simples).
- **Validar o visual sem abrir o navegador**: Chrome headless.
  - Screenshot: `chrome --headless=new --screenshot=out.png "--window-size=W,H" file:///.../pagina.html`
  - Impressão (aplica `@media print`): `--print-to-pdf=out.pdf`; rasterize com `pdftoppm` (poppler, no WSL).
  - ⚠ Em telas Windows a 125%, o viewport CSS do headless sai ~1,25× a largura da janela e a captura **corta a direita** — é artefato, não overflow. Para checar overflow de verdade, meça `document.documentElement.scrollWidth === clientWidth`.
- **Validar a química sem navegador visível**: abra `tests.html` (headless serve) e confira o resumo verde — o `document.title` carrega ✓/✗ para inspeção automatizada.
- **Finalizar a sessão**: rode `/finalizar` (atualiza docs → valida → commit+push). Definição em `.claude/commands/finalizar.md`.

## NÃO faça
- Não adicione framework, bundler, npm ou etapa de build. Mantenha vanilla.
- Não unifique o CSS num arquivo compartilhado — cada página carrega o próprio `<style>` de propósito, para abrir sozinha via `file://`.
- Não duplique as constantes de química/perfis nos HTMLs — elas vivem em `data.js` (o `labels.py` só repete as massas dos sais). Mudou calibração/perfil/massa? Mude em `data.js`.
- Não busque preços ao vivo de Shopee/iHerb (CORS + anti-bot). Os preços do `kit.html` são snapshots manuais e datados. Nunca invente nem faça scraping de preço.
- Não afirme que os links do `kit.html` não são patrocinados — há links de afiliado (Shopee/iHerb). Use disclosure honesto.
- Não reintroduza diluição no avaliador (ver regras de química).

## Arquivos
- `index.html` — construir do zero (presets + ppm livre → receita das soluções + gotas). Estado no `#hash` (compartilhável); último perfil/volume lembrado em `localStorage` (`aguacafe.index`).
- `recomendador.html` — escolher um café (ou montar por processo+torra) → alvo de água sob medida, gotas e aptidão (espresso/coado). Linka de volta ao `index.html` via `#hash`. Tem hash próprio compartilhável (`#cafe=<id>` ou `#proc=…&torra=…`, mais `a/c/ar/v`) e cafés do usuário em `localStorage` (`aguacafe.cafes`; o ajuste de eixos **e o toque de sódio** ficam gravados no café custom). Tem uma alavanca opcional de **sódio** (0–10 ppm, default 0) que sobrescreve o `na` por cima do `alvoPpm`. Backup: exportar/importar JSON (merge por id), **modelo CSV** para iniciar a planilha (botão baixa cabeçalho + cafés do usuário, com BOM p/ Excel) e **merge de planilha do Google** (aceita o link normal — `sheetCsvUrl()` converte para o endpoint `gviz` em CSV, que tem CORS; o link "Publicar na web" em CSV passa intocado; lembrado em `aguacafe.sheet`; id derivado de nome+torrefador; linha sem eixos preserva o ajuste local). Requer planilha compartilhada com "qualquer pessoa com o link" e só funciona via http(s) — `file://` bloqueia o fetch.
- `kit.html` — lista de compras (minerais, equipamentos, preços, links). Conteúdo estático.
- `avaliador.html` — avaliar rótulo de água mineral e corrigir até o alvo (sem diluir). Os "exemplos" são **arquétipos ilustrativos**, não marcas — não cadastre rótulos de marcas reais sem fonte.
- `etiquetas.html` — escolher tamanho/cópias e imprimir as etiquetas (com linhas de corte) para colar nos frascos.
- `data.js` — fonte única de massas molares, calibração, perfis **e das funções de química** (`ghPpm`/`khPpm`/`hco3FromCations`/`tdsOf`/`dropsExact`/`ppmFromDrops`); carregado pelas páginas de cálculo **antes** do script inline. Não re-inline os fatores (4,118 · 2,497 · 0,8201 etc.) nos HTMLs.
- `cafes.js` — banco de cafés (seed) + motor `café → água`; carregado por `recomendador.html` **depois** do `data.js` (usa `M`, `KEYS`).
- `tests.html` — rede de segurança da química: abre via `file://` e confere os invariantes de `data.js` + `cafes.js` (calibração, fatores GH/KH, extremos do motor vs. presets, regras de espresso, banco de cafés). **Confira tudo verde antes de publicar** mudança em química/perfis/motor.
- `theme.js` — tema claro/escuro/auto, compartilhado (carregado no `<head>` de toda página, depois do `<style>`). Modo salvo em `localStorage` (`aguacafe.theme`); botão = elemento `#themebtn` na nav. O CSS continua por página (regra do CSS não muda): cada `<style>` traz o bloco `html[data-theme=dark]{…}` com as overrides das vars.
- `manifest.json` + `icon.svg` — PWA mínimo (instalável no celular; sem service worker, de propósito — as fontes vêm do Google Fonts).
- `labels.py` — gera os 4 PNGs de etiqueta (Pillow; baixa as fontes sozinho na 1ª execução).
- `labels/` — PNGs gerados. `fonts/` — TTFs baixadas (no `.gitignore`).

## Modelo de química (a UI depende disto — não altere sem motivo)
Soluções-mãe a **0,5 mol/L**. Gota = **0,062 mL** (calibrado em 17 gotas/mL).
Cada gota adiciona `STOCKM*DROPV` mmol do íon (= 0,031 mmol).

Massas molares (g/mol) — íons: Mg 24,305 · Ca 40,078 · Na 22,990 · K 39,098 · HCO₃ 61,017 · SO₄ 96,06 · Cl 35,453.
Sais: MgSO₄·7H₂O 246,47 · CaCl₂·2H₂O 147,01 · NaHCO₃ 84,007 · KHCO₃ 100,115.
Estes números vivem em `data.js` (fonte única dos HTMLs); o `labels.py` repete só as massas dos sais e calcula as gramas a partir delas.

Fórmulas (implementadas uma vez em `data.js` — use as funções, não os números):
- `gotas = (ppm_íon / MM_íon × volume_L) / (STOCKM × DROPV)` → `dropsExact()` / inversa `ppmFromDrops()`
- `gramas no frasco = STOCKM × volume_frasco_L × MM_sal`
- `GH (ppm CaCO₃) = mg_ppm×4,118 + ca_ppm×2,497` → `ghPpm()` (fatores derivados de `MM_CACO3`)
- `KH (ppm CaCO₃) = HCO₃_ppm × 0,8201` → `khPpm()`
- `HCO₃ de um bicarbonato = cátion_ppm / MM_cátion × 61,017` → `hco3FromCations()`
- TDS aproximado de um alvo `{mg,ca,na,k}` (soma os contra-íons dos sais) → `tdsOf()`

Quatro minerais → quatro frascos separados: Magnésio (MgSO₄·7H₂O), Cálcio (CaCl₂·2H₂O), Sódio (NaHCO₃), Potássio (KHCO₃).
Preparo do frasco: dissolver e **completar até a marca**. NUNCA "100 − massa" (o sal ocupa volume).

## Modelo café → água (`cafes.js` / `recomendador.html`)
Quem decide a água é o **processo + torra**, NÃO a variedade (o mesmo Mundo Novo dá xícaras opostas). Esses dois definem três eixos 0–10 (acidez, corpo, aroma/fermentação); o motor traduz em ppm para **coado**:
- `Mg = 5 + 4·a + 4·ar` (acidez e aroma) · `Ca = 2 + 23·c` (corpo) · `K = max(6, 14 + 22·c − 8·a − 6·ar)` (buffer sobe com corpo, desce com acidez/aroma). `a,c,ar` = eixos/10.
- Coeficientes calibrados para os extremos baterem com os `PRESETS` do `data.js`. Mexeu nos presets? Reconfira os extremos aqui.
- Sódio fica 0 **no motor** (`alvoPpm`) — é a alavanca de corpo do espresso. No coado ele é um **toque opcional do usuário**: o `recomendador.html` tem uma alavanca de sódio (0–10 ppm, default 0, gravada no café custom em `na`, no hash `&na=` e no `localStorage`) que sobrescreve o `na` por cima do `alvoPpm`; o `index.html` ganhou o preset opt-in `🧂 Coado + toque de sódio`. O motor **não muda** (segue `na:0`); sódio suprime amargor e abre aroma, mas soma KH (não exagere). Espresso continua sendo só um **selo de aptidão** (`aptidao()`), não um segundo caminho químico — para a água de espresso, manda pro perfil Espresso do `index.html`.
- `PROCESSOS` vai do lavado ao descafeinado. Os fermentados específicos (anaeróbico, carbônica, láctica, koji) têm DNA próprio e a família inteira (lista `FERMENTADOS`, inclui o `fermentado` genérico) recebe o −2 de aptidão para espresso; `dupla` fica de fora (fermentação de limpeza). **Não renomeie chaves existentes** — cafés salvos no `localStorage` referenciam essas chaves.
- Eixos por café são editáveis na UI (override): o processo dá o ponto de partida, o usuário corrige se o pacote surpreender.

## Regras de química (regressão aqui = bug — `tests.html` cobre as testáveis)
- Magnésio e Cálcio nunca no mesmo frasco — sulfato + cálcio precipita CaSO₄.
- Sódio e Potássio são ambos bicarbonato → somam alcalinidade; nunca conte em dobro. No `index.html`, usar os dois é legítimo (o preset Espresso divide) — o aviso só dispara quando o KH resultante passa de 45.
- Espresso: o **cloreto** (do CaCl₂) corrói; o **cálcio** incrusta. Perfil de espresso = sem cálcio, corpo via sódio, buffer médio.
- Sódio no coado é um **toque opcional** (supressão de amargor / abre aroma), não algo embutido no motor: alavanca no recomendador (default 0) + preset opt-in no index. NaHCO₃ e KHCO₃ somam KH — um toque pequeno (3–8 ppm); o aviso de buffer dispara quando o KH passa de 45.
- Gesso (CaSO₄) não vira solução-mãe concentrada (solubilidade ~2,4 g/L) — só dose direto em coado.
- Avaliador: só **adiciona**, nunca remove. Se a água excede o alvo (dureza/alcalinidade) ou tem Na/Cl/TDS altos → rejeita e explica o porquê. Sem diluição. Os limites de alerta/veto vivem no objeto `LIM` (Na 25 · Cl 30 · SO₄ 50 · TDS 400 mg/L) — alerta e veto usam o **mesmo** número.

## Tokens de design (vars CSS, manter consistente entre páginas)
Claro (`:root`): paper `#F2ECE0` · surf `#FAF6EE` · ink `#2B211A` · accent café `#7A4B22`; minerais Mg `#1E6F8E` · Ca `#3F7D43` · Na `#C07A2B` · K `#B0463A`.
Escuro (`html[data-theme=dark]`): paper `#1B1511` · surf `#241D17` · ink `#EDE4D6` · café `#C98F55`; minerais Mg `#3E9DC2` · Ca `#69AC6F` · Na `#D69A52` · K `#CE7164`.
Regras do tema: o claro é o padrão do `:root`; o escuro é só override de vars (+ `color-scheme`). Componente novo com cor **hardcoded** (avisos, tags, selos) precisa de override `html[data-theme=dark] .classe{…}` — prefira usar as vars. A impressão é sempre clara (o `theme.js` força no `beforeprint`).
Fontes: Fraunces (display), Hanken Grotesk (corpo), JetBrains Mono (números, via Google Fonts `@import`).
Todo texto da UI em **pt-BR**; números no formato pt-BR (vírgula decimal, `toLocaleString('pt-BR')`).

## Gerar as etiquetas (`labels.py`)
Portátil: caminhos relativos ao próprio arquivo e download automático das fontes.

```
pip install pillow
python labels.py
```

Na primeira execução baixa as TTFs (Zilla Slab do `google/fonts` + DejaVu Sans Mono) para `fonts/` e gera os PNGs em `labels/` (`magnesio/calcio/sodio/potassio.png`). `fonts/` está no `.gitignore` — não comite as fontes. Sem rede na primeira vez, o download falha; depois disso roda offline.
