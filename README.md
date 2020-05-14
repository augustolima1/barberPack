# BarberPack
 Sistema para gerenciar comissão dos profissionais de barbearia
 
 
## Getting Started (Começando)
Assim que clonado o repositório, rodar na base do projeto
``` yarn ``` ou ```npm install```.

Para rodar a aplicação:
```
  yarn dev
```

ou
```
  npm dev
```

## API
  Os arquivos da API pode ser encontrado na pasta public\apiV1



## Import

Para importar um componente/funçao a partir da pasta `src`, em qualquer nível de pasta que você esteja, utilize da seguinte forma:

```jsx
// example
import something from "~/pages/something";
```

## Material-UI

Adicionado ao projeto o Material-UI  utilizando o projeto  [npm package](https://www.npmjs.com/package/@material-ui/core).


## Build

Para gerar o executável, basta rodar na base do projeto:

```
  yarn electron-build
```

ou
```
  npm electron-build
```

Os arquivos gerados no processo de build podem ser encontrados na pasta dist.