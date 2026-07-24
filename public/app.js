const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const chatHistory = [];
const MAX_CONTEXT_MESSAGES = 10;
const REQUEST_TIMEOUT_MS = 90000;

let agenteSelecionado = "auto";


async function postJson(url, payload) {

  const controller = new AbortController();

  const timeout =
    setTimeout(
      () => controller.abort(),
      REQUEST_TIMEOUT_MS
    );


  try {

    const response =
      await fetch(url, {

        method:"POST",

        headers:{
          "Content-Type":"application/json"
        },

        body:JSON.stringify(payload),

        signal:controller.signal

      });


    const data =
      await response.json()
      .catch(()=>({}));


    if(!response.ok){

      throw new Error(
        data.error ||
        "Erro na solicitação"
      );

    }


    return data;


  }catch(error){


    if(error.name==="AbortError"){

      throw new Error(
        "A resposta demorou muito."
      );

    }


    throw error;


  }finally{

    clearTimeout(timeout);

  }

}





function setStatus(text,state="online"){

  const statusText =
    $("#statusText");

  const statusDot =
    $("#statusDot");


  if(statusText)
    statusText.textContent=text;


  if(statusDot)
    statusDot.dataset.state=state;

}





async function checkHealth(){

  try{

    const response =
      await fetch(
        "/health",
        {
          cache:"no-store"
        }
      );


    const data =
      await response.json();


    setStatus(
      data.openai
      ?
      "IA online"
      :
      "Modo local",
      data.openai
      ?
      "online"
      :
      "local"
    );


  }catch{

    setStatus(
      "Servidor offline",
      "offline"
    );

  }

}





function autoResizeInput(){

  const input =
    $("#question");


  if(!input)
    return;


  input.style.height="auto";

  input.style.height =
    `${Math.min(input.scrollHeight,160)}px`;

}





function scrollToLatest(){

  const messages =
    $("#messages");


  if(messages){

    requestAnimationFrame(()=>{

      messages.scrollTop =
      messages.scrollHeight;

    });

  }

}





function appendMessage(role,text){


  const messages =
    $("#messages");


  if(!messages)
    return;



  const article =
    document.createElement("article");


  article.className =
  `message ${
    role==="user"
    ?
    "user-message"
    :
    "assistant-message"
  }`;



  const avatar =
    document.createElement("div");


  avatar.className="avatar";


  avatar.textContent =
  role==="user"
  ?
  "Você"
  :
  "✦";



  const content =
    document.createElement("div");


  content.className =
  "message-content";



  const author =
    document.createElement("strong");


  author.textContent =
  role==="user"
  ?
  "Você"
  :
  "CalLivora";



  const paragraph =
    document.createElement("p");


  paragraph.textContent=text;



  content.append(
    author,
    paragraph
  );


  article.append(
    avatar,
    content
  );


  messages.append(article);


  scrollToLatest();


}

function buildConversationContext(){

  return chatHistory
    .slice(-MAX_CONTEXT_MESSAGES)
    .map(item=>({

      role:item.role,
      content:item.text

    }));

}




function setLoading(isLoading){

  const button =
    $("#sendButton");

  const input =
    $("#question");

  const typing =
    $("#typingIndicator");


  if(button)
    button.disabled=isLoading;


  if(input)
    input.disabled=isLoading;


  if(typing)
    typing.hidden=!isLoading;


}




async function sendQuestion(rawMessage){


  const message =
    String(rawMessage || "").trim();


  if(!message)
    return;



  const previousContext =
    buildConversationContext();



  appendMessage(
    "user",
    message
  );


  chatHistory.push({

    role:"user",

    text:message

  });



  const input =
    $("#question");


  if(input)
    input.value="";


  autoResizeInput();


  setLoading(true);



  try{


    const data =
      await postJson(
        "/api/chat",
        {

          message,

          context:
          JSON.stringify(
            previousContext
          ),

          agente:
          agenteSelecionado

        }
      );



    const answer =
      String(
        data.text || ""
      ).trim()
      ||
      "Não recebi resposta.";



    appendMessage(
      "assistant",
      answer
    );


    chatHistory.push({

      role:"assistant",

      text:answer

    });



  }catch(error){


    appendMessage(
      "assistant",
      "Erro: " + error.message
    );


  }finally{


    setLoading(false);


    if(input)
      input.focus();


  }


}





function selecionarAgente(nome){


  agenteSelecionado =
    nome;



  const nomes = {


    auto:
    "🤖 Automático",


    marketing:
    "🚀 Marketing",


    strategist:
    "🧠 Estrategista",


    mentor:
    "🧬 Mentor"


  };



  const result =
    $("#result");



  if(result){

    result.innerHTML =
    `

    <div style="
    padding:15px;
    border-radius:12px;
    background:#111;
    color:white;
    margin-bottom:15px;
    ">

    Agente selecionado:
    <strong>
    ${nomes[nome]}
    </strong>

    </div>

    `;

  }


}




function resetConversation(){


  chatHistory.length=0;


  const messages =
    $("#messages");


  if(messages){

    messages.innerHTML =
    `

    <article class="message assistant-message">

    <div class="avatar">
    ✦
    </div>

    <div class="message-content">

    <strong>
    CalLivora
    </strong>

    <p>
    Nova conversa iniciada.
    Qual estratégia vamos construir?
    </p>

    </div>

    </article>

    `;

  }


}





const chatForm =
$("#chatForm");


if(chatForm){

chatForm.addEventListener(
"submit",
(event)=>{

event.preventDefault();

sendQuestion(
$("#question").value
);

});


}



const question =
$("#question");


if(question){

question.addEventListener(
"input",
autoResizeInput
);


question.addEventListener(
"keydown",
(event)=>{


if(
event.key==="Enter"
&&
!event.shiftKey
){

event.preventDefault();

chatForm.requestSubmit();

}


});


}





const newChatButton =
$("#newChatButton");


if(newChatButton){

newChatButton.addEventListener(
"click",
resetConversation
);

}




$$(".feature-card")
.forEach(card=>{


card.addEventListener(
"click",
()=>{


const input =
$("#question");


if(input){

input.value =
card.dataset.prompt || "";


autoResizeInput();

input.focus();

}


});


});





checkHealth();

autoResizeInput();