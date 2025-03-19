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
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-eval'"],
      },
    },
  })
);
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static('uploads'));

// serve docs folder for apidoc
app.use('/docs/upload', express.static('docs'));

app.get('/', (req, res) => {
  res.send('API Documentation is available at /docs/upload');
});


app.use('/api/v1/upload', api);

app.use(notFound);
app.use(errorHandler);

export default app;
