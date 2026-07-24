#!/usr/bin/env node
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { answerQuestion, makeProspectingPlan, researchQueries } from './agent.js';

const rl = readline.createInterface({ input, output });

function printHelp() {
  console.log(`\nCalLivora Terminal\n\nComandos:\n  /ajuda          Mostra ajuda\n  /plano          Cria plano rápido de prospecção\n  /pesquisar      Gera consultas para achar leads\n  /sair           Encerra\n\nOu digite qualquer pergunta sobre prospecção, marketing, TikTok, Instagram, Facebook e WhatsApp.\n`);
}

async function ask(label, fallback = '') {
  const value = await rl.question(label);
  return value.trim() || fallback;
}

async function main() {
  console.log('✨ CalLivora — agente de prospecção e marketing');
  console.log('Digite /ajuda para ver comandos.\n');

  while (true) {
    const question = (await rl.question('CalLivora > ')).trim();
    if (!question) continue;

    if (['/sair', 'sair', 'exit', 'quit'].includes(question.toLowerCase())) break;
    if (question === '/ajuda') {
      printHelp();
      continue;
    }

    if (question === '/plano') {
      const business = await ask('Negócio/oferta: ', 'serviço local');
      const city = await ask('Cidade/região: ', 'minha cidade');
      const channel = await ask('Canal: ', 'Instagram e WhatsApp');
      const goal = await ask('Objetivo: ', 'marcar conversas comerciais');
      console.log('\n' + await makeProspectingPlan({ business, city, channel, goal }) + '\n');
      continue;
    }

    if (question === '/pesquisar') {
      const segment = await ask('Segmento: ', 'empresas locais');
      const city = await ask('Cidade: ', 'minha cidade');
      const result = await researchQueries({ segment, city });
      console.log('\n' + result.diagnostic + '\n');
      for (const item of result.queries) {
        console.log(`- ${item.query}`);
        console.log(`  Google: ${item.google}`);
        console.log(`  Maps: ${item.maps}`);
      }
      console.log('');
      continue;
    }

    const answer = await answerQuestion({ message: question });
    console.log('\n' + answer + '\n');
  }

  rl.close();
}

main().catch((error) => {
  console.error('Erro:', error.message);
  process.exit(1);
});
