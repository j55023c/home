IDEA.md — Estado do projeto Home
O que é

Site + painel administrativo da Home Negócios Imobiliários (imobiliária da mãe do usuário), servindo como vitrine pública de imóveis e como portfólio de freelance/vibecoding do usuário. Repo: github.com/j55023c/home.

Como o usuário trabalha

Não mexe em código diretamente. Quer arquivos prontos — caminho exato + o que foi feito + próximo passo. Prefere substituição completa de arquivo a diff/patch fatiado. Não gosta de "vai-e-vem": consolidar decisões numa mensagem em vez de checkpoint a cada linha.

Arquitetura
Frontend do site: React/Tailwind, originado do Base44 (removido), depois substituído por um export mais completo feito na Runable — ainda pendente de inspeção de código (ver "Onde parou").
Admin: vive em admin/ na raiz do mesmo repo, com deploy próprio. Já está pronto e funcionando — não foi tocado pela troca de frontend.
Backend de dados: Supabase real (ainda não conectado ao frontend). Schema alvo: tabelas imoveis, imovel_fotos, corretoras, com filtro publicado = true e ocultação de endereço completo nos imóveis públicos.
Estrutura de componentes (era Base44, deve valer também pro export Runable, a confirmar): Navbar.jsx, Hero.jsx, Narrative.jsx, Services.jsx, PropertyGallery.jsx, PropertyCard.jsx, Contact.jsx, Footer.jsx.
Linha do tempo
Decisão de usar o código do Base44 como ponto de partida em vez do HTML/CSS puro, subir no GitHub, editar junto via chat.
Mapeamento completo do repo — achado: App.jsx inteiro envolto num AuthProvider do Base44, travando o site público atrás de login (bug estrutural grave, não intencional).
Limpeza total do Base44: 9 arquivos deletados (auth, SDK, telas de login/registro, pasta base44/), App.jsx e PageNotFound.jsx reescritos sem auth, vite.config.js sem o plugin Base44 (com resolve.alias declarado manualmente no lugar), package.json sem as deps e renomeado pra home. Build validado: 1659 módulos, zero erro.
Pacote de entrega gerado (arquivos + manifesto de exclusão + LEIA-ME.md) pro usuário aplicar localmente e dar push.
Admin ficou pronto nesse meio tempo, em paralelo, na pasta admin/.
Usuário trocou de fornecedor de frontend: em vez de seguir editando o derivado do Base44, conseguiu um export "mais completo e bonito" na Runable.
Antes de aplicar, foi levantado o risco de o Runable ter o mesmo problema do Base44 (SDK/auth proprietário embutido) — ainda não inspecionado.
Onde parou exatamente
Plano de substituição confirmado: preservar admin/ intacto, substituir apenas o restante da raiz pelo export da Runable.
Pendente: usuário vai subir um zip do export da Runable no Drive para inspeção de código antes de qualquer substituição ser aplicada.
Frontend do site (Base44-limpo) ainda não está conectado ao Supabase — essa etapa (Home consumindo dados reais, publicado = true, endereço oculto) foi adiada até a poeira da troca de frontend assentar.
Formato do endereço no Footer/Contato: ainda em aberto, decisão institucional adiada.
Backlog pendente
Inspecionar o export da Runable (SDK proprietário? auth travada? chamadas escondidas pra API deles?) assim que o zip chegar.
Aplicar a substituição de frontend preservando admin/.
Conectar Home/PropertyGallery/PropertyCard ao Supabase real.
Decidir texto da seção "Quem somos" e layout do Hero/busca.
Definir formato do WhatsApp de contato (link fixo vs algo mais elaborado).
Decidir formato do endereço no Footer.
Favicon e links de redes sociais no Footer (rápido, isolado, zero dependência).
Confirmar se a estrutura de componentes do Base44 (Navbar/Hero/PropertyGallery/etc.) se mantém ou muda com o export da Runable.
Armadilhas conhecidas
Nenhum conector de GitHub disponível no diretório — acesso ao repo é via bash_tool (clone direto, github.com/codeload.github.com liberados na allowlist de rede), não via MCP.
Cuidado com "substituir tudo" de forma literal (git rm -rf . antes do push, upload de pasta que sobrescreve a raiz inteira) — isso levaria a pasta admin/ junto.
O Base44 escondia resolve.alias do @/ dentro do próprio plugin de build — ao remover, isso teve que ser declarado manualmente no vite.config.js. Se a Runable usar um padrão parecido (plugin fazendo mágica de config escondida), o mesmo tipo de quebra silenciosa pode aparecer.
URLs de imagem media.base44.com (Hero/Narrative/PropertyCard) foram deixadas propositalmente — caem sozinhas quando o Supabase entrar com fotos reais; não vale a pena trocar duas vezes.
