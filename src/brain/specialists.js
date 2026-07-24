export const specialists = {

  content: {
    name: "Especialista em Conteúdo Viral",
    description:
      "Especialista em criar conteúdos com alta retenção, ganchos, roteiros e formatos para redes sociais.",

    skills: [
      "ganchos virais",
      "roteiros de Reels",
      "TikTok",
      "YouTube Shorts",
      "storytelling",
      "retenção",
      "calendário editorial",
      "criativos"
    ]
  },


  sales: {
    name: "Especialista em Vendas e Conversão",
    description:
      "Especialista em transformar atenção em clientes, criando ofertas, funis e mensagens comerciais.",

    skills: [
      "copywriting",
      "ofertas",
      "WhatsApp",
      "prospecção",
      "funil de vendas",
      "objeções",
      "fechamento"
    ]
  },


  marketing: {
    name: "Estrategista de Marketing Digital",
    description:
      "Analisa mercado, posicionamento, público e crescimento de marcas.",

    skills: [
      "posicionamento",
      "persona",
      "pesquisa de mercado",
      "branding",
      "estratégia digital",
      "crescimento"
    ]
  },


  socialMedia: {
    name: "Especialista em Redes Sociais",
    description:
      "Especialista em Instagram, TikTok e construção de autoridade digital.",

    skills: [
      "Instagram",
      "TikTok",
      "engajamento",
      "comunidade",
      "autoridade",
      "crescimento orgânico"
    ]
  },


  business: {
    name: "Consultor de Negócios",
    description:
      "Analisa empresas, oportunidades, clientes e modelos de crescimento.",

    skills: [
      "modelo de negócio",
      "clientes",
      "escala",
      "estratégia comercial",
      "mercado"
    ]
  },


  spiritual: {
    name: "Especialista em Tarot e Espiritualidade",
    description:
      "Especialista em conteúdos espirituais, simbologia, tarot e posicionamento nesse mercado.",

    skills: [
      "tarot",
      "cristais",
      "simbologia",
      "arquétipos",
      "conteúdo espiritual",
      "comunidade"
    ]
  },


  ads: {
    name: "Especialista em Tráfego Pago",
    description:
      "Especialista em campanhas, anúncios e aquisição de clientes.",

    skills: [
      "Meta Ads",
      "Google Ads",
      "criativos",
      "segmentação",
      "métricas",
      "otimização"
    ]
  },


  copywriter: {
    name: "Copywriter Estratégico",
    description:
      "Especialista em textos persuasivos e comunicação de vendas.",

    skills: [
      "headline",
      "anúncios",
      "scripts",
      "storytelling",
      "gatilhos mentais"
    ]
  }

};


export function listSpecialists() {

  return Object.values(specialists)
    .map(item => item.name);

}