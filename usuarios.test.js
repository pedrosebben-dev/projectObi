import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../src/app';  //  app Express

const prisma = new PrismaClient();

beforeAll(async () => {
  // Pode ser necessário limpar a base de dados para cada execução
  await prisma.user.deleteMany(); 
});

afterAll(async () => {
  // Fechar a conexão com o banco depois dos testes
  await prisma.$disconnect();
});

describe('Testes de Usuários', () => {
  it('deve criar um novo usuário', async () => {
    const response = await request(app)
      .post('/usuarios')
      .send({
        email: 'joao@exemplo.com',
        name: 'João',
        age: 30
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({});
  });

  it('deve listar usuários', async () => {
    // Criação de um usuário para testar o GET
    await request(app)
      .post('/usuarios')
      .send({
        email: 'maria@exemplo.com',
        name: 'Maria',
        age: 25
      });

    const response = await request(app).get('/usuarios');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].name).toBe('Maria');
  });

  it('deve atualizar um usuário', async () => {
    // Primeiro, criamos um usuário
    const createResponse = await request(app)
      .post('/usuarios')
      .send({
        email: 'pedro@exemplo.com',
        name: 'Pedro',
        age: 40
      });

    const userId = createResponse.body.id;

    // Agora, atualizamos esse usuário
    const updateResponse = await request(app)
      .put(`/usuarios/${userId}`)
      .send({
        email: 'pedro.novo@exemplo.com',
        name: 'Pedro Novo',
        age: 42
      });

    expect(updateResponse.status).toBe(201);
    expect(updateResponse.body.name).toBe('Pedro Novo');
    expect(updateResponse.body.age).toBe(42);
  });

  it('deve deletar um usuário', async () => {
    // Criando um novo usuário para deletar
    const createResponse = await request(app)
      .post('/usuarios')
      .send({
        email: 'jose@exemplo.com',
        name: 'José',
        age: 28
      });

    const userId = createResponse.body.id;

    // Deletando o usuário criado
    const deleteResponse = await request(app)
      .delete(`/usuarios/${userId}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.message).toBe('Usuario deletado com Sucesso!');
  });
});
