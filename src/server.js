import "dotenv/config";

import http from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";


import {
  answerQuestion,
  makeProspectingPlan,
  researchQueries,
  contentCalendar,
  analyzeLead,
  generateProposal,
  companyResearch
} from "./agent.js";


import {
  handleMcpRequest,
  tools
} from "./mcp-core.js";



const __filename =
fileURLToPath(import.meta.url);


const __dirname =
path.dirname(__filename);



const rootDir =
path.resolve(__dirname,"..");


const publicDir =
path.join(rootDir,"public");



const PORT =
Number(process.env.PORT || 3000);





const mimeTypes = {

".html":"text/html; charset=utf-8",
".css":"text/css; charset=utf-8",
".js":"application/javascript; charset=utf-8",
".json":"application/json; charset=utf-8",
".png":"image/png",
".jpg":"image/jpeg",
".jpeg":"image/jpeg"

};
function send(res, statusCode, body, headers = {}) {

  let payload;

  if (Buffer.isBuffer(body)) {

    payload = body;

  } else if (typeof body === "string") {

    payload = body;

  } else {

    payload = JSON.stringify(body, null, 2);

  }


  res.writeHead(statusCode, {

    "Content-Type":
      headers["Content-Type"] ||
      "application/json; charset=utf-8",

    "Access-Control-Allow-Origin":
      "*",

    "Access-Control-Allow-Methods":
      "GET,POST,OPTIONS",

    "Access-Control-Allow-Headers":
      "Content-Type, Authorization",

    ...headers

  });


  res.end(payload);

}

async function readJson(req){


let body="";


for await(const chunk of req){

body+=chunk;

}



if(!body.trim()) return {};



return JSON.parse(body);


}









async function serveStatic(req,res){



let pathname =
new URL(
req.url,
`http://${req.headers.host}`
).pathname;



if(pathname==="/")
pathname="/index.html";



const filePath =
path.join(
publicDir,
pathname
);



if(!existsSync(filePath)){


send(
res,
404,
"Arquivo não encontrado"
);


return;

}



const ext =
path.extname(filePath)
.toLowerCase();



const content =
await readFile(filePath);



send(
res,
200,
content,
{
"Content-Type":
mimeTypes[ext]
||
"application/octet-stream"
}
);


}









async function router(req,res){


const url =
new URL(
req.url,
`http://${req.headers.host}`
);



if(req.method==="OPTIONS"){

send(res,204,"");

return;

}





try{



if(url.pathname==="/health"){



send(
res,
200,
{

ok:true,

app:"CalLivora",

openai:
Boolean(process.env.OPENAI_API_KEY),

tools:
tools.map(
x=>x.name
)

}

);


return;


}








if(
url.pathname==="/api/chat"
&&
req.method==="POST"
){


const data =
await readJson(req);



const text =
await answerQuestion({

message:data.message || "",

context:data.context || ""

});



send(res,200,{text});

return;

}









if(
url.pathname==="/api/plan"
&&
req.method==="POST"
){


const data =
await readJson(req);


const text =
await makeProspectingPlan(data);



send(res,200,{text});


return;


}









if(
url.pathname==="/api/research"
&&
req.method==="POST"
){


const data =
await readJson(req);



const result =
await researchQueries(data);



send(res,200,result);


return;


}









if(
url.pathname==="/api/calendar"
&&
req.method==="POST"
){


const data =
await readJson(req);


const text =
await contentCalendar(data);


send(res,200,{text});


return;


}









if(
url.pathname==="/api/lead"
&&
req.method==="POST"
){


const data =
await readJson(req);


const text =
await analyzeLead(data);


send(res,200,{text});


return;


}









if(
url.pathname==="/api/proposal"
&&
req.method==="POST"
){


const data =
await readJson(req);


const text =
await generateProposal(data);



send(res,200,{text});


return;


}









if(
url.pathname==="/api/company"
&&
req.method==="POST"
){


const data =
await readJson(req);



const text =
await companyResearch(data);



send(res,200,{text});


return;


}









if(url.pathname==="/mcp"){



if(req.method==="GET"){


send(
res,
200,
{

name:"CalLivora MCP",

tools:
tools.map(
t=>({

name:t.name,

description:t.description

})
)

}

);


return;

}





if(req.method==="POST"){


const data =
await readJson(req);



const result =
await handleMcpRequest(data);



send(res,200,result);


return;


}


}








await serveStatic(req,res);



}
catch(error){


console.error(error);



send(
res,
500,
{

error:error.message

}

);


}



}








const server =
http.createServer(router);



server.listen(
PORT,
()=>{

console.log(
`CalLivora online na porta ${PORT}`
);


}
);