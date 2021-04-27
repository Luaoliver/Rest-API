const express = require('express');
const server = express();
server.use(express.json());

/** array pois ainda não há banco de dados */
const usuarios = [];
const cursos = [
    {
        "id": 1, 
        "nome": "Arquitetura"
    }, 
    {
        "id": 2, 
        "nome": "Jornalismo"
    }
];

/** para fazer inclusões */
/** primeiro defina os dados, o método post busca dados do body */
/** PRIMEIRO é feita a requisição */
server.post('/usuarios', (req, res) => {
    /** SEGUNDO o processamento */
    const id = usuarios.length + 1;
    const nome = req.body.nome;
    const idade = req.body.idade;
    const cursosRequest = req.body.cursos;
    
    const finalCursos = [];
    cursos.forEach((item) => {
        if(cursosRequest.includes(item.id)) {
            finalCursos.push(item.nome)
        } // includes verifica se no array cursosRequest possui item.id
    })
    /** push serve para colocar informações dentro do array */
    /** quando o nome da chave e do valor coincidem basta anunciar apenas uma vez, por exemplo chave "nome" igual a valor "nome" */
    usuarios.push({
        id,
        nome,
        idade,
        "cursos": finalCursos
    });

    /** TERCEIRO retorna uma resposta */
    return res.status(201).json(usuarios)
});

/** para buscar algo */
/** dentro de get pode ser adicionado um "req.query", ele é responsável por pegar tudo que vem na url após a "?", que são chamados de query params*/
server.get('/usuarios', (req, res) =>{
    return res.status(200).json(usuarios);
});

/** para atualização de idade */
server.put('/usuarios/:id', (req, res) => {
    const id = req.params.id; /** requisição por parametro na url */
    const idade = req.body.idade; /** requisição por body*/

    usuarios[id - 1].idade = idade; /** lógica */

    return res.status(201).json(usuarios); /** resposta */
});

/** para deletar */
server.delete('/usuarios/:id', (req, res) => {
    const id = req.params.id;

    let indice = -1; /** para criar um padrão */

    /** recebe o valor, depois posição e por fim o proprio array(opcional) */
    usuarios.map((usuario, index) => {
        /** = atribui valor
         * == compara valor
         * === compara valor e tipo
         * na url o id é recebido como string, nesse if ele está sendo comparado com um número. Há duas opções, a primeira seria colocar "==", a segunda é deixar apenas "=" e converter para number. Eu optei pela segunda:
         */
        if(usuario.id == Number(id)){ /** deve contar igualdade dupla */
            indice = index;
        }
        return usuario;
    });

    /** fluxo de erro */
    /** para controle de fluxo se usa condicionais */
    if(indice == -1){ /** deve conter igualdade dupla */
        return res.status(400).json({ error: "Não existe nenhum usuario com esse identificador."});
    }

    /** caminho feliz */
    /** splice é usado para remover elementos */
    usuarios.splice(indice, 1);
    
    return res.status(200).send();

});

/** listar os curso */
server.get('/usuarios/:id/cursos', (req, res) => {
    const id = req.params.id;
    const usuario = usuarios[id - 1];

    return res.status(200).json(usuario.cursos);
});

/** incluir curso */
server.post('/usuarios/:id/cursos', (req, res) => {
    const id = req.params.id; //requisição por parametro na url
    const cursosRequest = req.body.cursos; //requisição por body

    const usuario = usuarios[id - 1];
    cursos.forEach((curso) => { //vai olhar tudo que há dentro de cursos
        if(cursosRequest.includes(curso.id)) {
            usuario.cursos.push(curso.nome); // curso.nome aparecerá apenas o nome do curso
        }
    })

    return res.status(201).json(usuarios);
});

/** alterar curso */
/** server.put('/usuarios/cursos/:id', (req, res) => {}); */

/** deletar curso */
server.delete('/usuarios/:id/cursos/:cursoid', (req, res) => {
    const id = req.params.id;
    const cursoid = req.params.cursoid;


    cursos.forEach((curso) => {
        if(curso.id == cursoid){
            usuarios[id-1].cursos = usuarios[id-1].cursos.filter(
                (usuarioCurso) => {
                return usuarioCurso != curso.name;
            });   
        }
    })

    return res.status(200).json(usuarios[id-1]);

});

server.listen(3000, () => {
    console.log('Server is running in http://localhost:3000/')
});