import React, { useState } from 'react';
import axios from 'axios';
import { Search, SlidersHorizontal, Clock, Camera } from 'lucide-react';

const RecipeSearch = () => {
  const [filters, setFilters] = useState({
    search_expression: '',
    must_have_images: false,
    calories: { from: '', to: '' },
    carb_percentage: { from: '', to: '' },
    protein_percentage: { from: '', to: '' },
    fat_percentage: { from: '', to: '' },
    prep_time: { from: '', to: '' },
    sort_by: 'newest',
    max_results: 20,
    format:'json',
    recipe_types:[],
    recipe_types_matchall:true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFilters(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else if (name === 'recipe_type') {
        setFilters(prev => ({
          ...prev,
          recipe_types: checked 
            ? [...prev.recipe_types, value] // Add to array if checked
            : prev.recipe_types.filter(type => type !== value) // Remove if unchecked
        }));
      }  else {
      setFilters(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };


const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    const apiUrl = "http://127.0.0.1:8000/search-recipes"; // Your FastAPI server
  
    console.log("Request JSON:", JSON.stringify(filters, null, 2));
  
    try {
      const response = await axios.get(apiUrl, {
        headers: { 'Content-Type': 'application/json', },
        params: {
          ...filters,
          recipe_type: filters.recipe_types.join(","), // Convert array to string
        },
      });
  
      console.log("Response JSON:", response.data);
      setResults(response.data.recipes.recipe);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="container mx-auto p-4">

      <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border rounded-lg shadow">
          <h2 className="text-lg font-semibold">Sort By</h2>
          <select
            name="sort_by"
            value={filters.sort_by}
            onChange={handleInputChange}
            className="w-full p-2 border rounded mt-2"
          >
            <option value="newest">Newest (Default)</option>
            <option value="oldest">Oldest</option>
            <option value="caloriesPerServingAscending">Calories (Low to High)</option>
            <option value="caloriesPerServingDescending">Calories (High to Low)</option>
          </select>
        </div>

        {/* Basic Search */}
        <div className="p-4 border rounded-lg shadow">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Search className="w-5 h-5" />Type in the word to find related Recipes
          </h2>
          <div className="mt-4 space-y-4">
            <input
              type="text"
              name="search_expression"
              value={filters.search_expression}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="Enter keywords..."
            />
          </div>
        </div>

        {/* Recipe Type Filter */}
        <div className="p-4 border rounded-lg shadow">
          <h2 className="text-lg font-semibold">Recipe Type</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {['Breakfast', 'Snack', 'Baked', 'Lunch', 'Dinner'].map(type => (
              <label key={type} className="flex items-center gap-2">
              <input
                type="checkbox"
                name="recipe_type"
                value={type}
                checked={filters.recipe_types.includes(type)} // Use includes directly on the array
                onChange={handleInputChange}
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        {/* Nutritional Filters */}
        <div className="p-4 border rounded-lg shadow">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5" /> Nutritional Filters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            
            {/* Calories */}
            <div>
              <label className="block text-sm font-medium">Calories Range</label>
              <div className="flex gap-2">
                <input type="number" name="calories.from" value={filters.calories.from} onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Min" />
                <input type="number" name="calories.to" value={filters.calories.to} onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Max" />
              </div>
            </div>

            {/* Carbs */}
            <div>
              <label className="block text-sm font-medium">Carb Percentage</label>
              <div className="flex gap-2">
                <input type="number" name="carb_percentage.from" value={filters.carb_percentage.from} onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Min %" />
                <input type="number" name="carb_percentage.to" value={filters.carb_percentage.to} onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Max %" />
              </div>
            </div>

            {/*Protein*/}
            <div>
              <label className="block text-sm font-medium">Protein Percentage</label>
              <div className="flex gap-2">
                <input type="number" name="protein_percentage.from" value={filters.protein_percentage.from} onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Min %" />
                <input type="number" name="protein_percentage.to" value={filters.protein_percentage.to} onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Max %" />
              </div>
            </div>

            {/*Fat*/}
            <div>
              <label className="block text-sm font-medium">Fat Percentage</label>
              <div className="flex gap-2">
                <input type="number" name="fat_percentage.from" value={filters.fat_percentage.from} onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Min %" />
                <input type="number" name="fat_percentage.to" value={filters.fat_percentage.to} onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Max %" />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Filters */}
        <div className="p-4 border rounded-lg shadow">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5" /> Additional Filters
          </h2>
          <div className="mt-4">
            <label className="block text-sm font-medium">Preparation Time (minutes)</label>
            <div className="flex gap-2">
              <input type="number" name="prep_time.from" value={filters.prep_time.from} onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Min" />
              <input type="number" name="prep_time.to" value={filters.prep_time.to} onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Max" />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button type="submit" disabled={isLoading} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
            {isLoading ? 'Searching...' : 'Search Recipes'}
          </button>
        </div>
      </form>

      {/* Results
      {results && (
        <div className="p-4 border rounded-lg shadow mt-6">
          <h2 className="text-lg font-semibold">Search Results</h2>
          <pre className="overflow-auto p-4 bg-gray-100 rounded">{JSON.stringify(results, null, 2)}</pre>
        </div>
      )} */}



      {results && (
  <div className="p-4 border rounded-lg shadow mt-6">
    <h2 className="text-lg font-semibold">Search Results</h2>
    {results.map((recipe) => (
      <div key={recipe.recipe_id} className="mt-6 space-y-4">
        {/* Recipe Header */}
        <div className="flex items-center space-x-4">
          <img
            src={recipe.recipe_image}
            alt={recipe.recipe_name}
            className="w-32 h-32 object-cover rounded"
          />
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">{recipe.recipe_name}</h3>
            <p className="text-sm text-gray-600">{recipe.recipe_description}</p>
          </div>
        </div>

        {/* Ingredients */}
        <div>
          <h4 className="text-lg font-semibold">Ingredients</h4>
          <ul className="list-disc pl-5">
            {recipe.recipe_ingredients.ingredient.map((ingredient, index) => (
              <li key={index} className="text-sm">{ingredient}</li>
            ))}
          </ul>
        </div>

        {/* Nutrition */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <h5 className="text-sm font-semibold">Calories</h5>
            <p className="text-sm">{recipe.recipe_nutrition.calories} kcal</p>
          </div>
          <div>
            <h5 className="text-sm font-semibold">Carbs</h5>
            <p className="text-sm">{recipe.recipe_nutrition.carbohydrate} g</p>
          </div>
          <div>
            <h5 className="text-sm font-semibold">Fat</h5>
            <p className="text-sm">{recipe.recipe_nutrition.fat} g</p>
          </div>
          <div>
            <h5 className="text-sm font-semibold">Protein</h5>
            <p className="text-sm">{recipe.recipe_nutrition.protein} g</p>
          </div>
        </div>

        {/* Recipe Types */}
        <div>
          <h5 className="text-sm font-semibold">Recipe Types</h5>
          <ul className="flex flex-wrap gap-2">
            {recipe.recipe_types.recipe_type.map((type, index) => (
              <li key={index} className="bg-gray-200 px-3 py-1 rounded-full text-sm">{type}</li>
            ))}
          </ul>
        </div>
      </div>
    ))}
  </div>
)}

      
    </div>
  );
};

export default RecipeSearch;
