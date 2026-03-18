# FitManager

O FitManager Pro é um sistema de gerenciamento para academias e personal trainers, composto por um backend em **Java (Spring Boot)** e um frontend em **HTML, CSS e JavaScript**.

## Requisitos

Para rodar este projeto, você precisará ter:

1. **Java 17** (JDK).
2. **PowerShell** (nativo do Windows, usado para executar o script de inicialização).
3. Conexão com a internet (para que o Maven baixe as dependências na primeira execução).

## Como Rodar

O projeto possui um script automatizado que prepara tudo e sobe o servidor.

1. Abra a pasta do projeto (`FitManager`).
2. Execute o arquivo de inicialização da seguinte forma:
   - Clique com o botão direito sobre o arquivo `start.ps1` e escolha **"Executar com o PowerShell"**.
   - **OU** abra o terminal (PowerShell) nesta pasta e digite:
     ```powershell
     .\start.ps1
     ```

### O que o script faz?
- Sincroniza os arquivos da pasta `frontend` para dentro da estrutura do `backend`.
- Inicia o servidor Spring Boot em um novo processo do PowerShell.
- Aguarda alguns segundos e abre o navegador automaticamente na página inicial do projeto (`http://localhost:8080`).

## Acesso Rápido
Uma vez iniciado o servidor, você também as poderá acessar as seguintes URLs diretamente:
- **Página Inicial:** `http://localhost:8080/index.html`
- **Painel:** `http://localhost:8080/dashboard.html`
- **Área de Alunos:** `http://localhost:8080/students.html`

Para encerrar a aplicação, basta fechar a janela do script e a janela adicional do PowerShell que mantém o Java (Spring Boot) rodando.
