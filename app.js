// Carregando módulos
    const express = require('express');
    const handlebars = require('express-handlebars');
    const bodyParser = require('body-parser');
    const app = express();
    const admin = require('./routes/admin');
    const path = require('path');
    const mongoose = require('mongoose');

// Configurações
    // Body Parser
        app.use(express.urlencoded({extended: true}));
        app.use(bodyParser.json());

    // HandleBars
        app.engine('handlebars', handlebars.engine({
            defaultLayout: 'main',
            runtimeOptions: {
                allowProtoPropertiesByDefault: true,
                allowProtoMethodsByDefault: true
            }
        }))
        app.set('view engine', 'handlebars');

    // Mongoose
        mongoose.Promise = global.Promise;
        mongoose.connect("mongodb://127.0.0.1:27017/blogapp")
                .then(() => {
                    console.log("Conectado ao Mongo!!");
                })
                .catch((error) => {
                    console.log("Erro ao conectar ao Mongo!! " + error);
                });

    // Public
        app.use(express.static(path.join(__dirname, "public")));

        app.use((req, res, next) => {
            console.log("Oi, eu sou um Middleware!!");
            next();
        });

// Rotas
    app.use('/admin', admin);

// Outros
const PORT = 8081;
app.listen(PORT, () => {
    console.log("Servidor rodando! Port:" + PORT);
});