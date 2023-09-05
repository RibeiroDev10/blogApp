/* A finalidade deste arquivo é verificar se um usuário está autenticado e se ele é ADMIN */



module.exports = {
    eAdmin: function(req, res, next) {
        if(req.isAuthenticated() && req.user.eAdmin == 1) {
            return next;
        };

        req.flash("error_msg", "Você precisa ser um Admin!");
        res.redirect("/");
    }
}