import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);

  const searchRecipes = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/recipe/search`, {
        params: { query }
      });

      if (response.data && response.data.results) {
        setRecipes(response.data.results)
      } else {
        setRecipes([])
      }
    } catch (error) {
      console.log('Error fetching recipes:', error.message);
    }
  }
  return (
    <div>
      <h1>Recipe Finder</h1>
      <input
        type='text'
        placeholder='Search for Recipes..'
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          console.log('Updated query:', e.target.value);
        }}
      />
      <button onClick={searchRecipes}>Search</button>

      <div>
        {recipes.length > 0 ? (
          recipes.map((recipe, index) => (
            <div key={recipe.id || index}>
              <h3>{recipe.title}</h3>
              <img src={recipe.image} alt={recipe.title} />
            </div>
          ))
        ) : (
          <p>No Recipes found</p> && console.log('Fallback UI rendered')
        )}
      </div>
    </div>
  );
}

export default App;
