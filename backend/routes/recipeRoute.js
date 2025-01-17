import recipeController from '../Controller/recipeController.js';
import express from 'express';
const recipeRouter = express.Router();

recipeRouter.get('/search', recipeController.searchRecipe);
recipeRouter.get('/details/:id', recipeController.recipeDetails);

export default recipeRouter;