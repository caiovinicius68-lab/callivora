import { specialists } from "./specialists.js";


function normalize(text = "") {

  return String(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

}



export function detectSpecialist(message = "") {

  const text = normalize(message);


  let result = {
    key: "marketing",
    score: 0
  };


  const rules = {

    spiritual: [
      "tarot",
      "taro",
      "cristal",
      "energia",
      "espiritual",
      "arcano",
      "oraculo"
    ],


    content: [
      "video",
      "reels",
      "tiktok",
      "roteiro",
      "conteudo",
      "viral"
    ],


    sales: [
      "vender",
      "vendas",
      "cliente",
      "comprar",
      "oferta",
      "whatsapp",
      "lead"
    ],


    socialMedia: [
      "instagram",
      "seguidores",
      "engajamento",
      "perfil"
    ],


    business: [
      "empresa",
      "negocio",
      "marca",
      "crescer",
      "estrategia"
    ],


    ads: [
      "anuncio",
      "trafego",
      "facebook ads",
      "meta ads"
    ]

  };



  for(const [specialist, words] of Object.entries(rules)) {


    const points =
      words.filter(word =>
        text.includes(word)
      ).length;


    if(points > result.score) {

      result = {
        key: specialist,
        score: points
      };

    }

  }



  return {

    key: result.key,

    specialist:
      specialists[result.key] || specialists.marketing

  };

}





export function buildExpertContext(message) {


  const selected =
    detectSpecialist(message);



  return `

ESPECIALISTA ATIVADO:

${selected.specialist.name}


FUNÇÃO:

${selected.specialist.description}


ÁREAS:

${selected.specialist.skills.join(", ")}


`;

}