const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const chatHistory = [];
const MAX_CONTEXT_MESSAGES = 10;
const REQUEST_TIMEOUT_MS = 90_000;

async function postJson(url, payload) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || 'Não foi possível concluir a solicitação.');
    }
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('A resposta demorou mais que o esperado. Tente novamente.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function setStatus(text, state = 'online') {
  $('#statusText').textContent = text;
  $('#statusDot').dataset.state = state;
}

async function checkHealth() {
  try {
    const response = await fetch('/health', { cache: 'no-store' });
    const data = await response.json();
    setStatus(data.openai ? 'IA online' : 'Modo local ativo', data.openai ? 'online' : 'local');
  } catch {
    setStatus('Servidor indisponível', 'offline');
  }
}

function autoResizeInput() {
  const input = $('#question');
  input.style.height = 'auto';
  input.style.height = `${Math.min(input.scrollHeight, 160)}px`;
}

function scrollToLatest() {

  const messages = $('#messages');

  requestAnimationFrame(() => {

    messages.scrollTop = messages.scrollHeight;

  });

}
function appendMessage(role, text) {
  const article = document.createElement('article');
  article.className = `message ${role === 'user' ? 'user-message' : 'assistant-message'}`;

  const avatar = document.createElement('div');
  avatar.className = 'avatar';
  avatar.textContent = role === 'user' ? 'Você' : '✦';

  const content = document.createElement('div');
  content.className = 'message-content';

  const author = document.createElement('strong');
  author.textContent = role === 'user' ? 'Você' : 'CalLivora';

  const paragraph = document.createElement('p');
  paragraph.textContent = text;

  content.append(author, paragraph);
  article.append(avatar, content);
  $('#messages').append(article);
  scrollToLatest();
  return article;
}

function buildConversationContext() {

  return chatHistory
    .slice(-20)
    .map((item) => {

      return {
        role: item.role,
        content: item.text
      };

    });

}

function setLoading(isLoading) {
  const button = $('#sendButton');
  const input = $('#question');
  button.disabled = isLoading;
  input.disabled = isLoading;
  button.classList.toggle('loading', isLoading);
  $('#typingIndicator').hidden = !isLoading;
  if (isLoading) scrollToLatest();
}

async function sendQuestion(rawMessage) {
  const message = String(rawMessage || '').trim();
  if (!message) return;

  const previousContext = buildConversationContext();
  appendMessage('user', message);
  chatHistory.push({ role: 'user', text: message });

  $('#question').value = '';
  autoResizeInput();
  setLoading(true);

  try {
    const data = await postJson('/api/chat', {
      message,
      context: JSON.stringify(previousContext)
    });

    const answer = String(data.text || '').trim() || 'Não recebi uma resposta válida. Tente reformular a pergunta.';
    appendMessage('assistant', answer);
    chatHistory.push({ role: 'assistant', text: answer });
  } catch (error) {
    appendMessage('assistant', `Não consegui responder agora: ${error.message}`);
  } finally {
    setLoading(false);
    $('#question').focus();
  }
}

function resetConversation() {
  chatHistory.length = 0;
  $('#messages').innerHTML = `
    <article class="message assistant-message welcome-message">
      <div class="avatar">✦</div>
      <div class="message-content">
        <strong>CalLivora</strong>
        <p>Nova conversa iniciada. Qual estratégia vamos construir agora?</p>
      </div>
    </article>
  `;
  $('#chatPanel').dataset.opened = 'false';
  $('#question').focus();
}

$('#chatForm').addEventListener('submit', (event) => {
  event.preventDefault();
  sendQuestion($('#question').value);
});

$('#question').addEventListener('input', autoResizeInput);
$('#question').addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    $('#chatForm').requestSubmit();
  }
});

$('#newChatButton').addEventListener('click', resetConversation);

$$('.feature-card').forEach((card) => {
  card.addEventListener('click', () => {
    $('#question').value = card.dataset.prompt || '';
    autoResizeInput();
    $('#assistente').scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => $('#question').focus(), 350);
  });
});

$$('.nav-item').forEach((item) => {
  item.addEventListener('click', () => {
    $$('.nav-item').forEach((navItem) => navItem.classList.remove('active'));
    item.classList.add('active');
    if (item.getAttribute('href') === '#assistente') {
      setTimeout(() => $('#question').focus(), 350);
    }
  });
});

checkHealth();
autoResizeInput();
