/****
 *  Será neste arquivo que iremos estruturar todo o nosso sistema de autenticação 
 * ****/

/* Definindo a estratégia */
    const localStrategy = require('passport-local').Strategy;

/* Carregando o mongoose ( bando de dados) */
    const mongoose = require('mongoose');

/* Carregar o bcrypt para comparar senhas HAS */
    const bcrypt = require('bcrypt');

/* Carregar model Usuário */
    require("../models/Usuario");
    const Usuario = mongoose.model("usuarios");



/* Aqui configuraremos todo o nosso sistema de autenticação */
    module.exports = function(passport) {

        passport.use(new localStrategy({usernameField: "email", passwordField: "senha"}, (email, senha, done) => {
            
            /* Buscar o usuario que tem o e-mail igual o e-mail passado na autenticação */
                Usuario.findOne( {email: email} )
                        .then( (usuario) => {

                            if (!usuario) {

                                    /* Done é uma função de callback que passamos três parâmetros:
                                        - dados da conta que foi autenticada (null pq nenhuma conta foi autenticada)
                                        - false (se a autenticação aconteceu com sucesso ou não)
                                        - mensagem (Conta não existe)
                                    */

                                return done(null, false, {message: "Esta conta não existe"})
                            } 

                            bcrypt.compare(senha, usuario.senha, (erro, batem) => {
                                
                                if(batem) {
                                    return done(null, usuario);
                                } else {
                                    return done(null, false, {message: "Senha incorreta!"});
                                }
                            });
                        })
        }));

        /* Essas duas funções abaixo, servem para salvar os dados de um usuário na sessão */
            passport.serializeUser((usuario, done) => {

                /* Passar os dados do usuário para uma sessão */
                    done(null, usuario.id);
            });

            passport.deserializeUser((id, done) => {

                Usuario.findById(id)
                        .then((usuario) => {
                            done(null, usuario);
                        })
                        .catch((error) => {
                            done(null, false, {message: "Algo deu errado ->" + error})
                        }); 
            });
    }