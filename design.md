# Home Negócios Imobiliários — Design

Site institucional e vitrine de imóveis para a imobiliária **Home Negócios Imobiliários**. Plataforma web. Estética elegante e sofisticada: preto profundo, dourado e off-white, com fotografia de imóveis em destaque. Objetivo: transmitir confiança e alto padrão, permitindo que o visitante navegue, filtre e encontre imóveis, veja detalhes e entre em contato.

## Brand & Colors

Tokens definidos em `packages/web/src/web/styles.css` (tema escuro elegante como padrão).

| Token | Valor | Uso |
|-------|-------|-----|
| background | #0B0B0C | Fundo das páginas (preto profundo) |
| surface / card | #141416 | Cartões, seções elevadas |
| foreground | #F5F3EE | Texto principal (off-white) |
| mutedForeground | #A19E96 | Texto secundário |
| gold (primary) | #C6A15B | Acentos, botões, detalhes, linhas |
| goldSoft | #E3CB92 | Hover/realce do dourado |
| border | rgba(198,161,91,0.18) | Hairlines douradas sutis |

Uso do dourado com parcimônia: linhas finas, títulos de destaque, botões e ícones. Nunca em grandes áreas.

## Typography

- **Display / títulos**: Playfair Display (serifada, elegante) — headings, hero, nomes de imóveis.
- **Corpo / UI**: Montserrat — parágrafos, labels, navegação, preços.
- Carregadas via Google Fonts em `index.html`. Hierarquia por tamanho/peso, entrelinha generosa, tracking levemente aberto em labels (uppercase).

## Pages

- **Home** (`pages/index.tsx`) — hero fullscreen com imagem, barra de busca rápida, imóveis em destaque, seção de diferenciais, CTA de contato.
- **Imóveis** (`pages/imoveis.tsx`) — listagem com filtros (finalidade, tipo, cidade, quartos, faixa de preço) e grid de cartões.
- **Detalhes do imóvel** (`pages/imovel.tsx`, rota `/imoveis/:id`) — galeria, características, descrição, mapa/localização textual, botão de contato/WhatsApp.
- **Sobre** (`pages/sobre.tsx`) — história, missão, números, equipe.
- **Contato** (`pages/contato.tsx`) — formulário e informações de contato.

## Components

- `Navbar` — transparente sobre o hero, fica sólida ao rolar; logo textual "HOME" + tagline dourada.
- `Footer` — escuro, links, contato, redes.
- `PropertyCard` — foto, badge finalidade, preço em dourado, specs (quartos/banheiros/área).
- `Layout` — navbar + conteúdo + footer.

## Key Flows

1. Home → busca/filtro → listagem → detalhe → contato/WhatsApp.
2. Contato direto pelo formulário (grava lead via API).

## Architecture

- API oRPC: `properties` (list com filtros, get by id) e `leads` (criar contato). Dados de imóveis exemplo via seed.
- Query hooks em `queries/`. Motion via `motion/react` para reveals no load.
