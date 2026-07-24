
async function perguntar(){
 const input=document.querySelector("#question");
 const result=document.querySelector("#result");
 result.innerHTML="Analisando com CalLivora AI...";

 const r=await fetch("/api/chat",{
 method:"POST",
 headers:{"Content-Type":"application/json"},
 body:JSON.stringify({message:input.value})
 });

 const data=await r.json();
 result.innerHTML=data.answer;
}
