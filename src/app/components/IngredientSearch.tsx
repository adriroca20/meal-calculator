'use client';

import { useState, useEffect } from 'react';
import { Ingredient } from '../types';
import Image from 'next/image';
import { searchIngredients } from '../services/openFoodFactsService';
import { ingredients as localIngredients } from '../data/ingredients';

interface IngredientSearchProps {
  ingredients?: Ingredient[];
  onAddIngredient: (ingredient: Ingredient) => void;
}

export default function IngredientSearch({ ingredients = localIngredients, onAddIngredient }: IngredientSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'Ingredientes' | 'Platos'>('Ingredientes');
  const [searchResults, setSearchResults] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [useLocalIngredients, setUseLocalIngredients] = useState(true);
  
  // Filtrar ingredientes locales
  const filteredLocalIngredients = ingredients.filter(ingredient => 
    ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Buscar ingredientes en OpenFoodFacts cuando cambia el término de búsqueda
  useEffect(() => {
    const fetchIngredients = async () => {
      if (searchTerm.length < 3 || useLocalIngredients) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await searchIngredients(searchTerm);
        setSearchResults(results);
      } catch (error) {
        console.error('Error al buscar ingredientes:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce para evitar demasiadas llamadas a la API
    const timeoutId = setTimeout(fetchIngredients, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, useLocalIngredients]);

  // Combinar resultados locales y de la API
  const displayedIngredients = useLocalIngredients 
    ? filteredLocalIngredients 
    : searchResults;

  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <h2 className="text-xl font-bold mb-4">Buscar Ingredientes</h2>
      
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Buscar ingredientes o platos..."
          className="w-full p-2 border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>
      
      <div className="flex border-b mb-4">
        <button 
          className={`flex-1 py-2 text-center ${activeTab === 'Ingredientes' ? 'border-b-2 border-blue-500 font-medium text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('Ingredientes')}
        >
          Ingredientes
        </button>
        <button 
          className={`flex-1 py-2 text-center ${activeTab === 'Platos' ? 'border-b-2 border-blue-500 font-medium text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('Platos')}
        >
          Platos
        </button>
      </div>
      
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={useLocalIngredients}
            onChange={() => setUseLocalIngredients(!useLocalIngredients)}
            className="mr-2"
          />
          <span className="text-sm">Usar ingredientes locales</span>
        </label>
        {!useLocalIngredients && searchTerm.length < 3 && (
          <p className="text-xs text-gray-500 mt-1">Escribe al menos 3 caracteres para buscar en OpenFoodFacts</p>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="max-h-96 overflow-y-auto">
          {displayedIngredients.length === 0 ? (
            <p className="text-center py-4 text-gray-500">
              {searchTerm.length < 3 && !useLocalIngredients 
                ? 'Escribe al menos 3 caracteres para buscar' 
                : 'No se encontraron ingredientes'}
            </p>
          ) : (
            displayedIngredients.map(ingredient => (
              <div key={ingredient.id} className="flex items-center p-2 border-b hover:bg-gray-50">
                <div className="w-10 h-10 bg-gray-200 rounded-md mr-3 flex-shrink-0 overflow-hidden">
                  {ingredient.image && (
                    <Image 
                      src={ingredient.image} 
                      alt={ingredient.name} 
                      width={40} 
                      height={40} 
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium">{ingredient.name}</h3>
                  <p className="text-sm text-gray-500">{ingredient.category} · {ingredient.calories} cal.</p>
                  <p className="text-xs text-gray-400">
                    P: {ingredient.proteins}g · G: {ingredient.fats}g · HC: {ingredient.carbs}g
                  </p>
                </div>
                <button 
                  onClick={() => onAddIngredient(ingredient)}
                  className="ml-2 text-xl text-gray-400 hover:text-blue-500"
                >
                  +
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
} 