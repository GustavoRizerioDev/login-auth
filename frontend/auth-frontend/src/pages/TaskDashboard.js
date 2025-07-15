import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';
import TaskStats from '../components/TaskStats';

export default function TaskDashboard() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState({ status: 'all', priority: 'all' });
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Verificar se existe token
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user_data');
    
    if (!token) {
      navigate('/login');
      return;
    }
    
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    fetchTasks();
    fetchStats();
  }, [navigate]);

  // Buscar tarefas
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://127.0.0.1:8000/api/tasks/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data);
      setFilteredTasks(response.data);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_data');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Buscar estatísticas
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://127.0.0.1:8000/api/task-stats/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...tasks];
    
    if (filter.status !== 'all') {
      filtered = filtered.filter(task => task.status === filter.status);
    }
    
    if (filter.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filter.priority);
    }
    
    setFilteredTasks(filtered);
  }, [tasks, filter]);

  // Criar ou atualizar tarefa
  const handleSaveTask = async (taskData) => {
    try {
      const token = localStorage.getItem('access_token');
      
      if (editingTask) {
        // Atualizar tarefa existente
        await axios.put(`http://127.0.0.1:8000/api/tasks/${editingTask.id}/`, taskData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Criar nova tarefa
        await axios.post('http://127.0.0.1:8000/api/tasks/', taskData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      fetchTasks();
      fetchStats();
      setShowTaskForm(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
    }
  };

  // Deletar tarefa
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Tem certeza que deseja deletar esta tarefa?')) return;
    
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`http://127.0.0.1:8000/api/tasks/${taskId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      fetchTasks();
      fetchStats();
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
    }
  };

  // Marcar como concluída
  const handleMarkCompleted = async (taskId) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.patch(`http://127.0.0.1:8000/api/tasks/${taskId}/mark_completed/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      fetchTasks();
      fetchStats();
    } catch (error) {
      console.error('Erro ao marcar tarefa como concluída:', error);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    navigate('/login');
  };

  // Editar tarefa
  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  // Obter cor da prioridade
  const getPriorityColor = (priority) => {
    const colors = {
      low: 'text-green-600 bg-green-100',
      medium: 'text-yellow-600 bg-yellow-100',
      high: 'text-orange-600 bg-orange-100',
      urgent: 'text-red-600 bg-red-100'
    };
    return colors[priority] || 'text-gray-600 bg-gray-100';
  };

  // Obter cor do status
  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-gray-600 bg-gray-100',
      in_progress: 'text-blue-600 bg-blue-100',
      completed: 'text-green-600 bg-green-100',
      cancelled: 'text-red-600 bg-red-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando tarefas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation user={user} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estatísticas */}
        {stats && <TaskStats stats={stats} />}

        {/* Filtros e Ações */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              {/* Filtro por Status */}
              <select
                value={filter.status}
                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos os Status</option>
                <option value="pending">Pendente</option>
                <option value="in_progress">Em Progresso</option>
                <option value="completed">Concluída</option>
                <option value="cancelled">Cancelada</option>
              </select>

              {/* Filtro por Prioridade */}
              <select
                value={filter.priority}
                onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todas as Prioridades</option>
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>

            {/* Botão Nova Tarefa */}
            <button
              onClick={() => {
                setEditingTask(null);
                setShowTaskForm(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2"
            >
              <span>+</span>
              <span>Nova Tarefa</span>
            </button>
          </div>
        </div>

        {/* Lista de Tarefas */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma tarefa encontrada
              </h3>
              <p className="text-gray-600 mb-4">
                {tasks.length === 0 
                  ? 'Crie sua primeira tarefa para começar!'
                  : 'Tente ajustar os filtros ou criar uma nova tarefa.'
                }
              </p>
              <button
                onClick={() => {
                  setEditingTask(null);
                  setShowTaskForm(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Criar Primeira Tarefa
              </button>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onMarkCompleted={handleMarkCompleted}
                getPriorityColor={getPriorityColor}
                getStatusColor={getStatusColor}
              />
            ))
          )}
        </div>
      </div>

      {/* Modal do Formulário */}
      {showTaskForm && (
        <TaskForm
          task={editingTask}
          onSave={handleSaveTask}
          onCancel={() => {
            setShowTaskForm(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
}
