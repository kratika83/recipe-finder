import axios from 'axios';
import recipeModel from '../models/recipeModel.js';
import dotenv from 'dotenv';
dotenv.config();

const searchRecipe = async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' })
    }
    try {
        const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch`, {
            params: {
                apiKey: process.env.SPOONACULAR_API_KEY,
                query,
                number: 10
            }
        });

        const recipes = response.data.results || [];
        if (!recipes || recipes.length === 0) {
            return res.status(404).json({ message: 'No recipes found.' });
        }

        const savedRecipes = await Promise.all(
            recipes.map(async (recipe) => {
                const existingRecipe = await recipeModel.findOne({ spoonacularId: recipe.id });
                if (existingRecipe) {
                    return existingRecipe;
                } else {
                    const newRecipe = new recipeModel({
                        spoonacularId: recipe.id,
                        title: recipe.title,
                        ingredients: recipe.extendedIngredients?.map((i) => i.name) || [],
                        instructions: recipe.instructions,
                        image: recipe.image,
                        imageUrl: recipe.imageUrl,
                        sourceUrl: recipe.sourceUrl
                    });
                    return await newRecipe.save();
                }
            })
        )
        res.status(200).json({ message: 'Recipes saved successfully', results: recipes, savedRecipes });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recipes', error: error.message });
    }
};

const recipeDetails = async (req, res) => {
    const { id } = req.params;

    try {
        const response = await axios.get(`https://api.spoonacular.com/recipes/${id}/information`, {
            params: {
                apiKey: process.env.SPOONACULAR_API_KEY
            }
        });

        const recipeData = response.data || {};
        if (!recipeData || !recipeData.id) {
            return res.status(404).json({ message: 'Recipe not found on spoonacular' })
        }

        const ingredients = Array.isArray(recipeData.extendedIngredients)
            ? recipeData.extendedIngredients
                .filter((i) => i && i.originalString) // Filter out null or undefined elements
                .map((i) => i.originalString) // Map to originalString
            : [];

        const recipe = await recipeModel.findOne({ spoonacularId: id });
        if (recipe) {
            return res.json(recipe);;
        }

        const newRecipe = new recipeModel({
            spoonacularId: recipeData.id,
            title: recipeData.title || 'No title available',
            ingredients,
            instructions: recipeData.instructions || 'No instructions available',
            imageUrl: recipeData.image || '',
            sourceUrl: recipeData.sourceUrl || ''
        });
        await newRecipe.save();

        return res.json(newRecipe);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching recipes', error: error.message });
    }
};

let recipeController = {
    searchRecipe: searchRecipe,
    recipeDetails: recipeDetails
};

export default recipeController;