import { Ingredient, IngredientCategory } from '../types';

// Función para mapear las categorías de OpenFoodFacts a nuestras categorías
const mapCategory = (category: string): IngredientCategory => {
  const lowerCategory = category.toLowerCase();
  
  if (lowerCategory.includes('cereal') || lowerCategory.includes('pasta') || lowerCategory.includes('arroz')) {
    return 'Granos';
  } else if (lowerCategory.includes('carne') || lowerCategory.includes('pollo') || lowerCategory.includes('pescado')) {
    return 'Carnes';
  } else if (lowerCategory.includes('verdura') || lowerCategory.includes('vegetal') || lowerCategory.includes('hortaliza')) {
    return 'Verduras';
  } else if (lowerCategory.includes('fruta')) {
    return 'Frutas';
  } else if (lowerCategory.includes('leche') || lowerCategory.includes('queso') || lowerCategory.includes('yogur')) {
    return 'Lácteos';
  } else {
    return 'Otros';
  }
};

// Función para convertir un producto de OpenFoodFacts a nuestro formato de ingrediente
const convertToIngredient = (product: any): Ingredient | null => {
  if (!product || !product.product_name || !product.nutriments) {
    return null;
  }

  const nutriments = product.nutriments;
  
  return {
    id: product._id || `off-${Date.now()}`,
    name: product.product_name,
    category: product.categories ? mapCategory(product.categories) : 'Otros',
    calories: nutriments['energy-kcal_100g'] || nutriments['energy-kcal'] || 0,
    proteins: nutriments.proteins_100g || nutriments.proteins || 0,
    fats: nutriments.fat_100g || nutriments.fat || 0,
    carbs: nutriments.carbohydrates_100g || nutriments.carbohydrates || 0,
    image: product.image_url || undefined
  };
};

// Función para buscar ingredientes por nombre usando nuestra API
export const searchIngredients = async (query: string, locale: string = 'es'): Promise<Ingredient[]> => {
  try {
    const response = await fetch(`/api/openfoodfacts?query=${encodeURIComponent(query)}&locale=${locale}`);
    
    if (!response.ok) {
      throw new Error(`Error en la búsqueda: ${response.statusText}`);
    }
    
    const data = await response.json();

    if (!data || !data.ingredients) {
      return [];
    }

    return data.ingredients;
  } catch (error) {
    console.error('Error al buscar ingredientes:', error);
    return [];
  }
};

// Función para obtener un ingrediente por su código de barras usando nuestra API
export const getIngredientByBarcode = async (barcode: string): Promise<Ingredient | null> => {
  try {
    const response = await fetch(`/api/openfoodfacts?barcode=${barcode}`);
    
    if (!response.ok) {
      throw new Error(`Error al obtener el producto: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data || !data.ingredient) {
      return null;
    }
    
    return data.ingredient;
  } catch (error) {
    console.error('Error al obtener ingrediente por código de barras:', error);
    return null;
  }
}; 