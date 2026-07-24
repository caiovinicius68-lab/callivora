const sidebarHTML = `
<aside class="global-sidebar">

    <a href="/" class="global-brand">
        <span class="brand-icon">✦</span>
        <div>
            <strong>CalLivora</strong>
            <small>AI Growth Studio</small>
        </div>
    </a>

    <nav class="global-menu">

        <a href="/">
            <span>🏠</span> Dashboard
        </a>

        <a href="/pages/assistente.html">
            <span>🔮</span> Assistente IA
        </a>

        <a href="/pages/tendencias.html">
            <span>📈</span> Tendências
        </a>

        <a href="/pages/criador.html">
            <span>🎬</span> Criador
        </a>

        <a href="/pages/redes.html">
            <span>📱</span> Redes Sociais
        </a>

        <a href="/pages/monetizacao.html">
            <span>💰</span> Monetização
        </a>

        <a href="/pages/clientes.html">
            <span>🚀</span> Clientes
        </a>

        <a href="/pages/conhecimento.html">
            <span>💎</span> Conhecimento
        </a>

    </nav>

    <div class="global-sidebar-footer">
        <span class="online-dot"></span>
        Motor CalLivora
    </div>

</aside>
`;

document.body.insertAdjacentHTML("afterbegin", sidebarHTML);


/* DESTACA A PÁGINA ATUAL */

const currentPath = window.location.pathname;

document.querySelectorAll(".global-menu a").forEach(link => {

    const linkPath = new URL(link.href).pathname;

    if (linkPath === currentPath) {
        link.classList.add("active");
    }

});