import express, { Application, Request, Response } from 'express';
import http from 'http';
import session from 'express-session';
import cors from 'cors';
import passport from 'passport';
import dotenv from 'dotenv';

import router from './routes/index';

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,
    cookie: {
      // [ ]: Secure cookie not saving passport session coz of http site
      // secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

const server = http.createServer(app);
server.listen(3001, (): void => {
  console.log('The application is listening on port: 3001');
});

app.get('/', (_req: Request, res: Response): void => {
  res.send('Hello World!');
});

app.use('/', router());
