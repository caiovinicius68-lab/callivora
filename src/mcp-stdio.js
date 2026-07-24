#!/usr/bin/env node
import { handleMcpRequest } from './mcp-core.js';

let buffer = Buffer.alloc(0);

function writeMessage(message) {
  if (message === null || message === undefined) return;
  const json = JSON.stringify(message);
  const payload = Buffer.from(json, 'utf8');
  const header = `Content-Length: ${payload.length}\r\n\r\n`;
  process.stdout.write(header);
  process.stdout.write(payload);
}

async function processJson(jsonText) {
  try {
    const payload = JSON.parse(jsonText);
    const response = Array.isArray(payload)
      ? await Promise.all(payload.map((item) => handleMcpRequest(item)))
      : await handleMcpRequest(payload);
    writeMessage(response);
  } catch (error) {
    writeMessage({
      jsonrpc: '2.0',
      id: null,
      error: {
        code: -32700,
        message: error.message || 'Erro ao processar mensagem MCP.'
      }
    });
  }
}

function tryProcessBuffer() {
  while (buffer.length > 0) {
    const headerEnd = buffer.indexOf('\r\n\r\n');
    if (headerEnd === -1) {
      const asText = buffer.toString('utf8');
      const newline = asText.indexOf('\n');
      if (newline === -1) return;
      const line = asText.slice(0, newline).trim();
      buffer = Buffer.from(asText.slice(newline + 1), 'utf8');
      if (line) processJson(line);
      continue;
    }

    const headerText = buffer.slice(0, headerEnd).toString('utf8');
    const match = headerText.match(/Content-Length:\s*(\d+)/i);
    if (!match) {
      buffer = buffer.slice(headerEnd + 4);
      continue;
    }

    const length = Number.parseInt(match[1], 10);
    const messageStart = headerEnd + 4;
    const messageEnd = messageStart + length;
    if (buffer.length < messageEnd) return;

    const jsonText = buffer.slice(messageStart, messageEnd).toString('utf8');
    buffer = buffer.slice(messageEnd);
    processJson(jsonText);
  }
}

process.stdin.on('data', (chunk) => {
  buffer = Buffer.concat([buffer, chunk]);
  tryProcessBuffer();
});

process.stdin.on('end', () => process.exit(0));
process.stderr.write('CalLivora MCP stdio iniciado.\n');
