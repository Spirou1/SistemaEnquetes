const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

let polls = []; 
let currentPollId = 1; // Contador de ID para enquetes
let currentOptionId = 1; // Contador de ID para opções

// Endpoint para criar uma nova enquete
app.post('/polls', (req, res) => {
    const { title, startDate, endDate, options } = req.body;

    if (!options || !Array.isArray(options) || options.length === 0) {
        return res.status(400).send({ error: 'É necessário fornecer pelo menos uma opção.' });
    }

    const newPoll = {
        id: currentPollId++, // Incrementa o ID de forma única
        title,
        startDate,
        endDate,
        status: 'não iniciada',
        options: options.map((opt) => ({
            id: currentOptionId++, // Incrementa o ID das opções
            text: opt,
            votes: 0
        }))
    };

    polls.push(newPoll);
    res.status(201).send(newPoll);
});

// Endpoint para editar uma enquete
app.put('/polls/:pollId', (req, res) => {
    const pollId = parseInt(req.params.pollId);
    const poll = polls.find(p => p.id === pollId);
    if (!poll) {
        return res.status(404).send({ error: 'Enquete não encontrada.' });
    }

    const { title, startDate, endDate } = req.body;

    // Atualizar os campos da enquete
    poll.title = title || poll.title;
    poll.startDate = startDate || poll.startDate;
    poll.endDate = endDate || poll.endDate;

    res.send(poll);
});

// Endpoint para buscar todas as enquetes
app.get('/polls', (req, res) => {
    res.send(polls);
});

// Endpoint para buscar uma enquete por ID
app.get('/polls/:pollId', (req, res) => {
    const pollId = parseInt(req.params.pollId);
    const poll = polls.find(p => p.id === pollId);
    if (!poll) {
        return res.status(404).send({ error: 'Enquete não encontrada.' });
    }
    res.send(poll);
});

// Endpoint para adicionar uma nova opção a uma enquete
app.post('/polls/:pollId/options', (req, res) => {
    const pollId = parseInt(req.params.pollId);
    const poll = polls.find(p => p.id === pollId);
    if (!poll) {
        return res.status(404).send({ error: 'Enquete não encontrada.' });
    }
    const newOption = {
        id: currentOptionId++, // Incrementa o ID das opções de forma única
        text: req.body.text,
        votes: 0
    };
    poll.options.push(newOption);
    res.status(201).send(newOption);
});

// Endpoint para votar em uma opção
app.post('/polls/:pollId/options/:optionId/vote', (req, res) => {
    const pollId = parseInt(req.params.pollId);
    const optionId = parseInt(req.params.optionId);
    const poll = polls.find(p => p.id === pollId);
  
    if (!poll) {
      return res.status(404).send({ error: 'Enquete não encontrada.' });
    }
  
    if (poll.status !== 'em andamento') {
      return res.status(400).send({ error: 'A enquete ainda não foi iniciada.' });
    }
  
    const option = poll.options.find(opt => opt.id === optionId);
    if (!option) {
      return res.status(404).send({ error: 'Opção não encontrada.' });
    }
  
    option.votes += 1;
    res.send({ message: 'Voto registrado com sucesso.', poll });
  });

// Endpoint para iniciar a enquete
app.put('/polls/:pollId/start', (req, res) => {
    const pollId = parseInt(req.params.pollId);
    const poll = polls.find(p => p.id === pollId);
    if (!poll) {
        return res.status(404).send({ error: 'Enquete não encontrada.' });
    }
    poll.status = req.body.status; // Atualiza o status da enquete
    res.send(poll);
});

// Endpoint para excluir uma enquete
app.delete('/polls/:pollId', (req, res) => {
    const pollId = parseInt(req.params.pollId);
    const pollIndex = polls.findIndex(p => p.id === pollId);
    if (pollIndex === -1) {
        return res.status(404).send({ error: 'Enquete não encontrada.' });
    }
    polls.splice(pollIndex, 1);
    res.send({ message: 'Enquete excluída com sucesso.' });
});

// Iniciando o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
