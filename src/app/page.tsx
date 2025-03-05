'use client';

import { useState, useEffect } from 'react';
import { Ingredient, Recipe } from './types';
import { ingredients } from './data/ingredients';
import IngredientSearch from './components/IngredientSearch';
import RecipeForm from './components/RecipeForm';
import RecipeList from './components/RecipeList';
import BarcodeScanner from './components/BarcodeScanner';

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  
  // Cargar recetas guardadas al iniciar
  useEffect(() => {
    const savedRecipes = localStorage.getItem('recipes');
    if (savedRecipes) {
      try {
        setRecipes(JSON.parse(savedRecipes));
      } catch (error) {
        console.error('Error al cargar recetas:', error);
      }
    }
  }, []);
  
  // Guardar recetas cuando cambian
  useEffect(() => {
    localStorage.setItem('recipes', JSON.stringify(recipes));
  }, [recipes]);
  
  const handleAddIngredient = (ingredient: Ingredient) => {
    // Si hay una receta seleccionada, añadir el ingrediente a esa receta
    if (selectedRecipe) {
      // Lógica para añadir ingrediente a la receta seleccionada
      // Esta lógica se maneja en el componente RecipeForm
    }
  };
  
  const handleSaveRecipe = (recipe: Recipe) => {
    if (selectedRecipe) {
      // Actualizar receta existente
      setRecipes(recipes.map(r => r.id === recipe.id ? recipe : r));
      setSelectedRecipe(null);
    } else {
      // Añadir nueva receta
      setRecipes([...recipes, recipe]);
    }
  };
  
  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };
  
  const handleDeleteRecipe = (recipeId: string) => {
    setRecipes(recipes.filter(recipe => recipe.id !== recipeId));
    if (selectedRecipe && selectedRecipe.id === recipeId) {
      setSelectedRecipe(null);
    }
  };
  
  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Creador de Recetas</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <BarcodeScanner onIngredientFound={handleAddIngredient} />
            
            <IngredientSearch 
              onAddIngredient={handleAddIngredient} 
            />
            
            <div className="mt-6">
              <RecipeList 
                recipes={recipes} 
                onSelectRecipe={handleSelectRecipe} 
                onDeleteRecipe={handleDeleteRecipe} 
              />
            </div>
          </div>
          
          <div>
            <RecipeForm 
              onSaveRecipe={handleSaveRecipe}
              editingRecipe={selectedRecipe}
              onAddIngredient={handleAddIngredient}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
