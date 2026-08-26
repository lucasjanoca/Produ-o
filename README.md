# 📊 Produção — Painel Operacional

> Painel web para acompanhamento visual de produção e desempenho operacional.

O projeto organiza informações de produção em uma interface pensada para consulta rápida, uso em TV e atualização por uma área administrativa protegida.

## 🌐 Projeto ao vivo

**[Abrir o painel no GitHub Pages](https://lucasjanoca.github.io/Produ-o/)**

## ✨ Recursos

- produção diária e semanal;
- indicadores e rankings;
- histórico de resultados;
- avisos e páginas extras para apresentação;
- interface para TV/tela grande;
- área administrativa com autenticação;
- upload controlado de imagens;
- atualização de metas e configurações do painel.

## 🔐 Segurança

A área administrativa possui uma lista explícita de usuários autorizados no banco. Uma conta autenticada no Supabase, sozinha, não recebe permissão para alterar os dados do painel.

A criação de novos acessos passa por uma função de servidor protegida, e as operações de escrita são verificadas por Row Level Security (RLS). Arquivos enviados pelo painel também usam políticas próprias de Storage.

O painel público permanece somente para visualização; alterações exigem uma conta administrativa autorizada.

## 🛠️ Tecnologias

`HTML5` · `CSS3` · `JavaScript` · `Supabase` · `GitHub Pages`

## 🧪 Fluxo de desenvolvimento

- `main` — versão publicada;
- `dev` — desenvolvimento e validação;
- GitHub Actions — checagens de estrutura e segurança antes da publicação.

## 📁 Arquivos principais

- `index.html` — painel de apresentação;
- `admin.html` — interface administrativa;
- `js/admin.js` — funções administrativas;
- `js/admin-security.js` — validação adicional de acesso e criação segura de contas;
- `js/config.js` — configuração pública do frontend;
- `.github/workflows/quality-check.yml` — auditoria automática.

## 🧠 Objetivo

Este projeto nasceu de uma necessidade prática de operação e evoluiu para um sistema focado em visualização de dados, produtividade e controle de acesso.

---

**Projeto mantido como parte do portfólio de soluções web da InfoTech.io.**
