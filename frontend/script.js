const API_URL = "https://67filmes-74a1.vercel.app";

const listaFilmes = document.querySelector("#listaFilmes");
const mensagemVazia = document.querySelector("#mensagemVazia");

const overlay = document.querySelector("#overlay");
const formFilme = document.querySelector("#formFilme");
const tituloModal = document.querySelector("#tituloModal");

const campoId = document.querySelector("#filmeId");
const campoTitulo = document.querySelector("#titulo");
const campoGenero = document.querySelector("#genero");
const campoDuracao = document.querySelector("#duracao");
const campoClassificacao = document.querySelector("#classificacao");

const btnNovoFilme = document.querySelector("#btnNovoFilme");
const btnFechar = document.querySelector("#btnFechar");
const btnCancelar = document.querySelector("#btnCancelar");

const toast = document.querySelector("#toast");

// ---------- Buscar e renderizar ----------
async function buscarFilmes() {

    try {
        const resposta = await fetch(`${API_URL}/filmes`);

        if (!resposta.ok) throw new Error("Falha ao buscar filmes");

        const filmes = await resposta.json();

        renderizarFilmes(filmes);

    } catch (erro) {
        console.log(erro);
        mostrarToast("Não foi possível carregar os filmes.", true);
    }
}

function renderizarFilmes(filmes) {

    listaFilmes.innerHTML = "";

    mensagemVazia.hidden = filmes.length !== 0;

    filmes.forEach((filme) => {

        const card = document.createElement("div");
        card.className = "filme";

        card.innerHTML = `
            <span class="badge">${filme.classificacao}</span>
            <h2>${filme.titulo}</h2>
            <p><strong>Gênero:</strong> ${filme.genero}</p>
            <p><strong>Duração:</strong> ${filme.duracao} minutos</p>

            <div class="filme-acoes">
                <button class="btn-icone btn-editar">Editar</button>
                <button class="btn-icone btn-apagar">Apagar</button>
            </div>
        `;

        card.querySelector(".btn-editar")
            .addEventListener("click", () => abrirModalEdicao(filme));

        card.querySelector(".btn-apagar")
            .addEventListener("click", () => apagarFilme(filme.id));

        listaFilmes.appendChild(card);
    });
}

// ---------- Modal ----------
function abrirModalCadastro() {
    tituloModal.textContent = "Novo filme";
    formFilme.reset();
    campoId.value = "";
    overlay.hidden = false;
    campoTitulo.focus();
}

function abrirModalEdicao(filme) {
    tituloModal.textContent = "Editar filme";
    campoId.value = filme.id;
    campoTitulo.value = filme.titulo;
    campoGenero.value = filme.genero;
    campoDuracao.value = filme.duracao;
    campoClassificacao.value = filme.classificacao;
    overlay.hidden = false;
    campoTitulo.focus();
}

function fecharModal() {
    overlay.hidden = true;
    formFilme.reset();
}

btnNovoFilme.addEventListener("click", abrirModalCadastro);
btnFechar.addEventListener("click", fecharModal);
btnCancelar.addEventListener("click", fecharModal);

overlay.addEventListener("click", (evento) => {
    if (evento.target === overlay) fecharModal();
});

document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && !overlay.hidden) fecharModal();
});

// ---------- Criar / Editar ----------
formFilme.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const dadosFilme = {
        titulo: campoTitulo.value.trim(),
        genero: campoGenero.value.trim(),
        duracao: Number(campoDuracao.value),
        classificacao: campoClassificacao.value.trim()
    };

    const id = campoId.value;

    try {
        const resposta = id
            ? await fetch(`${API_URL}/editar-filme/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dadosFilme)
            })
            : await fetch(`${API_URL}/criar-filme`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dadosFilme)
            });

        if (!resposta.ok) throw new Error("Falha ao salvar filme");

        mostrarToast(id ? "Filme atualizado com sucesso!" : "Filme cadastrado com sucesso!");
        fecharModal();
        buscarFilmes();

    } catch (erro) {
        console.log(erro);
        mostrarToast("Não foi possível salvar o filme.", true);
    }
});

// ---------- Apagar ----------
async function apagarFilme(id) {

    const confirmou = confirm("Tem certeza que deseja apagar este filme?");
    if (!confirmou) return;

    try {
        const resposta = await fetch(`${API_URL}/apagar-filme/${id}`, {
            method: "DELETE"
        });

        if (!resposta.ok) throw new Error("Falha ao apagar filme");

        mostrarToast("Filme apagado com sucesso!");
        buscarFilmes();

    } catch (erro) {
        console.log(erro);
        mostrarToast("Não foi possível apagar o filme.", true);
    }
}

// ---------- Toast ----------
let toastTimeout;

function mostrarToast(mensagem, erro = false) {
    clearTimeout(toastTimeout);

    toast.textContent = mensagem;
    toast.classList.toggle("erro", erro);
    toast.hidden = false;

    toastTimeout = setTimeout(() => {
        toast.hidden = true;
    }, 3000);
}

buscarFilmes();