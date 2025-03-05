'use client';

interface NutritionInfoProps {
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
}

export default function NutritionInfo({ calories, proteins, fats, carbs }: NutritionInfoProps) {
  // Calcular los porcentajes para el gráfico circular
  const total = proteins + fats + carbs;
  const proteinPercentage = total > 0 ? (proteins / total) * 100 : 0;
  const fatPercentage = total > 0 ? (fats / total) * 100 : 0;
  const carbPercentage = total > 0 ? (carbs / total) * 100 : 0;
  
  // Calcular los colores para el gráfico circular
  const proteinColor = 'bg-blue-500';
  const fatColor = 'bg-yellow-500';
  const carbColor = 'bg-green-500';
  
  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <h3 className="text-lg font-medium mb-4">Información Nutricional</h3>
      
      <div className="flex items-center justify-between mb-6">
        <div className="text-center">
          <p className="text-3xl font-bold">{Math.round(calories)}</p>
          <p className="text-sm text-gray-500">kcal</p>
        </div>
        
        <div className="relative w-24 h-24">
          {/* Gráfico circular */}
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#e5e7eb"
              strokeWidth="20"
            />
            {/* Proteínas */}
            {proteinPercentage > 0 && (
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#3b82f6"
                strokeWidth="20"
                strokeDasharray={`${proteinPercentage * 2.51} 251`}
                strokeDashoffset="0"
                transform="rotate(-90 50 50)"
              />
            )}
            {/* Grasas */}
            {fatPercentage > 0 && (
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#eab308"
                strokeWidth="20"
                strokeDasharray={`${fatPercentage * 2.51} 251`}
                strokeDashoffset={`${-proteinPercentage * 2.51}`}
                transform="rotate(-90 50 50)"
              />
            )}
            {/* Carbohidratos */}
            {carbPercentage > 0 && (
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#22c55e"
                strokeWidth="20"
                strokeDasharray={`${carbPercentage * 2.51} 251`}
                strokeDashoffset={`${-(proteinPercentage + fatPercentage) * 2.51}`}
                transform="rotate(-90 50 50)"
              />
            )}
          </svg>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2 rounded-md">
          <div className="flex items-center mb-1">
            <div className={`w-3 h-3 rounded-full ${proteinColor} mr-2`}></div>
            <p className="text-sm font-medium">Proteínas</p>
          </div>
          <p className="text-lg font-bold">{proteins.toFixed(1)}g</p>
          <p className="text-xs text-gray-500">{Math.round(proteinPercentage)}%</p>
        </div>
        
        <div className="p-2 rounded-md">
          <div className="flex items-center mb-1">
            <div className={`w-3 h-3 rounded-full ${fatColor} mr-2`}></div>
            <p className="text-sm font-medium">Grasas</p>
          </div>
          <p className="text-lg font-bold">{fats.toFixed(1)}g</p>
          <p className="text-xs text-gray-500">{Math.round(fatPercentage)}%</p>
        </div>
        
        <div className="p-2 rounded-md">
          <div className="flex items-center mb-1">
            <div className={`w-3 h-3 rounded-full ${carbColor} mr-2`}></div>
            <p className="text-sm font-medium">Carbohidratos</p>
          </div>
          <p className="text-lg font-bold">{carbs.toFixed(1)}g</p>
          <p className="text-xs text-gray-500">{Math.round(carbPercentage)}%</p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t">
        <h4 className="text-sm font-medium mb-2">Distribución calórica</h4>
        <div className="flex h-6 rounded-md overflow-hidden">
          <div 
            className="bg-blue-500" 
            style={{ width: `${proteinPercentage}%` }}
            title={`Proteínas: ${Math.round(proteins * 4)} kcal`}
          ></div>
          <div 
            className="bg-yellow-500" 
            style={{ width: `${fatPercentage}%` }}
            title={`Grasas: ${Math.round(fats * 9)} kcal`}
          ></div>
          <div 
            className="bg-green-500" 
            style={{ width: `${carbPercentage}%` }}
            title={`Carbohidratos: ${Math.round(carbs * 4)} kcal`}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{Math.round(proteins * 4)} kcal</span>
          <span>{Math.round(fats * 9)} kcal</span>
          <span>{Math.round(carbs * 4)} kcal</span>
        </div>
      </div>
    </div>
  );
} 