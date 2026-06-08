# CLAUDE.md

@AGENTS.md

## Específico do Claude Code
- Site estático: prefira editar os arquivos direto, sem scaffolding.
- Não há build. Para verificar: abra o `.html`, rode `python3 -m http.server`, ou gere screenshot/PDF com Chrome headless (ver "Ambiente de desenvolvimento" no `@AGENTS.md`).
- Python é via **WSL**, não o `python` nativo do Windows (stub da Store).
- Ao terminar um trabalho, rode **`/finalizar`** (atualiza docs → valida → commit+push na `main`; o GitHub Pages republica sozinho).
- Mantenha este arquivo enxuto: regras não-óbvias estão no `@AGENTS.md`; não duplique aqui.
