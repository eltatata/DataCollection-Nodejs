import Question from "../models/Question.js";

export const home = (req, res, next) => {
    res.render('index', { title: 'Recoleccion de datos' });
}

export const renderQuestions = async (req, res) => {
    try {
        const questions = await Question.find().lean();

        res.render("questions", { questions });
    } catch (error) {
        res.send(error.message);
    }
}

export const createQuestionForm = async (req, res) => {
    res.render("create", { title: 'Crear pregunta' });
}

export const createQuestion = async (req, res) => {
    try {
        const { question, answer } = req.body;

        let newQuestion = new Question({
            question: question,
            answer: answer
        });

        await newQuestion.save();

        res.redirect("/questions");
    } catch (error) {
        res.send(error.message);
    }
}

export const deleteQuestion = async (req, res) => {
    try {
        await Question.findByIdAndDelete(req.params.id);

        res.redirect("/questions");
    } catch (error) {
        res.send(error.message);
    }
}