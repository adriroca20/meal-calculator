export type IngredientCategory = 'Granos' | 'Carnes' | 'Verduras' | 'Frutas' | 'Lácteos' | 'Otros';

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  calories: number; // kcal por 100g
  proteins: number; // gramos por 100g
  fats: number; // gramos por 100g
  carbs: number; // gramos por 100g
  image?: string;
}

export interface RecipeIngredient {
  ingredient: Ingredient;
  quantity: number;
  unit: 'g' | 'kg' | 'ml' | 'l' | 'unidad' | 'cucharada' | 'taza';
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: RecipeIngredient[];
  instructions: string;
  totalNutrition: {
    calories: number;
    proteins: number;
    fats: number;
    carbs: number;
  };
} 