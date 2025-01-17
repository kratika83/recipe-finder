import mongoose from "mongoose"

const recipeSchema = mongoose.Schema(
    {
        spoonacularId: {
            type: Number,
            required: true,
            unique: true
        },
        title: {
            type: String,
            required: true
        },
        ingredients: {
            type: [String],
            required: true
        },
        instructions: String,
        image: String,
        imageUrl: String,
        sourceUrl: String
    },
    {
        timestamps: true,
        versionKey: false,
        collection: 'Recipe'
    }
);

const recipeModel = mongoose.model('recipeSchema', recipeSchema);

export default recipeModel;