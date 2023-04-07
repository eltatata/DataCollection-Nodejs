import path from 'path';
import createError from 'http-errors';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import flash from "connect-flash";
import csrf from 'csurf';
import cors from "cors";
import { create } from "express-handlebars";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

// model Admin
import Admin from './models/Admin.js';

// routes
import dataRouter from './routes/data.router.js';
import authRouter from './routes/auth.router.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// read the connection with data base
import db from "./database/db.js";

// Configuration of cors
const corsOptions = {
    credentials: true,
    origin: process.env.PATHRENDER || "*",
    methods: ['GET', 'POST']
}

app.use(cors(corsOptions));

// express-sesion setup
app.use(session({
    name: 'session',
    secret: process.env.SESSION_SECRET || 'secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        clientPromise: db,
        dbName: process.env.DBNAME,
    }),
    cookie: {
        secure: true,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    },
    proxy: true
}));

// passport setup
app.use(passport.initialize());
app.use(passport.session());

// Configuration for Passport
passport.serializeUser((user, done) => {
    // Serialize the user object to store in the session
    done(null, { id: user._id, name: user.name, email: user.email });
});

passport.deserializeUser(async (user, done) => {
    // Deserialize the user object from the session and retrieve the user from the database
    const admin = await Admin.findById(user.id);

    // Call the done() function with the deserialized user object
    return done(null, { id: admin._id, name: admin.username });
});

const hbs = create({
    extname: ".hbs",
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: [path.join(__dirname, "views/components")]
});
app.engine(".hbs", hbs.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// enable protections with csrf
app.use(csrf());

// alerts flash
app.use(flash());

// configure error alerts and protection with csrf globally
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    res.locals.errors = req.flash("error");
    next();
});

app.use('/', dataRouter);
app.use('/admin', authRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

export default app;