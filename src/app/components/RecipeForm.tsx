'use client';

import { useState, useEffect } from 'react';
import { Ingredient, RecipeIngredient, Recipe } from '../types';
import { calculateTotalNutrition } from '../utils/calculations';
import Image from 'next/image';
import NutritionInfo from './NutritionInfo';

interface RecipeFormProps {
  onSaveRecipe: (recipe: Recipe) => void;
  editingRecipe?: Recipe | null;
  onAddIngredient?: (ingredient: Ingredient) => void;
}

export default function RecipeForm({ onSaveRecipe, editingRecipe, onAddIngredient }: RecipeFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState<RecipeIngredient[]>([]);
  const [totalNutrition, setTotalNutrition] = useState({
    calories: 0,
    proteins: 0,
    fats: 0,
    carbs: 0
  });
  const [recipeId, setRecipeId] = useState<string>('');
  const [showNutritionDetails, setShowNutritionDetails] = useState(false);

  // Cargar datos de la receta si estamos editando
  useEffect(() => {
    if (editingRecipe) {
      setName(editingRecipe.name);
      setDescription(editingRecipe.description);
      setInstructions(editingRecipe.instructions);
      setSelectedIngredients(editingRecipe.ingredients);
      setTotalNutrition(editingRecipe.totalNutrition);
      setRecipeId(editingRecipe.id);
    } else {
      // Resetear el formulario si no estamos editando
      setName('');
      setDescription('');
      setInstructions('');
      setSelectedIngredients([]);
      setTotalNutrition({
        calories: 0,
        proteins: 0,
        fats: 0,
        carbs: 0
      });
      setRecipeId('');
    }
  }, [editingRecipe]);

  // Actualizar la información nutricional cuando cambian los ingredientes
  useEffect(() => {
    const nutrition = calculateTotalNutrition(selectedIngredients);
    setTotalNutrition(nutrition);
  }, [selectedIngredients]);

  const handleAddIngredient = (ingredient: Ingredient) => {
    // Verificar si el ingrediente ya está en la lista
    const existingIndex = selectedIngredients.findIndex(
      item => item.ingredient.id === ingredient.id
    );

    if (existingIndex >= 0) {
      // Si ya existe, incrementar la cantidad
      const updatedIngredients = [...selectedIngredients];
      updatedIngredients[existingIndex] = {
        ...updatedIngredients[existingIndex],
        quantity: updatedIngredients[existingIndex].quantity + 1
      };
      setSelectedIngredients(updatedIngredients);
    } else {
      // Si no existe, añadirlo a la lista
      setSelectedIngredients([
        ...selectedIngredients,
        {
          ingredient,
          quantity: 1,
          unit: 'unidad'
        }
      ]);
    }

    // Llamar al callback si existe
    if (onAddIngredient) {
      onAddIngredient(ingredient);
    }
  };

  const handleRemoveIngredient = (index: number) => {
    const updatedIngredients = [...selectedIngredients];
    updatedIngredients.splice(index, 1);
    setSelectedIngredients(updatedIngredients);
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const updatedIngredients = [...selectedIngredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      quantity
    };
    setSelectedIngredients(updatedIngredients);
  };

  const handleUnitChange = (index: number, unit: RecipeIngredient['unit']) => {
    const updatedIngredients = [...selectedIngredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      unit
    };
    setSelectedIngredients(updatedIngredients);
  };

  const handleSaveRecipe = () => {
    if (!name) {
      alert('Por favor, introduce un nombre para la receta');
      return;
    }

    if (selectedIngredients.length === 0) {
      alert('Por favor, añade al menos un ingrediente');
      return;
    }

    const newRecipe: Recipe = {
      id: recipeId || Date.now().toString(),
      name,
      description,
      ingredients: selectedIngredients,
      instructions,
      totalNutrition
    };

    onSaveRecipe(newRecipe);
    
    // Resetear el formulario si no estamos editando
    if (!editingRecipe) {
      setName('');
      setDescription('');
      setInstructions('');
      setSelectedIngredients([]);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <h2 className="text-xl font-bold mb-4">
        {editingRecipe ? 'Editar Receta' : 'Crear Receta'}
      </h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre de la receta
        </label>
        <input
          type="text"
          placeholder="Ej: Paella valenciana"
          className="w-full p-2 border border-gray-300 rounded-md"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          placeholder="Breve descripción de la receta..."
          className="w-full p-2 border border-gray-300 rounded-md"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ingredientes seleccionados
        </label>
        
        {selectedIngredients.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No hay ingredientes seleccionados</p>
        ) : (
          <div className="space-y-2">
            {selectedIngredients.map((item, index) => (
              <div key={index} className="flex items-center p-2 bg-gray-50 rounded-md">
                <div className="w-8 h-8 bg-gray-200 rounded-md mr-2 flex-shrink-0 overflow-hidden">
                  {item.ingredient.image && (
                    <Image 
                      src={item.ingredient.image} 
                      alt={item.ingredient.name} 
                      width={32} 
                      height={32} 
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium text-sm">{item.ingredient.name}</h3>
                  <p className="text-xs text-gray-500">
                    P: {item.ingredient.proteins}g · G: {item.ingredient.fats}g · HC: {item.ingredient.carbs}g
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    className="w-16 p-1 border border-gray-300 rounded-md text-sm"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(index, parseFloat(e.target.value) || 0)}
                  />
                  <select
                    className="ml-1 p-1 border border-gray-300 rounded-md text-sm"
                    value={item.unit}
                    onChange={(e) => handleUnitChange(index, e.target.value as RecipeIngredient['unit'])}
                  >
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="ml">ml</option>
                    <option value="l">l</option>
                    <option value="unidad">unidad</option>
                    <option value="cucharada">cucharada</option>
                    <option value="taza">taza</option>
                  </select>
                  <button 
                    onClick={() => handleRemoveIngredient(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-md font-medium">Información Nutricional (Total)</h3>
          <button 
            onClick={() => setShowNutritionDetails(!showNutritionDetails)}
            className="text-blue-500 text-sm hover:underline"
          >
            {showNutritionDetails ? 'Ocultar detalles' : 'Ver detalles'}
          </button>
        </div>
        
        {showNutritionDetails ? (
          <NutritionInfo 
            calories={totalNutrition.calories}
            proteins={totalNutrition.proteins}
            fats={totalNutrition.fats}
            carbs={totalNutrition.carbs}
          />
        ) : (
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-gray-50 p-2 rounded-md">
              <p className="text-xs text-gray-500">Calorías</p>
              <p className="font-bold">{Math.round(totalNutrition.calories)} kcal</p>
            </div>
            <div className="bg-gray-50 p-2 rounded-md">
              <p className="text-xs text-gray-500">Proteínas</p>
              <p className="font-bold">{totalNutrition.proteins.toFixed(1)}g</p>
            </div>
            <div className="bg-gray-50 p-2 rounded-md">
              <p className="text-xs text-gray-500">Grasas</p>
              <p className="font-bold">{totalNutrition.fats.toFixed(1)}g</p>
            </div>
            <div className="bg-gray-50 p-2 rounded-md">
              <p className="text-xs text-gray-500">Carbohidratos</p>
              <p className="font-bold">{totalNutrition.carbs.toFixed(1)}g</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Instrucciones
        </label>
        <textarea
          placeholder="Pasos para preparar la receta..."
          className="w-full p-2 border border-gray-300 rounded-md"
          rows={5}
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />
      </div>
      
      <button
        onClick={handleSaveRecipe}
        className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center justify-center"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
        </svg>
        {editingRecipe ? 'Actualizar Receta' : 'Guardar Receta'}
      </button>
    </div>
  );
} 