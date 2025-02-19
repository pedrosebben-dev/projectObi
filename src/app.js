import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

const Prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());

app.post('/usuarios', async (req, res) => {
  await Prisma.user.create({
    data: {
      email: req.body.email,
      name: req.body.name,
      age: req.body.age,
    },
  });

  res.status(201).json({});
});

app.get('/usuarios', async (req, res) => {
  let users = [];
  if (req.query) {
    users = await Prisma.user.findMany({
      where: {
        name: req.query.name,
        email: req.query.email,
        age: req.query.age,
      },
    });
  } else {
    users = await Prisma.user.findMany();
  }

  if (users.length === 0) {
    return res.status(404).json({ message: 'Nenhum usuário encontrado.' });
  }

  res.status(200).json(users);
});

app.put('/usuarios/:id', async (req, res) => {
  await Prisma.user.update({
    where: { id: req.params.id },
    data: {
      email: req.body.email,
      name: req.body.name,
      age: req.body.age,
    },
  });

  res.status(201).json(req.body);
});

app.delete('/usuarios/:id', async (req, res) => {
  await Prisma.user.delete({
    where: {
      id: req.params.id,
    },
  });

  res.status(200).json({ message: 'Usuario deletado com Sucesso!' });
});

export default app;

app.listen(3000);
