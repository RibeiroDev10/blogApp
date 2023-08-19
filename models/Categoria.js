const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Categoria = new Schema({
    nome:{
        type: String,
        required: true
    },
    slug :{
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Criando uma collection/tabela no MongoDB com base no Model criado acima ^
    mongoose.model("categorias", Categoria);