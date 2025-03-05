'use client';

import { Recipe } from '../types';

interface RecipeListProps {
  recipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
  onDeleteRecipe: (recipeId: string) => void;
}

export default function RecipeList({ recipes, onSelectRecipe, onDeleteRecipe }: RecipeListProps) {
  if (recipes.length === 0) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-md">
        <h2 className="text-xl font-bold mb-4">Mis Recetas</h2>
        <p className="text-gray-500 text-center py-4">No tienes recetas guardadas</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <h2 className="text-xl font-bold mb-4">Mis Recetas</h2>
      <div className="space-y-2">
        {recipes.map(recipe => (
          <div key={recipe.id} className="border rounded-md p-3 hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <h3 className="font-medium">{recipe.name}</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={() => onSelectRecipe(recipe)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                  </svg>
                </button>
                <button 
                  onClick={() => onDeleteRecipe(recipe.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">{recipe.description.substring(0, 100)}{recipe.description.length > 100 ? '...' : ''}</p>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>{recipe.ingredients.length} ingredientes</span>
              <span>{Math.round(recipe.totalNutrition.calories)} kcal</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 