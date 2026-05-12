# App Delivery (Dashboard para lojistas)

Bem-vindo à documentação do frontend do painel do lojista (dashboard). Este projeto foi construído utilizando React (com Vite) e segue uma arquitetura limpa e componentizada focada em fácil manutenção e escalabilidade.

## Arquitetura e Estrutura de Pastas

O projeto utiliza a arquitetura baseada em "features". Isso significa que tudo relacionado a uma funcionalidade específica (como "produtos" ou "pedidos") vive dentro da sua própria pasta, em vez de agrupar todos os componentes do sistema num lugar só.

A pasta principal de código é a `src/`. Dentro dela, os diretórios mais importantes são:

### 1. src/layouts/
Aqui ficam os componentes estruturais globais, responsáveis por dar a cara geral da aplicação.
- MainLayout.tsx: O esqueleto principal que segura a barra lateral, o cabeçalho e renderiza a página ativa no centro.
- components/Header.tsx: O topo da página, que possui o controle de voltar à loja e o ícone do menu no mobile.
- components/Sidebar.tsx: O menu de navegação lateral para pular entre Dashboard, Pedidos, Produtos e Cupons.

### 2. src/features/
Este é o coração do projeto. Cada subpasta aqui representa uma tela ou módulo do sistema.

#### features/dashboard/
- Dashboard.tsx: A tela principal ao fazer login. Ela é responsável por exibir os indicadores e painéis de resumo de vendas e os últimos pedidos da loja.

#### features/orders/
Responsável por toda a parte de "Gestão de Pedidos" (o fluxo da cozinha).
- Orders.tsx: A tela principal que orquestra as três colunas do Kanban (Novos pedidos, Em preparo, Prontos). Ele mantém a lista de pedidos no seu estado (State) e as lógicas de mover os pedidos de uma coluna para a outra.
- components/OrderCard.tsx: O componente isolado responsável unicamente por desenhar o cartão de um pedido (com itens, preço, nome do cliente e ícones). Ele recebe os dados de um pedido e notifica o Orders.tsx caso um botão seja clicado.

#### features/products/
Responsável pelo catálogo/cardápio do restaurante.
- Products.tsx: A tela principal que guarda a lista de produtos (State) e controla se o modal de criação está aberto ou fechado.
- components/ProductTable.tsx: Componente que recebe a lista de produtos e desenha a tabela organizada.
- components/ProductFormModal.tsx: O pop-up (Modal) de formulário responsável por coletar dados do usuário para Cadastrar ou Editar um produto.

#### features/coupons/
Responsável pelas ofertas e descontos.
- Coupons.tsx: A tela raiz dos cupons. Controla o estado de abertura do modal e a lista de cupons.
- components/CouponTable.tsx: Renderiza as informações em formato de tabela, possuindo dentro de si os botões de ligar/desligar (toggle) o status de um cupom.
- components/CouponFormModal.tsx: Modal formulário para adição de novos códigos promocionais e regras de uso.

## Estilização (CSS)

Optamos por utilizar Vanilla CSS (CSS puro) sem frameworks grandes como o Tailwind. A ideia aqui é ter total controle sobre a estilização utilizando Tokens customizados de CSS. 
Todas as variáveis globais de design (cores premium em tons de laranja, raios de borda, sombras e a nova tipografia Poppins) estão organizadas e centralizadas no arquivo `src/index.css`.

Caso queira alterar a paleta de cores ou o arredondamento global de todo o site, basta mexer na seção `:root` no começo deste arquivo.

## Como Executar

Se você precisar rodar esse painel localmente:
1. Abra o terminal na pasta raiz.
2. Digite `npm install` (caso ainda não tenha instalado as dependências).
3. Digite `npm run dev` para iniciar o servidor de desenvolvimento.
