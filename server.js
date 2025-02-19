import express from 'express'
// primeiro de tudo começo importando o express depois de instalar ele e passo ele como funçao 
import { PrismaClient } from '@prisma/client'
//importar o prisma para o nosso projeto e abaixo usar ele como funcao 
import cors from 'cors'
// pra largar os dados pro front ( liberar )

const Prisma = new PrismaClient()


const app = express()
//passando ele como funçao me da acesso a todas funcionalidades que tem dentro da pasta que veio instalando ele 

app.use(express.json())
//informando que sera usado Json ao express 

app.use(cors())
//nao recomendado em producao, da acesso a tudo no Banco, mas agora liberei por ser projeto interno

app.post('/usuarios', async (req, res) => {
    
    await Prisma.user.create({
        data: {
            email: req.body.email,
            name: req.body.name,
            age: req.body.age
        }
    })
// com essas funcoes a gente faz a requisicao direto no banco de dados usando o prisma 
    res.status(201).json()
})
// metodo POST sera usado para cadastro de usuarios, cadastrar novos users no Banco de dados 


app.get('/usuarios', async (req, res) => {
  let users = []

  if (req.query) {
    users = await Prisma.user.findMany({
        where: {
            name: req.query.name,
            email: req.query.email,
            age: req.query.age
        }
    })
} else {
    users = await Prisma.user.findMany()
}
// podemos solicitar direto no banco de dados usando a Query e as informacoes cadastradas no Banco, EX: quero so usuarios com nome "JOAO"
// https://localhost/usuarios?name=joao
    if (users.length === 0) {
        return res.status(404).json({ message: "Nenhum usuário encontrado." })
    }

    res.status(200).json(users)
})

//se usa REQ ( request ) para solicitar algo ( uma resposta no caso ) e RES seria o resultado dessa resposta a
//criando as rotas para que seja feita a solicitacao ao front , metodo GET vamos fazer solicitacao de informacoes, sendo listado eles 

app.put('/usuarios/:id', async (req, res) => {
//colocado /:id para informar o usuarios que depois do / tem uma variavel para me retornar 
    await Prisma.user.update({
        where: {
            id: req.params.id
        },
        data: {
            email: req.body.email,
            name: req.body.name,
            age: req.body.age
        }
    })
// com essas funcoes a gente faz a requisicao direto no banco de dados para EDICAO de usuarios no banco de dados 
    res.status(201).json(req.body)
})

app.delete('/usuarios/:id', async (req, res) => {
    // deletar usuarios dentro do banco de dados ( pelo ID )
    await Prisma.user.delete({
        where: { 
            id: req.params.id,
        },
    })

    res.status(200).json({message: " Usuario deletado com Sucesso! "})
})

app.listen(3000)
//obs: só vai rodar o projeto se dentro da package.json for adicionado "type": "module", caso contrario ficara apresentando erro no servidor !!!!

