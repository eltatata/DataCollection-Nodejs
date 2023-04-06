import express from 'express';
import { createQuestion, createQuestionForm, deleteQuestion, home, renderQuestions } from '../controllers/data.controller.js';
import { checkSession } from '../middlewares/checkSession.js';

const router = express.Router();

/* GET home page. */
router.get('/', home);

router.get('/questions', checkSession, renderQuestions);

router.get('/create', checkSession, createQuestionForm);

router.post('/create', checkSession, createQuestion);

router.get('/delete/:id', checkSession, deleteQuestion);

export default router;