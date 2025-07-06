import express from 'express';
import Routes from './routes/routes.js';

import dotenv from 'dotenv';

dotconfig.config();

const app = express();

app.use(express.json());

const base = process.env.BASE_URL || '/api';

app.use(`/${base}`, Routes);

app.listen(5000, ()=> {
    console.log("server started on port 5000");
});

