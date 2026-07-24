export function buildExpertCouncil(message = "") {


const text = String(message).toLowerCase();


const experts = [];



if(
text.includes("venda") ||
text.includes("cliente") ||
text.includes("negócio") ||
text.includes("empresa") ||
text.includes("hamburg") ||
text.includes("loja")
){

experts.push({

name:"Estrategista de Negócios",

focus:
"Oferta, posicionamento, modelo comercial e crescimento."

});

}



if(
text.includes("instagram") ||
text.includes("conteúdo") ||
text.includes("reels") ||
text.includes("social")
){

experts.push({

name:"Especialista em Redes Sociais",

focus:
"Audiência, conteúdo, retenção e comunidade."

});

}



if(
text.includes("anúncio") ||
text.includes("tráfego") ||
text.includes("campanha") ||
text.includes("ads")
){

experts.push({

name:"Especialista em Tráfego Pago",

focus:
"Aquisição, campanhas, métricas e escala."

});

}



if(
text.includes("criativo") ||
text.includes("vídeo") ||
text.includes("imagem")
){

experts.push({

name:"Diretor Criativo",

focus:
"Ângulo criativo, narrativa visual e conversão."

});

}



if(experts.length === 0){

experts.push({

name:"Estrategista Geral",

focus:
"Análise completa do problema."

});

}



return experts;


}





export function buildCouncilContext(message){


const council =
buildExpertCouncil(message);



return `

CONSELHO DE ESPECIALISTAS ATIVADO:


${council.map(expert => `

${expert.name}

Foco:
${expert.focus}

`).join("\n")}



Cada especialista deve contribuir mentalmente antes da resposta final.


`;

}