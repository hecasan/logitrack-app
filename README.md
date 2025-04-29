# LogiTrack - Sistema de Gerenciamento de Robôs Logísticos

Aplicativo móvel para gerenciamento e monitoramento de robôs logísticos, desenvolvido com React Native e Expo.

## Requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn
- Expo CLI
- Backend Spring Boot rodando em http://localhost:8080

## Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITORIO]
cd logitrack-app
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Inicie o aplicativo:
```bash
npm start
# ou
yarn start
```

4. Escaneie o QR code com o aplicativo Expo Go no seu dispositivo móvel ou pressione:
- `a` para abrir no emulador Android
- `i` para abrir no simulador iOS
- `w` para abrir no navegador web

## Funcionalidades

- **Dashboard**: Visualização geral do sistema com contadores e gráficos
- **Gerenciamento de Robôs**: Lista e controle de robôs logísticos
- **Monitoramento de Sensores**: Acompanhamento de leituras e alertas
- **Rastreamento de Entregas**: Acompanhamento de entregas em tempo real

## Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
├── screens/        # Telas do aplicativo
├── services/       # Serviços de API
├── utils/          # Funções utilitárias
├── context/        # Contextos do React
├── assets/         # Recursos estáticos
├── constants/      # Constantes e temas
└── navigation/     # Configuração de navegação
```

## Tecnologias Utilizadas

- React Native
- Expo
- React Navigation
- React Native Paper
- React Native Chart Kit
- Axios
- AsyncStorage

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença 0BSD - veja o arquivo [LICENSE](LICENSE) para detalhes. 