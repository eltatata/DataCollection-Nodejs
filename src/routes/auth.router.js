import express from 'express';
import { adminLogin, adminLoginForm, adminLogout } from '../controllers/auth.controllers.js';
import { body } from 'express-validator';

const router = express.Router();

router.get("/login", adminLoginForm);

router.post("/login", [
    body("username", "Usuario ingresado invalido").trim().notEmpty().escape(),
    body("password", "Contraseña ingresada invalida").trim().notEmpty().escape(),
], adminLogin);

router.get("/logout", adminLogout);

export default router;