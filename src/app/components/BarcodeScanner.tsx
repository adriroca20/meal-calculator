'use client';

import { useState } from 'react';
import { Ingredient } from '../types';
import { getIngredientByBarcode } from '../services/openFoodFactsService';

interface BarcodeScannerProps {
  onIngredientFound: (ingredient: Ingredient) => void;
}

export default function BarcodeScanner({ onIngredientFound }: BarcodeScannerProps) {
  const [barcode, setBarcode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!barcode) {
      setError('Por favor, introduce un código de barras');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const ingredient = await getIngredientByBarcode(barcode);
      
      if (ingredient) {
        onIngredientFound(ingredient);
        setBarcode('');
      } else {
        setError('No se encontró ningún producto con ese código de barras');
      }
    } catch (err) {
      setError('Error al buscar el producto. Inténtalo de nuevo.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-md mb-4">
      <h3 className="text-lg font-medium mb-2">Buscar por código de barras</h3>
      
      <div className="flex">
        <input
          type="text"
          placeholder="Introduce el código de barras"
          className="flex-grow p-2 border border-gray-300 rounded-l-md"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md disabled:bg-blue-300"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            'Buscar'
          )}
        </button>
      </div>
      
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
      
      <p className="text-xs text-gray-500 mt-2">
        Introduce el código de barras del producto para buscarlo en la base de datos de OpenFoodFacts
      </p>
    </div>
  );
} 