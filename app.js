// Carregando módulos
    const express = require('express');
    const handlebars = require('express-handlebars');
    const bodyParser = require('body-parser');
    const app = express();
    const admin = require('./routes/admin');
    const path = require('path');
    const mongoose = require('mongoose');
    const session = require('express-session');
    const flash = require('connect-flash');
    const usuarios = require("./routes/usuario"); 
    const passport = require("passport");
    const bcrypt = require('bcrypt');

    /* Requires dos models */
        require('./models/Postagem');
        const Postagem = mongoose.model("postagens"); // Declarando o model depois do require abaixo
        require('./models/Categoria');
        const Categoria = mongoose.model("categorias");

    /* Require do config AUTH */
        require("./config/auth")(passport);

// Configurações
    // Sessão
        app.use(session({
            secret: "cursoDeNode",
            resave: true,
            saveUninitialized: true
        }));

        /* Sempre entre a inicialização da sessão e o flash, vamos chamar o passport.initialize() */
            app.use(passport.initialize());
            app.use(passport.session());

        app.use(flash());

    // Middleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash("success_msg");
            res.locals.error_msg = req.flash("error_msg");
            res.locals.error = req.flash("error");
            // req.user = passport cria isso automaticamente para armazenar dados do usuario logado
            // passamos o valor "null" caso não exista nenhum usuário logado
                res.locals.user = req.user || null;
            next(); 
        });

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
            next();
        });

// Rotas
    /* Rota principal */
        app.get('/', (req, res) => {
            
            Postagem.find()
                    .lean()
                    .populate("categoria")
                    .sort({data: "desc"})
                    .then((postagens) => {
                        res.render("index", {postagens: postagens});
                    })
                    .catch((error) => {
                        req.flash("error_msg", "Houve um erro intero -> " + error);
                        res.redirect("/404");
                    });
        });

    /* Rota de descrição (Leia mais...) */    
    app.get("/postagem/:slug", (req, res) => {
        Postagem.findOne({slug: req.params.slug})
                .then((postagem) => {
                    if(postagem) {
                        res.render("postagem/index", {postagem: postagem});
                    } else {
                        req.flash("error_msg", "Essa postagem não existe!");
                        res.redirect("/");
                    };
                })
                .catch((error) => {
                    req.flash("error_msg", "Houve um erro interno -> " + error);
                    res.redirect("/");
                });
    })

    /* Rota de listagem de categorais */
        app.get('/categorias', (req, res) => {
            Categoria.find()
                     .then((categorias) => {
                        res.render("categorias/index", {categorias: categorias});
                     })
                     .catch((error) => {
                        req.flash("error_msg", "Houve um erro interno ao listar as categorias -> " + error);
                        res.redirect("/");
                    });
        });

    /*  */
        app.get('/categorias/:slug', (req, res) => {
            Categoria.findOne({slug: req.params.slug})
                     .then((categoria) => {
                        // se, achar, existir a categoria com base no SLUG passado como parâmetro...
                        if(categoria) {
                                        // procure no atributo "categoria" do Model "Postagem"
                                        // se existe uma categoria com o mesmo ID 
                                        // daquela mesma categoria achada com base no parâmetro SLUG.
                            Postagem.find({categoria: categoria._id})
                                    .then((postagens) => {
                                        res.render("categorias/postagens", {postagens: postagens, categoria: categoria});
                                    })
                                    .catch((error) => {
                                        req.flash("error_msg", "Houve um erro ao listar os posts -> " + error);
                                        res.redirect("/");
                                    });
                        } else { // se não achar a categoria no Model "Postagem"...
                            req.flash("error_msg", "Essa categoria não existe!");
                            res.redirect('/');
                        };
                     })
                     .catch((error) => {
                        req.flash("error_msg", "Houve um erro interno ao carregar a página dessa categoria -> " + error);
                        res.redirect('/');
                     });
        });

    /* Rota erro 404 */    
        app.get("/404", (req, res) => {
            res.send("Erro 404!");
        })

    /* Rota admin */
        app.use('/admin', admin);

    /* Rota usuarios */
        app.use("/usuarios", usuarios);
    
// Outros
const PORT = 8081;
app.listen(PORT, () => {
    console.log("Servidor rodando! Port:" + PORT);
}); 