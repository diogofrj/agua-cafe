---
description: Finaliza o trabalho da sessão — consolida o contexto nos docs, garante o padrão de portabilidade, valida e faz commit + push.
---

Você está **encerrando uma sessão de trabalho** no projeto _Água para Café_.
Execute o checklist abaixo para que qualquer máquina, modelo ou sessão futura
consiga retomar sem atrito. Trabalhe em pt-BR.

## 1. Levante o que mudou nesta sessão
- Olhe `git status` / o diff e releia o que foi feito: arquivos novos, features,
  correções e decisões (inclusive as combinadas com o usuário).
- Decida o que disso precisa virar documentação durável.

## 2. Atualize os docs (só o que mudou — não invente)
- `AGENTS.md` — fonte da verdade **agnóstica de modelo**. Atualize "Arquivos",
  "NÃO faça", o modelo de química e "Ambiente de desenvolvimento" conforme o caso.
- `CLAUDE.md` — apenas ponteiros específicos do Claude Code; mantenha enxuto.
- `README.md` — visão de usuário (páginas, como rodar, etiquetas).
- Converta datas relativas em absolutas. Não duplique conteúdo entre os docs.

## 3. Garanta o padrão de portabilidade
- Constantes de química/perfis só em `data.js` (massas dos sais repetidas no
  `labels.py`). Nada de hardcode novo espalhado pelos HTMLs.
- `labels.py` portátil: caminhos relativos + download de fontes; `fonts/` no `.gitignore`.
- Python roda por **WSL** (`/mnt/c/...`), não pelo `python` nativo do Windows.
- Nada de framework/build/npm. Vanilla; cada HTML abre via `file://`.

## 4. Valide o que der para validar
- Mexeu em `labels.py`/`data.js`? Rode `python labels.py` (via WSL) e confira os
  PNGs em `labels/` (idealmente byte-idênticos: `git status` limpo nessa pasta).
- Mexeu em layout/HTML? Gere screenshot/PDF com Chrome headless (ver `AGENTS.md`).
  Lembre do artefato de DPI 125%: para overflow, meça `scrollWidth === clientWidth`.

## 5. Commit + push (sempre)
- Mensagem clara em pt-BR, terminando com a co-autoria do Claude.
- `git push origin main` — o GitHub Pages republica sozinho.

## 6. Memória durável (se surgiu algo)
- Fatos não-óbvios que ajudam sessões futuras → salve em memória; não salve o que
  os docs/o git já registram.

Ao final, **informe ao usuário**: o que mudou nos docs, o que foi validado e o
hash do commit publicado.
