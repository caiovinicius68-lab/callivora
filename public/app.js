const $ = (selector) => document.querySelector(selector);

async function postJson(url, payload) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Erro na requisição');
  return data;
}

function setLoading(element, text) {
  element.textContent = text;
}

async function checkHealth() {
  try {
    const response = await fetch('/health');
    const data = await response.json();
    $('#statusText').textContent = data.openai ? 'Online com IA' : 'Online em modo local';
  } catch {
    $('#statusText').textContent = 'Offline';
  }
}

async function ask() {
  const message = $('#message').value.trim();
  const context = $('#context').value.trim();
  if (!message) {
    $('#answer').textContent = 'Digite uma pergunta primeiro.';
    return;
  }
  setLoading($('#answer'), 'Pensando...');
  try {
    const data = await postJson('/api/chat', { message, context });
    $('#answer').textContent = data.text;
  } catch (error) {
    $('#answer').textContent = `Erro: ${error.message}`;
  }
}

async function plan() {
  setLoading($('#planOutput'), 'Montando plano...');
  try {
    const data = await postJson('/api/plan', {
      business: $('#planBusiness').value,
      city: $('#planCity').value,
      channel: $('#planChannel').value,
      goal: $('#planGoal').value
    });
    $('#planOutput').textContent = data.text;
  } catch (error) {
    $('#planOutput').textContent = `Erro: ${error.message}`;
  }
}

async function research() {
  const results = $('#researchResults');
  results.innerHTML = '<div class="card">Pesquisando oportunidades...</div>';
  try {
    const data = await postJson('/api/research', {
      segment: $('#researchSegment').value,
      city: $('#researchCity').value,
      avatar: $('#researchAvatar').value
    });

    const cards = [
      `<div class="card"><h3>Diagnóstico</h3><p>${data.diagnostic.replaceAll('\n', '<br>')}</p></div>`,
      ...data.queries.map((item) => `
        <div class="card">
          <h3>${item.query}</h3>
          <a href="${item.google}" target="_blank" rel="noreferrer">Google</a>
          <a href="${item.maps}" target="_blank" rel="noreferrer">Maps</a>
          <a href="${item.instagram}" target="_blank" rel="noreferrer">Instagram</a>
        </div>
      `)
    ];
    results.innerHTML = cards.join('');
  } catch (error) {
    results.innerHTML = `<div class="card">Erro: ${error.message}</div>`;
  }
}

function copyMcp() {
  const mcpUrl = `${window.location.origin}/mcp`;
  navigator.clipboard?.writeText(mcpUrl);
  $('#copyMcp').textContent = 'Copiado';
  setTimeout(() => { $('#copyMcp').textContent = 'Copiar URL MCP'; }, 1400);
}

$('#askButton').addEventListener('click', ask);
$('#planButton').addEventListener('click', plan);
$('#researchButton').addEventListener('click', research);
$('#copyMcp').addEventListener('click', copyMcp);
$('#mcpUrl').textContent = `${window.location.origin}/mcp`;
checkHealth();
