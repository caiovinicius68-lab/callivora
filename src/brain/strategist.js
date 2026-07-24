export function analyzeSituation(message = "") {

  const text = String(message).toLowerCase();


  const analysis = {

    niche: "não identificado",

    objective: "não identificado",

    possibleProblems: [],

    specialists: [],

    strategyDirection: []

  };



  // IDENTIFICA NICHO

  if(
    text.includes("hamburg") ||
    text.includes("lanche") ||
    text.includes("delivery")
  ){

    analysis.niche = "alimentação / hamburgueria";

  }


  if(
    text.includes("tarot") ||
    text.includes("espiritual") ||
    text.includes("cristal")
  ){

    analysis.niche = "espiritualidade";

  }



  if(
    text.includes("loja") ||
    text.includes("produto") ||
    text.includes("vender")
  ){

    analysis.niche = "comércio / vendas";

  }




  // IDENTIFICA OBJETIVO


  if(
    text.includes("vender") ||
    text.includes("vendas") ||
    text.includes("cliente")
  ){

    analysis.objective =
      "aumentar aquisição de clientes e conversão";

  }



  if(
    text.includes("instagram") ||
    text.includes("reels") ||
    text.includes("conteúdo")
  ){

    analysis.objective =
      "crescimento e geração de demanda através de conteúdo";

  }




  // PROBLEMAS COMUNS


  analysis.possibleProblems.push(

    "falta de posicionamento claro",

    "conteúdo sem objetivo comercial",

    "baixa transformação de atenção em vendas"

  );





  // ESPECIALISTAS


  if(
    analysis.niche === "alimentação / hamburgueria"
  ){

    analysis.specialists.push(

      "negócio local",

      "conteúdo visual",

      "vendas",

      "redes sociais"

    );


    analysis.strategyDirection.push(

      "criar desejo pelo produto",

      "aumentar pedidos pelo Instagram",

      "usar prova social e ofertas"

    );

  }




  if(
    analysis.niche === "espiritualidade"
  ){

    analysis.specialists.push(

      "espiritualidade",

      "conteúdo",

      "vendas"

    );


    analysis.strategyDirection.push(

      "criar conexão emocional",

      "transformar audiência em comunidade",

      "criar oferta de consulta"

    );

  }




  if(
    analysis.specialists.length === 0
  ){

    analysis.specialists.push(

      "marketing estratégico",

      "conteúdo",

      "vendas"

    );

  }




  return analysis;

}





export function buildStrategicContext(message){


  const analysis =
    analyzeSituation(message);



  return `

ANÁLISE ESTRATÉGICA INTERNA:

Nicho identificado:
${analysis.niche}


Objetivo:
${analysis.objective}


Possíveis problemas:

${analysis.possibleProblems.join("\n")}


Especialistas necessários:

${analysis.specialists.join("\n")}


Direção estratégica:

${analysis.strategyDirection.join("\n")}


Antes de responder, considere essa análise.


`;

}