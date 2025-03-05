import { NextRequest, NextResponse } from 'next/server';
import { Ingredient } from '@/app/types';
import OpenFoodFacts from "openfoodfacts-nodejs";

// Función para mapear las categorías de OpenFoodFacts a nuestras categorías
const mapCategory = (category: string) => {
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
const convertToIngredient = (product: any) => {
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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');
    const barcode = searchParams.get('barcode');
    const locale = searchParams.get('locale') || 'es';

    if (!query && !barcode) {
      return NextResponse.json(
        { error: 'Se requiere un parámetro de búsqueda (query o barcode)' },
        { status: 400 }
      );
    }

    let result;

    if (barcode) {
      // Buscar por código de barras
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      
      if (!response.ok) {
        return NextResponse.json(
          { error: 'Error al obtener el producto' },
          { status: response.status }
        );
      }
      
      const data = await response.json();
      
      if (!data || !data.product) {
        return NextResponse.json(
          { error: 'Producto no encontrado' },
          { status: 404 }
        );
      }
      
      const ingredient = convertToIngredient(data.product);
      result = { ingredient };
    } else if (query) {
      // Buscar por término
      const response = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=10&lc=${locale}`);
      
      if (!response.ok) {
        return NextResponse.json(
          { error: 'Error al buscar productos' },
          { status: response.status }
        );
      }
      
      const data = await response.json();

      if (!data || !data.products) {
        return NextResponse.json(
          { error: 'Error al buscar productos' },
          { status: 500 }
        );
      }

      const ingredients = data.products
        .map(convertToIngredient)
        .filter((ingredient: Ingredient | null) => ingredient !== null);
      
      result = { ingredients };
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error en la API de OpenFoodFacts:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
} 