import { useState } from 'react';

export default function TaskCard({ task, onEdit, onDelete, onMarkCompleted, getPriorityColor, getStatusColor }) {
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Formatar data
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Verificar se está atrasada
  const isOverdue = task.is_overdue && task.status !== 'completed';
  
  // Verificar se está próxima do vencimento (menos de 24h)
  const isNearDue = () => {
    if (!task.due_date || task.status === 'completed') return false;
    const now = new Date();
    const dueDate = new Date(task.due_date);
    const diffHours = (dueDate - now) / (1000 * 60 * 60);
    return diffHours > 0 && diffHours <= 24;
  };

  // Traduzir prioridade
  const translatePriority = (priority) => {
    const translations = {
      low: 'Baixa',
      medium: 'Média',
      high: 'Alta',
      urgent: 'Urgente'
    };
    return translations[priority] || priority;
  };

  // Traduzir status
  const translateStatus = (status) => {
    const translations = {
      pending: 'Pendente',
      in_progress: 'Em Progresso',
      completed: 'Concluída',
      cancelled: 'Cancelada'
    };
    return translations[status] || status;
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border-l-4 p-6 hover:shadow-md transition-shadow ${
      isOverdue ? 'border-l-red-500' : 
      task.status === 'completed' ? 'border-l-green-500' :
      task.priority === 'urgent' ? 'border-l-red-400' :
      task.priority === 'high' ? 'border-l-orange-400' :
      'border-l-blue-400'
    }`}>
      {/* Header da Tarefa */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className={`text-lg font-semibold mb-2 ${
            task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
          }`}>
            {task.title}
          </h3>
          
          {/* Tags de Status e Prioridade */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
              {translateStatus(task.status)}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
              {translatePriority(task.priority)}
            </span>
            {isOverdue && (
              <span className="px-2 py-1 rounded-full text-xs font-medium text-red-600 bg-red-100">
                ⚠️ Atrasada
              </span>
            )}
            {isNearDue() && (
              <span className="px-2 py-1 rounded-full text-xs font-medium text-yellow-600 bg-yellow-100">
                ⏰ Vence em breve
              </span>
            )}
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center space-x-2 ml-4">
          {task.status !== 'completed' && (
            <button
              onClick={() => onMarkCompleted(task.id)}
              className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
              title="Marcar como concluída"
            >
              ✓
            </button>
          )}
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            title="Editar tarefa"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
            title="Deletar tarefa"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Descrição */}
      {task.description && (
        <div className="mb-4">
          <p className={`text-gray-600 ${
            showFullDescription ? '' : 'line-clamp-2'
          }`}>
            {task.description}
          </p>
          {task.description.length > 100 && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-1"
            >
              {showFullDescription ? 'Ver menos' : 'Ver mais'}
            </button>
          )}
        </div>
      )}

      {/* Datas */}
      <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-500 space-y-1 sm:space-y-0">
        <div className="flex flex-col space-y-1">
          <span>📅 Criada: {formatDate(task.created_at)}</span>
          {task.due_date && (
            <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
              ⏰ Vencimento: {formatDate(task.due_date)}
            </span>
          )}
        </div>
        
        {task.completed_at && (
          <div className="text-green-600">
            ✅ Concluída: {formatDate(task.completed_at)}
          </div>
        )}
      </div>

      {/* Barra de Progresso Visual (baseada no status) */}
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              task.status === 'completed' ? 'bg-green-500 w-full' :
              task.status === 'in_progress' ? 'bg-blue-500 w-1/2' :
              task.status === 'cancelled' ? 'bg-red-500 w-full' :
              'bg-gray-400 w-1/4'
            }`}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Pendente</span>
          <span>Em Progresso</span>
          <span>Concluída</span>
        </div>
      </div>
    </div>
  );
}
