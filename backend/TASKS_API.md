# 📝 API de Tarefas - Documentação

## Endpoints Disponíveis

### Base URL: `/api/`

## 📋 CRUD de Tarefas (ViewSet)

### 1. Listar todas as tarefas do usuário
```http
GET /api/tasks/
Authorization: Bearer {jwt_token}
```

**Resposta:**
```json
[
    {
        "id": 1,
        "title": "Estudar Django REST Framework",
        "description": "Revisar conceitos de serializers e viewsets",
        "priority": "high",
        "status": "in_progress",
        "due_date": "2025-07-18T10:00:00Z",
        "created_at": "2025-07-15T09:00:00Z",
        "updated_at": "2025-07-15T09:00:00Z",
        "completed_at": null,
        "user": "admin",
        "is_overdue": false,
        "is_completed": false
    }
]
```

### 2. Criar nova tarefa
```http
POST /api/tasks/
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
    "title": "Nova tarefa",
    "description": "Descrição da tarefa",
    "priority": "medium",
    "due_date": "2025-07-20T15:00:00Z"
}
```

### 3. Obter tarefa específica
```http
GET /api/tasks/{id}/
Authorization: Bearer {jwt_token}
```

### 4. Atualizar tarefa
```http
PUT /api/tasks/{id}/
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
    "title": "Título atualizado",
    "description": "Nova descrição",
    "priority": "high",
    "status": "completed"
}
```

### 5. Deletar tarefa
```http
DELETE /api/tasks/{id}/
Authorization: Bearer {jwt_token}
```

## 🎯 Actions Personalizadas

### 6. Marcar como concluída
```http
PATCH /api/tasks/{id}/mark_completed/
Authorization: Bearer {jwt_token}
```

### 7. Listar tarefas concluídas
```http
GET /api/tasks/completed/
Authorization: Bearer {jwt_token}
```

### 8. Listar tarefas pendentes
```http
GET /api/tasks/pending/
Authorization: Bearer {jwt_token}
```

### 9. Listar tarefas atrasadas
```http
GET /api/tasks/overdue/
Authorization: Bearer {jwt_token}
```

### 10. Filtrar por prioridade
```http
GET /api/tasks/by_priority/?priority=high
Authorization: Bearer {jwt_token}
```

## 📊 Estatísticas

### 11. Estatísticas das tarefas
```http
GET /api/task-stats/
Authorization: Bearer {jwt_token}
```

**Resposta:**
```json
{
    "total": 6,
    "completed": 1,
    "pending": 4,
    "in_progress": 1,
    "cancelled": 0,
    "overdue": 1,
    "by_priority": {
        "low": 1,
        "medium": 2,
        "high": 2,
        "urgent": 1
    }
}
```

## 🔧 Endpoints Alternativos (Views simples)

### 12. Listar tarefas com filtros
```http
GET /api/my-tasks/?status=pending&priority=high
Authorization: Bearer {jwt_token}
```

### 13. Criar tarefa (endpoint alternativo)
```http
POST /api/my-tasks/
Authorization: Bearer {jwt_token}
```

### 14. Operações com tarefa específica
```http
GET /api/my-tasks/{id}/
PUT /api/my-tasks/{id}/
DELETE /api/my-tasks/{id}/
Authorization: Bearer {jwt_token}
```

## 📝 Campos do Modelo Task

| Campo | Tipo | Obrigatório | Opções |
|-------|------|-------------|---------|
| `title` | string | ✅ | max 200 caracteres |
| `description` | text | ❌ | - |
| `priority` | choice | ❌ | low, medium, high, urgent |
| `status` | choice | ❌ | pending, in_progress, completed, cancelled |
| `due_date` | datetime | ❌ | ISO 8601 format |
| `created_at` | datetime | - | auto |
| `updated_at` | datetime | - | auto |
| `completed_at` | datetime | - | auto quando status = completed |
| `user` | ForeignKey | - | auto (usuário logado) |

## 🎨 Filtros Disponíveis

- `status`: pending, in_progress, completed, cancelled
- `priority`: low, medium, high, urgent
- `due_date`: filtrar por data
- `created_at`: filtrar por data de criação

## 🔒 Segurança

- Todas as rotas requerem autenticação JWT
- Usuários só podem ver/editar suas próprias tarefas
- Validação automática de dados de entrada
- CORS configurado para desenvolvimento

## 💡 Exemplos de Uso

### Criar uma tarefa urgente
```javascript
const response = await fetch('/api/tasks/', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        title: 'Resolver bug crítico',
        description: 'Bug no sistema de pagamento',
        priority: 'urgent',
        due_date: '2025-07-16T23:59:59Z'
    })
});
```

### Marcar tarefa como concluída
```javascript
const response = await fetch(`/api/tasks/${taskId}/mark_completed/`, {
    method: 'PATCH',
    headers: {
        'Authorization': `Bearer ${token}`
    }
});
```

### Obter estatísticas
```javascript
const response = await fetch('/api/task-stats/', {
    headers: {
        'Authorization': `Bearer ${token}`
    }
});
const stats = await response.json();
console.log(`Total de tarefas: ${stats.total}`);
```
