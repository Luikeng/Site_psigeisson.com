# Como rodar o Site Arte Mental no seu Computador

Este projeto foi criado no AI Studio e agora voce pode edita-lo e roda-lo localmente.

## 1. Requisitos
Voce precisa ter instalado no seu Windows:
* **Node.js** (versao 18 ou superior): [Baixar aqui](https://nodejs.org/)
* **Git**: [Baixar aqui](https://git-scm.com/)

## 2. Como rodar pela primeira vez
1. Extraia o arquivo ZIP em uma pasta.
2. Abra o **Prompt de Comando (CMD)** ou o **PowerShell** dentro dessa pasta.
3. Digite o comando abaixo para instalar as dependencias:
   ```bash
   npm install
   ```
4. Para abrir o site no seu navegador, digite:
   ```bash
   npm run dev
   ```
5. O site estara disponivel em: `http://localhost:3000` (ou o link que aparecer no terminal).

## 3. Como enviar para o GitHub
Sempre que voce fizer uma mudanca e quiser que ela apareca no seu site oficial:
1. Clique duas vezes no arquivo **`atualizar_site.bat`**.
2. Digite o que voce mudou quando o script pedir.
3. Se ele detectar algum conflito, ele perguntara se voce quer "Forcar o Envio" (digite **S** e de Enter).
4. Pronto! O GitHub Actions vai cuidar do resto automaticamente.

---
**Dica:** Se for a primeira vez que voce usa o Git no PC, voce precisara rodar estes dois comandos no terminal uma unica vez para se identificar:
```bash
git config --global user.email "seu-email@exemplo.com"
git config --global user.name "Seu Nome"
```
