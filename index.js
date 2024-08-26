const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para permitir o uso de JSON no corpo da requisição
app.use(express.json());

// Array de produtos
let products = [];

// Middleware de logging para todas as rotas
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// POST - Cadastrar um novo produto
app.post('/products', (req, res) => {
    const product = req.body;
    products.push(product);
    res.status(201).json({ message: 'Produto criado com sucesso!', product });
});

// DELETE - Deletar um produto por ID
app.delete('/products/:id', (req, res) => {
    const { id } = req.params;
    products = products.filter(prod => prod.id !== parseInt(id));
    res.status(200).json({ message: 'Produto deletado com sucesso!' });
});

// GET - Listar todos os produtos com filtros opcionais
app.get('/products', (req, res) => {
    const { nome, precoMax, mediaAvaliacao } = req.query;

    let filteredProducts = products;

    // Filtro por nome
    if (nome) {
        filteredProducts = filteredProducts.filter(prod => prod.nome.includes(nome));
    }

    // Filtro por preço máximo
    if (precoMax) {
        filteredProducts = filteredProducts.filter(prod => prod.preco <= parseFloat(precoMax));
    }

    // Filtro por média de avaliação
    if (mediaAvaliacao) {
        filteredProducts = filteredProducts.filter(prod => prod.avaliacao >= parseFloat(mediaAvaliacao));
    }

    res.status(200).json(filteredProducts);
});

// GET - Buscar um produto por ID
app.get('/products/:id', (req, res) => {
    const { id } = req.params;
    const product = products.find(prod => prod.id === parseInt(id));

    if (!product) {
        return res.status(404).json({ message: 'Produto não encontrado' });
    }

    res.status(200).json(product);
});

// PUT - Atualizar um produto completamente por ID
app.put('/products/:id', (req, res) => {
    const { id } = req.params;
    const { nome, marca, preco, quantidade, categoria, avaliacao } = req.body;

    const productIndex = products.findIndex(prod => prod.id === parseInt(id));

    if (productIndex === -1) {
        return res.status(404).json({ message: 'Produto não encontrado' });
    }

    // Atualizar produto
    products[productIndex] = { id: parseInt(id), nome, marca, preco, quantidade, categoria, avaliacao };

    res.status(200).json({ message: 'Produto atualizado com sucesso!', product: products[productIndex] });
});

// PATCH - Atualizar apenas o preço de um produto
app.patch('/products/:id/preco', (req, res) => {
    const { id } = req.params;
    const { preco } = req.body;

    const product = products.find(prod => prod.id === parseInt(id));

    if (!product) {
        return res.status(404).json({ message: 'Produto não encontrado' });
    }

    // Atualizar o preço do produto
    product.preco = preco;

    res.status(200).json({ message: 'Preço atualizado com sucesso!', product });
});

// PATCH - Atualizar apenas o estoque de um produto
app.patch('/products/:id/estoque', (req, res) => {
    const { id } = req.params;
    const { quantidade } = req.body;

    const product = products.find(prod => prod.id === parseInt(id));

    if (!product) {
        return res.status(404).json({ message: 'Produto não encontrado' });
    }

    // Atualizar o estoque do produto
    product.quantidade += quantidade;

    res.status(200).json({ message: 'Estoque atualizado com sucesso!', product });
});

// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });