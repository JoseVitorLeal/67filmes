import express from "express";
import mysql2 from "mysql2";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());


// LISTAR FILMES
app.get("/filmes", (request, response) => {

    const selectCommand = "SELECT * FROM filmes_JoseLealCamilySousa";

    sql.query(selectCommand, (error, result) => {

        if (error) {
            console.log(error);
            return;
        }

        response.json(result);
    });
});

// CADASTRAR FILME
app.post("/criar-filme", (request, response) => {

    const { titulo, genero, duracao, classificacao } = request.body;

    const insertCommand = `
        INSERT INTO filmes_JoseLealCamilySousa
        (titulo, genero, duracao, classificacao)
        VALUES (?, ?, ?, ?)
    `;

    sql.query(
        insertCommand,
        [titulo, genero, duracao, classificacao],
        (error) => {

            if (error) {
                console.log(error);
                return;
            }

            response.status(201).json({
                message: "Filme cadastrado com sucesso!"
            });
        }
    );
});

// EDITAR FILME
app.put("/editar-filme/:id", (request, response) => {

    const { id } = request.params;
    const { titulo, genero, duracao, classificacao } = request.body;

    const updateCommand = `
        UPDATE filmes_JoseLealCamilySousa
        SET titulo=?, genero=?, duracao=?, classificacao=?
        WHERE id=?
    `;

    sql.query(
        updateCommand,
        [titulo, genero, duracao, classificacao, id],
        (error) => {

            if (error) {
                console.log(error);
                return;
            }

            response.json({
                message: "Filme atualizado com sucesso!"
            });
        }
    );
});

// APAGAR FILME
app.delete("/apagar-filme/:id", (request, response) => {

    const { id } = request.params;

    const deleteCommand =
        "DELETE FROM filmes_JoseLealCamilySousa WHERE id=?";

    sql.query(deleteCommand, [id], (error) => {

        if (error) {
            console.log(error);
            return;
        }

        response.json({
            message: "Filme apagado com sucesso!"
        });
    });
});

app.listen(3007, () => {
    console.log("Servidor rodando na porta 3007");
});

const sql = mysql2.createPool({
    host: "benserverplex.ddns.net",
    user: "alunos",
    password: "senhaAlunos",
    database: "alunos_filmes03TB"
});