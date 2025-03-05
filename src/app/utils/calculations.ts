import { RecipeIngredient } from '../types';

// Convertir unidades a gramos
export const convertToGrams = (quantity: number, unit: string): number => {
  switch (unit) {
    case 'kg':
      return quantity * 1000;
    case 'g':
      return quantity;
    case 'ml':
      return quantity; // Asumimos densidad 1:1 para simplificar
    case 'l':
      return quantity * 1000;
    case 'unidad':
      return quantity * 100; // Asumimos 100g por unidad como promedio
    case 'cucharada':
      return quantity * 15; // Aproximadamente 15g por cucharada
    case 'taza':
      return quantity * 240; // Aproximadamente 240g por taza
    default:
      return quantity;
  }
};

// Calcular nutrientes para un ingrediente específico
export const calculateIngredientNutrition = (ingredient: RecipeIngredient) => {
  const grams = convertToGrams(ingredient.quantity, ingredient.unit);
  const ratio = grams / 100; // Los valores nutricionales están por 100g
  
  return {
    calories: ingredient.ingredient.calories * ratio,
    proteins: ingredient.ingredient.proteins * ratio,
    fats: ingredient.ingredient.fats * ratio,
    carbs: ingredient.ingredient.carbs * ratio
  };
};

// Calcular nutrientes totales para una receta
export const calculateTotalNutrition = (ingredients: RecipeIngredient[]) => {
  return ingredients.reduce((total, ingredient) => {
    const nutrition = calculateIngredientNutrition(ingredient);
    
    return {
      calories: total.calories + nutrition.calories,
      proteins: total.proteins + nutrition.proteins,
      fats: total.fats + nutrition.fats,
      carbs: total.carbs + nutrition.carbs
    };
  }, { calories: 0, proteins: 0, fats: 0, carbs: 0 });
}; 