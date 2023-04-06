import Admin from "../models/Admin.js"
import { validationResult } from "express-validator"

export const adminLoginForm = (req, res) => {
    res.render("login");
}

export const adminLogin = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash("error", errors.array())
        return res.redirect("/admin/login");
    };

    try {
        const admin = await Admin.findOne({ username: req.body.username });

        if (!admin) throw new Error("administrador no existente");

        if (!admin.comparePassword(req.body.password)) throw new Error("La contraseña es incorrecta");

        req.login(admin, (err) => {
            if (err) {
                throw new Error("Error al iniciar sesión");
            } else {
                res.redirect("/questions");
            }
        });
    } catch (error) {
        req.flash("error", [{ msg: error.message }])
        res.redirect("/admin/login");
    }
}

export const adminLogout = async (req, res) => {
    req.logout(() => {
        try {
            res.redirect("/admin/login");
        } catch (error) {
            console.log(error);
        }
    });
}
