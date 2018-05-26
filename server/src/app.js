import express from 'express';
import cookieParser from 'cookie-parser';
// import path from 'path';
import { config } from 'dotenv';

import indexRouter from './routes/index';

config({ path: '.env' });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use('/', express.static(path.join(__dirname, '../../client/build')));

app.use(indexRouter);

module.exports = app;
