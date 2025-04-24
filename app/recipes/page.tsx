"use client";

import React, { useState, useEffect } from 'react';

interface Ingredient {
  id: number;
  item_name: string;
  price: number;
  store: string;
  quantity: number;
  measurement_type: string;
}

interface RecipeIngredient {
  inventory_id: number;
  quantity: number;
  measurement_type: string;
  price: number;
  name: string; 
}

const RecipeForm: React.FC = () => {
  // State for recipe details
  const [recipeName, setRecipeName] = useState('');
  const [instructions, setInstructions] = useState('');
  
  // State for ingredients
  const [availableIngredients, setAvailableIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<RecipeIngredient[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [measurementType, setMeasurementType] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch available ingredients
  useEffect(() => {
    const fetchIngredients = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/ingredients');

        if(!response.ok) {
          throw new Error('Failed to fetch ingredients');
        }

        const data = await response.json();
        setAvailableIngredients(data);
        setError(null);
      } catch (error){
        console.error('Error fetching ingredients:', error);
        setError('Failed to load ingredients');
      } finally {
        setIsLoading(false);
      }
    };

    fetchIngredients();
  }, []);

  // Add ingredient to recipe
  const addIngredientToRecipe = () => {
    if (!currentIngredient || quantity <= 0) return;
    
    const ingredientToAdd = availableIngredients.find(ing => ing.id === currentIngredient);
    if (!ingredientToAdd) return;
    
    const newRecipeIngredient: RecipeIngredient = {
      inventory_id: ingredientToAdd.id,
      quantity,
      measurement_type: measurementType || ingredientToAdd.measurement_type,
      price: (ingredientToAdd.price / ingredientToAdd.quantity) * quantity,
      name: ingredientToAdd.item_name 
    };
    
    setSelectedIngredients([...selectedIngredients, newRecipeIngredient]);
    
    // Reset fields
    setCurrentIngredient(null);
    setQuantity(1);
    setMeasurementType('');
  };

  // Remove ingredient from recipe
  const removeIngredient = (index: number) => {
    const newIngredients = [...selectedIngredients];
    newIngredients.splice(index, 1);
    setSelectedIngredients(newIngredients);
  };

  // Calculate total recipe cost
  const calculateTotalCost = () => {
    return selectedIngredients.reduce((total, ingredient) => total + ingredient.price, 0).toFixed(2);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create recipe object
    const recipeData = {
      recipe_name: recipeName,
      instructions,
      ingredients: selectedIngredients.map(ing => ({
        inventory_id: ing.inventory_id,
        quantity: ing.quantity,
        measurement_type: ing.measurement_type,
        price: ing.price
      }))
    };
    
    //add the recipes to the database
    try{
      const response = await fetch('api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData),
      });

      if(!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create recipe');
        //ADD SIMILAR STATUS MESSAGE TO THE INGREDIENTS COMPONENT SO THERE IS THE MESSAGE ACCROSS THE TOP
      }




      //ADD SIMILAR STATUS MESSAGE TO THE INGREDIENTS COMPONENT SO THERE IS THE MESSAGE ACCROSS THE TOP
      //ADD SIMILAR STATUS MESSAGE TO THE INGREDIENTS COMPONENT SO THERE IS THE MESSAGE ACCROSS THE TOP
      //ADD SIMILAR STATUS MESSAGE TO THE INGREDIENTS COMPONENT SO THERE IS THE MESSAGE ACCROSS THE TOP
      //ADD SIMILAR STATUS MESSAGE TO THE INGREDIENTS COMPONENT SO THERE IS THE MESSAGE ACCROSS THE TOP
      //ADD SIMILAR STATUS MESSAGE TO THE INGREDIENTS COMPONENT SO THERE IS THE MESSAGE ACCROSS THE TOP
      //ADD SIMILAR STATUS MESSAGE TO THE INGREDIENTS COMPONENT SO THERE IS THE MESSAGE ACCROSS THE TOP


      // Reset form
      setRecipeName('');
      setInstructions('');
      setSelectedIngredients([]);
    } catch (error){
      console.error('Error adding recipe', error);
      //ADD SIMILAR STATUS MESSAGE TO THE INGREDIENTS COMPONENT SO THERE IS THE MESSAGE ACCROSS THE TOP
    }
    
    
  };

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Create a New Recipe</h2>
        <form onSubmit={handleSubmit}>
          
          <div className="grid gap-4 mb-6 sm:grid-cols-1">
            <div>
              <label htmlFor="recipe-name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Recipe Name</label>
              <input 
                type="text" 
                id="recipe-name" 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                placeholder="Enter recipe name" 
                required 
              />
            </div>
          </div>

          
          <div className="mb-6">
            <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Ingredients</h3>
            
           
            <div className="grid gap-4 mb-4 sm:grid-cols-3">
              <div>
                <label htmlFor="ingredient" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ingredient</label>
                <select 
                  id="ingredient" 
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  value={currentIngredient || ''}
                  onChange={(e) => setCurrentIngredient(Number(e.target.value))}
                >
                  <option value="">Select ingredient</option>
                  {availableIngredients.map(ing => (
                    <option key={ing.id} value={ing.id}>{ing.item_name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="quantity" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Quantity</label>
                <input 
                  type="number" 
                  id="quantity" 
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  placeholder="Amount" 
                  min="0.1"
                  step="0.1"
                />
              </div>
              
              <div>
                <label htmlFor="measurement-type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Measurement</label>
                <select 
                  id="measurement-type" 
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  value={measurementType}
                  onChange={(e) => setMeasurementType(e.target.value)}
                >
                  <option value="">Select measurement</option>
                  <option value="tsp">Teaspoon (tsp)</option>
                  <option value="tbsp">Tablespoon (tbsp)</option>
                  <option value="cup">Cup</option>
                  <option value="floz">Fluid Ounce (fl oz)</option>
                  <option value="oz">Ounce (oz)</option>
                  <option value="g">Gram (g)</option>
                  <option value="kg">Kilogram (kg)</option>
                  <option value="ml">Milliliter (ml)</option>
                  <option value="l">Liter (l)</option>
                  <option value="pint">Pint</option>
                  <option value="quart">Quart</option>
                  <option value="gallon">Gallon</option>
                </select>
              </div>
            </div>
            
            <button 
              type="button" 
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-6 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              onClick={addIngredientToRecipe}
            >
              Add Ingredient
            </button>
            
            
            {selectedIngredients.length > 0 && (
              <div className="mb-6">
                <h4 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">Recipe Ingredients:</h4>
                <ul className="space-y-2">
                  {selectedIngredients.map((ing, index) => (
                    <li key={index} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span>
                        {ing.quantity} {ing.measurement_type} of {ing.name} (${ing.price.toFixed(2)})
                      </span>
                      <button 
                        type="button"
                        onClick={() => removeIngredient(index)}
                        className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Total Cost: ${calculateTotalCost()}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          
          <div className="mb-6">
            <label htmlFor="instructions" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Instructions</label>
            <textarea 
              id="instructions" 
              rows={6} 
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
              placeholder="Enter recipe instructions step by step"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            ></textarea>
          </div>
          
          
          <button 
            type="submit" 
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
          >
            Create Recipe
          </button>
        </form>
      </div>
    </section>
  );
};

export default RecipeForm;