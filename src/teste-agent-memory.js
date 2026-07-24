import { answerQuestion } from './agent.js';


const resposta = await answerQuestion({

  cliente_id: '3e852190-5469-440a-8992-0a8dca127fd2',

  message: `
Continue meu estudo.
Quero uma explicação mais profunda baseada no que você sabe sobre mim.
`

});


console.log(resposta);