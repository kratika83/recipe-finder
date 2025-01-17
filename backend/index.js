import dotenv from 'dotenv';
dotenv.config();
import connect from './config/dbConnection.js';
connect();

import express from 'express';
import cors from 'cors';
import recipeRouter from './routes/recipeRoute.js';

const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/recipe', recipeRouter);

app.get('/', (req, res) => {
    res.send('Recipe Finder API is running..');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})