# 🎮 Jogo da Velha React

Um jogo da velha moderno e interativo desenvolvido com React e Vite, com Tailwind CSS para estilização, efeitos sonoros e design responsivo.

## ✨ Características

- 🎨 **Interface moderna** com design glassmorphism
- 🔊 **Efeitos sonoros** para jogadas e vitórias
- 📱 **Design responsivo** que funciona em qualquer dispositivo
- ⚡ **Performance otimizada** com React hooks e Vite
- 🎪 **Animações fluidas** e transições suaves
- 🎯 **Lógica inteligente** para detecção de vitórias e empates

## 🚀 Como Executar

### Pré-requisitos
- Node.js 16+ instalado
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/davydfontourac/projeto_jogo_da_velha.git
cd projeto_jogo_da_velha
```

2. Instale as dependências:
```bash
npm install
```

3. Execute em modo de desenvolvimento:
```bash
npm run dev
```

O jogo será aberto automaticamente em [http://localhost:5173](http://localhost:5173).

## 🛠️ Tecnologias Utilizadas

- **React 19.1.1** - Biblioteca para interfaces de usuário
- **Vite 7.1.7** - Build tool ultrarrápido e servidor de desenvolvimento
- **Tailwind CSS 3.3.0** - Framework CSS utilitário
- **Web Audio API** - Para efeitos sonoros
- **PostCSS & Autoprefixer** - Processamento de CSS

## 🎯 Como Jogar

1. O jogo é para dois jogadores: X e O
2. Clique em qualquer casa vazia do tabuleiro
3. Os jogadores se alternam automaticamente
4. Vença alinhando 3 símbolos (horizontal, vertical ou diagonal)
5. Use o botão "Reiniciar" para começar uma nova partida

## 📱 Funcionalidades

- **Detecção automática de vitória** em todas as direções
- **Indicador visual do jogador atual**
- **Placar persistente** durante a sessão
- **Animações de hover** nos botões
- **Efeitos sonoros** configuráveis
- **Reset rápido** do jogo

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento Vite
- `npm run build` - Gera build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa o linter ESLint

## 🎨 Personalização

O projeto usa Tailwind CSS, permitindo fácil customização:
- Cores e temas em `tailwind.config.js`
- Estilos personalizados em `src/App.css`
- Efeitos sonoros em `src/useSoundEffects.js`

## ⚡ Vantagens do Vite

- **Início instantâneo** (~500ms vs ~10-15s do CRA)
- **Hot Module Replacement** ultrarrápido
- **Build otimizado** com melhor tree-shaking
- **Menor consumo de recursos**

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir novas funcionalidades  
- Enviar pull requests

---

Desenvolvido com ❤️ usando React, Vite e Tailwind CSS
