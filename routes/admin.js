const express = require('express');
const router = express.Router();

// Usando um Model de forma externa no mongoose
    const mongoose = require('mongoose');
    require('../models/Categoria');
    // Passando uma referência do Model para uma variável
        const Categoria = mongoose.model('categorias');

router.get('/', (req, res) => {
    res.render('admin/index');
});

router.get('/posts', (req, res) => {
    res.send("Página de posts!");
});

router.get('/categorias', (req, res) => {
    res.render('admin/categorias');
});

router.get('/categorias/add', (req, res) => {
    res.render('admin/addcategorias');
});

router.post('/categorias/nova', (req, res) => {
    const novaCategoria = {
        nome: req.body.name,
        slug: req.body.slug
    };

    new Categoria(novaCategoria)
        .save()
        .then(() => {
            console.log("Sucesso no cadastro de dados no BD!");
        })
        .catch((error) => {
            console.log("Erro ao salvar dados no BD: " + error);
        });
});

module.exports = router;