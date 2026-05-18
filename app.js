
'use strict'

import { getContatos, postContato, putContato, deleteContato } from "./contatos.js"

const novoContato = {
      "nome": "Brayan atualizado",
      "celular": "11 1 90909-7070",
      "foto": "https://img.freepik.com/psd-gratuitas/renderizacao-3d-do-estilo-de-cabelo-para-o-design-do-avatar_23-2151869121.jpg",
      "email": "Brayantoby23@gmail.com",
      "endereco": "Rua. Lavandeira, 330",
      "cidade": "Pombos"
    }

//console.log( await postContato(novoContato))
// console.log(await putContato(53, novoContato));
console.log(await deleteContato(23));

