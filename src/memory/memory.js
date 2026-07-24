import fs from "node:fs";
import path from "node:path";


const memoryFile =
  path.resolve("src/memory/database.json");



function ensureDatabase(){

  if(!fs.existsSync(memoryFile)){

    fs.writeFileSync(
      memoryFile,
      JSON.stringify({}, null, 2)
    );

  }

}



export function saveMemory(key, data){

  ensureDatabase();


  const database =
    JSON.parse(
      fs.readFileSync(memoryFile,"utf8")
    );


  database[key] = {

    ...database[key],

    ...data,

    updatedAt:
      new Date().toISOString()

  };


  fs.writeFileSync(
    memoryFile,
    JSON.stringify(database,null,2)
  );


}





export function getMemory(key){

  ensureDatabase();


  const database =
    JSON.parse(
      fs.readFileSync(memoryFile,"utf8")
    );


  return database[key] || null;

}





export function listMemory(){

  ensureDatabase();


  return JSON.parse(
    fs.readFileSync(memoryFile,"utf8")
  );

}