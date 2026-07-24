export function buildResearchPlan(message = "") {


  const text = String(message)
    .toLowerCase();



  const research = {

    segment: "não identificado",

    searches: [],

    analysisPoints: [],

    opportunities: []

  };



  // HAMBURGUERIA / ALIMENTAÇÃO

  if(
    text.includes("hamburg") ||
    text.includes("lanche") ||
    text.includes("delivery") ||
    text.includes("restaurante")
  ){

    research.segment =
      "alimentação / negócio local";


    research.searches.push(

      "principais hamburguerias concorrentes da região",

      "preço médio de hambúrguer delivery",

      "tendências de alimentação e delivery",

      "criativos de hamburgueria com alta conversão"

    );



    research.analysisPoints.push(

      "diferencial competitivo",

      "ticket médio",

      "ofertas utilizadas",

      "experiência de compra"

    );



    research.opportunities.push(

      "criação de combos",

      "aumento de ticket médio",

      "campanhas locais",

      "conteúdo visual de desejo"

    );

  }



  // E-COMMERCE

  if(
    text.includes("loja") ||
    text.includes("produto") ||
    text.includes("ecommerce")
  ){

    research.segment =
      "comércio eletrônico";


    research.searches.push(

      "concorrentes do nicho",

      "produtos mais vendidos",

      "tendências de compra online"

    );


    research.analysisPoints.push(

      "oferta",

      "criativo",

      "página de venda",

      "funil"

    );

  }




  // SERVIÇOS

  if(
    text.includes("serviço") ||
    text.includes("consultoria") ||
    text.includes("cliente")
  ){

    research.segment =
      "prestação de serviços";


    research.searches.push(

      "concorrentes locais",

      "posicionamento do mercado",

      "estratégias de aquisição"

    );


    research.analysisPoints.push(

      "autoridade",

      "prova social",

      "processo comercial"

    );

  }




  if(research.searches.length === 0){

    research.searches.push(

      "tendências do mercado",

      "concorrentes principais",

      "comportamento do público"

    );

  }



  return research;

}





export function buildResearchContext(message){


  const research =
    buildResearchPlan(message);



  return `

PLANO DE PESQUISA ESTRATÉGICA:


Segmento identificado:

${research.segment}



Pesquisar:

${research.searches.join("\n")}



Pontos de análise:

${research.analysisPoints.join("\n")}



Possíveis oportunidades:

${research.opportunities.join("\n")}



Use isso para pensar como consultor.


`;

}