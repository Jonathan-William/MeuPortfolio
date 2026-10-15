<div align="center">

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│      ██╗  ██████╗  ███╗   ██╗                              │
│      ██║ ██╔═══██╗ ████╗  ██║                              │
│      ██║ ██║   ██║ ██╔██╗ ██║   JONATHAN.DEV               │
│ ██   ██║ ██║   ██║ ██║╚██╗██║   full stack & cyber         │
│ ╚█████╔╝ ╚██████╔╝ ██║ ╚████║                              │
│  ╚════╝   ╚═════╝  ╚═╝  ╚═══╝   status: OPEN TO WORK ●     │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

![HTML5](https://img.shields.io/badge/HTML5-0c0c0c?style=for-the-badge&logo=html5&logoColor=ff3b4a)
![CSS3](https://img.shields.io/badge/CSS3-0c0c0c?style=for-the-badge&logo=css3&logoColor=ff3b4a)
![JavaScript](https://img.shields.io/badge/JavaScript-0c0c0c?style=for-the-badge&logo=javascript&logoColor=ff3b4a)
![Linux](https://img.shields.io/badge/Linux-0c0c0c?style=for-the-badge&logo=linux&logoColor=ff3b4a)
![Zero deps](https://img.shields.io/badge/deps-0-c8102e?style=for-the-badge)

**Portfólio pessoal em estética de terminal: HTML, CSS e JavaScript puros, sem build e sem framework.**

</div>

---

## `> boot`

```console
> inicializando jonathan.dev...
> carregando módulos: frontend [ok] backend [ok] segurança [ok]
> verificando integridade dos sistemas...
> estabelecendo conexão segura...
> acesso concedido.
```

## `$ whoami`

```console
jonathan@lab:~$ whoami
estagiário de tecnologia · ADS

jonathan@lab:~$ cat foco.txt
redes, hardening, OSINT e infraestrutura

jonathan@lab:~$ ls ferramentas/
wireshark  nmap  tcpdump  monster.energy
```

Estudante de **Análise e Desenvolvimento de Sistemas** e estagiário de tecnologia na **Liberty Pay**. Gosto de aprender na prática, entendendo como as coisas quebram para construí-las melhor.

## `$ ./start.sh`

O site é estático, então qualquer servidor HTTP serve:

```bash
git clone https://github.com/Jonathan-William/MeuPortfolio.git
cd MeuPortfolio
npx http-server@14.1.1 . -p 5180 -c-1
```

Depois, abra `http://localhost:5180`.

> [!TIP]
> A tela de boot aparece **uma vez por sessão** do navegador. Para vê-la de novo, abra uma aba anônima.

## `$ tree -L 2`

```console
MeuPortfolio/
├── index.html          # estrutura e textos em português
├── style.css           # tokens de cor, layout, animações e responsivo
├── script.js           # boot, partículas, scroll, terminal, palette, i18n
├── config.js           # dados pessoais, terminal, EmailJS e tradução EN
└── assets/
    ├── avatar.webp     # personagem do hero
    ├── favicon.svg
    └── icons/          # ícones próprios (ex.: cybersec.svg)
```

## `$ lsmod | grep features`

| Módulo | O que faz |
|---|---|
| `boot.sh` | Log de terminal linha a linha antes do site aparecer |
| `decrypt` | Título do hero se "descriptografa" e passa por um glitch RGB |
| `particles` | Partículas vermelhas flutuando em canvas, pausadas com a aba oculta |
| `reveal` | Blocos sobem ao rolar; cards de projeto revelados por máscara, em cascata |
| `tilt-3d` | Cards inclinam seguindo o mouse, com brilho e cantoneiras de mira |
| `lab-term` | Terminal que digita os comandos ao entrar na tela, com scanline CRT |
| `cmdk` | Command palette com comandos de navegação (tecla `/`) |
| `theme` | Tema claro/escuro salvo no navegador, sem flash no carregamento |
| `i18n` | Português e inglês com um clique |
| `a11y` | Respeita `prefers-reduced-motion`, foco visível e navegação por teclado |

## `$ help`

Aperte **`/`** em qualquer lugar do site (ou clique em **`>_`**) para abrir o terminal:

```console
$ help
comandos: sobre · projetos · seguranca · stack · curriculo · contato · skills ·
whoami · github · linkedin · tema · idioma · sudo hire jonathan · clear · exit

$ sudo hire jonathan
permissão concedida.
```

## `$ nano config.js`

| O quê | Onde |
|---|---|
| Textos em português | `index.html` |
| Textos em inglês | `config.js` → bloco `en` (chaves iguais aos atributos `data-i18n`) |
| E-mail, GitHub, LinkedIn, terminal | `config.js` |
| Projetos | `index.html`: um `<article class="proj-item">` por projeto; o `data-tag` vira filtro. Cards com `data-fun` são de brincadeira e não entram na contagem |
| Barras de habilidade | `index.html`, atributo `data-pct` (0–100) |
| Ícones da stack | `data-icon` (nome no [devicon](https://devicon.dev/)) ou `data-icon-src` (arquivo próprio) |
| Personagem | `assets/avatar.webp` (fundo transparente) |

## `$ systemctl status emailjs`

```diff
- ● emailjs.service — envio direto do formulário
-    Active: inactive (dead)  aguardando configuração
```

Hoje, "Enviar mensagem" abre o app de e-mail do visitante com a mensagem pronta para `williamjonathan977@gmail.com`. Para o envio ir direto para o Gmail:

1. Crie uma conta gratuita em [emailjs.com](https://www.emailjs.com/). O plano grátis dá 200 e-mails por mês.
2. Em **Email Services**, conecte o Gmail e anote o **Service ID**.
3. Em **Email Templates**, crie um modelo com `{{name}}`, `{{email}}`, `{{subject}}`, `{{message}}` e `{{time}}`. Anote o **Template ID**.
4. Em **Account → API Keys**, copie a **Public Key**.
5. Preencha no `config.js`:
   ```js
   emailjs: { publicKey: 'SUA_PUBLIC_KEY', serviceId: 'SEU_SERVICE_ID', templateId: 'SEU_TEMPLATE_ID' },
   ```
6. No painel do EmailJS, restrinja o envio ao domínio onde o site for publicado.

## `$ cat CREDITS`

Layout e animações inspirados no portfólio de [Lohane](https://llohs.github.io/llohs-dev/), reimplementados do zero com paleta, conteúdo e personagem próprios.

## `$ ping jonathan`

```console
PING jonathan.dev: 3 rotas disponíveis
64 bytes from email:    williamjonathan977@gmail.com
64 bytes from github:   github.com/Jonathan-William
64 bytes from linkedin: linkedin.com/in/jonathan-william-bonifacio
--- 0% packet loss, respondo o mais breve possível ---
```

<div align="center">

```
jonathan@lab:~$ exit
logout — movido a curiosidade e Monster.
```

</div>
