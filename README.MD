> deverá ser criado um arquivo de 'api.ts' no seguinte caminho: `/src/screens/services/api.ts`
> o conteúdo desse arquivo deverá ser igual ao abaixo substituindo apenas a chave api_key que
> você deverá gerar no site: 'https://www.themoviedb.org/settings/api' :

```

import axios from 'axios'

export const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: "SUA_CHAVE_API_AQUI",
    language: "pt-BR",
    include_adult: false,
  }
})

```