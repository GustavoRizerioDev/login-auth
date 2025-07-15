export default function TaskStats({ stats }) {
  if (!stats) return null;

  const progressPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total de Tarefas */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-lg">📋</span>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
        </div>
      </div>

      {/* Tarefas Concluídas */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-lg">✅</span>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Concluídas</p>
            <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            <p className="text-xs text-green-600">{progressPercentage}% do total</p>
          </div>
        </div>
      </div>

      {/* Tarefas Pendentes */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-yellow-600 text-lg">⏳</span>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Pendentes</p>
            <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
          </div>
        </div>
      </div>

      {/* Tarefas Atrasadas */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-red-600 text-lg">⚠️</span>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Atrasadas</p>
            <p className="text-2xl font-bold text-gray-900">{stats.overdue}</p>
          </div>
        </div>
      </div>

      {/* Progresso Geral */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 md:col-span-2 lg:col-span-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Progresso Geral</h3>
          <span className="text-sm text-gray-600">{progressPercentage}%</span>
        </div>
        
        {/* Barra de Progresso */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        {/* Detalhes por Status */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-600">{stats.pending}</p>
            <p className="text-xs text-gray-500">Pendentes</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">{stats.in_progress}</p>
            <p className="text-xs text-gray-500">Em Progresso</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            <p className="text-xs text-gray-500">Concluídas</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
            <p className="text-xs text-gray-500">Canceladas</p>
          </div>
        </div>
      </div>

      {/* Distribuição por Prioridade */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 md:col-span-2 lg:col-span-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Distribuição por Prioridade</h3>
        
        <div className="space-y-3">
          {/* Urgente */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              <span className="text-sm text-gray-700">Urgente</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: stats.total > 0 ? `${(stats.by_priority.urgent / stats.total) * 100}%` : '0%' 
                  }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900 w-8">{stats.by_priority.urgent}</span>
            </div>
          </div>

          {/* Alta */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
              <span className="text-sm text-gray-700">Alta</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: stats.total > 0 ? `${(stats.by_priority.high / stats.total) * 100}%` : '0%' 
                  }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900 w-8">{stats.by_priority.high}</span>
            </div>
          </div>

          {/* Média */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
              <span className="text-sm text-gray-700">Média</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: stats.total > 0 ? `${(stats.by_priority.medium / stats.total) * 100}%` : '0%' 
                  }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900 w-8">{stats.by_priority.medium}</span>
            </div>
          </div>

          {/* Baixa */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span className="text-sm text-gray-700">Baixa</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: stats.total > 0 ? `${(stats.by_priority.low / stats.total) * 100}%` : '0%' 
                  }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900 w-8">{stats.by_priority.low}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
