import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import {notFound, errorHandler} from './middlewares';
import api from './api';

const app = express();

app.use(morgan('dev'));
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-eval'"],
    },
  }),
);
app.use(cors());
app.use(express.json());

// serve docs folder for apidoc
app.use('/docs', express.static('docs'));

app.use('/api/v1', api);

app.use(notFound);
app.use(errorHandler);

export default app;
