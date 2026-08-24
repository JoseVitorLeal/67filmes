async function buscarFilmes() {

    const resposta = await fetch("http://localhost:3007/filmes");

    const filmes = await resposta.json();

    const sectionFilmes = document.querySelector(".filmes");

    filmes.forEach((filme) => {

        sectionFilmes.innerHTML += `
            <div class="filme">
                <h2>${filme.titulo}</h2>
                <p><strong>Gênero:</strong> ${filme.genero}</p>
                <p><strong>Duração:</strong> ${filme.duracao} minutos</p>
                <p><strong>Classificação:</strong> ${filme.classificacao}</p>
            </div>
        `;

    });
}

buscarFilmes();