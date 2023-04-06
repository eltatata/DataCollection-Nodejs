export const checkSession = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }

    req.flash("error", [{ msg: "No has iniciado sesion" }]);

    return res.redirect("admin/login");
}