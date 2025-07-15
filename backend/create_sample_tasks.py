# Script para criar tarefas de exemplo
# Execute: python manage.py shell < create_sample_tasks.py

from django.contrib.auth.models import User
from accounts.models import Task
from django.utils import timezone
from datetime import timedelta

# Buscar o primeiro usuário (ou criar um admin se não existir)
try:
    user = User.objects.first()
    if not user:
        user = User.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='admin123'
        )
        print(f"Usuário admin criado: {user.username}")
    else:
        print(f"Usando usuário existente: {user.username}")
except Exception as e:
    print(f"Erro ao obter/criar usuário: {e}")
    exit()

# Tarefas de exemplo
sample_tasks = [
    {
        'title': 'Estudar Django REST Framework',
        'description': 'Revisar conceitos de serializers e viewsets',
        'priority': 'high',
        'status': 'in_progress',
        'due_date': timezone.now() + timedelta(days=3)
    },
    {
        'title': 'Implementar autenticação JWT',
        'description': 'Configurar tokens de acesso e refresh',
        'priority': 'urgent',
        'status': 'completed',
        'due_date': timezone.now() - timedelta(days=1)
    },
    {
        'title': 'Criar interface React',
        'description': 'Desenvolver componentes para lista de tarefas',
        'priority': 'medium',
        'status': 'pending',
        'due_date': timezone.now() + timedelta(days=7)
    },
    {
        'title': 'Documentar API',
        'description': 'Atualizar README com endpoints das tarefas',
        'priority': 'low',
        'status': 'pending',
        'due_date': timezone.now() + timedelta(days=14)
    },
    {
        'title': 'Configurar Docker',
        'description': 'Otimizar containers para produção',
        'priority': 'medium',
        'status': 'in_progress',
        'due_date': timezone.now() + timedelta(days=5)
    },
    {
        'title': 'Testes unitários',
        'description': 'Escrever testes para models e views',
        'priority': 'high',
        'status': 'pending',
        'due_date': timezone.now() + timedelta(days=10)
    }
]

# Criar as tarefas
created_tasks = []
for task_data in sample_tasks:
    task = Task.objects.create(user=user, **task_data)
    created_tasks.append(task)
    print(f"Tarefa criada: {task.title} ({task.get_status_display()})")

print(f"\n{len(created_tasks)} tarefas de exemplo criadas com sucesso!")
print(f"Total de tarefas do usuário {user.username}: {Task.objects.filter(user=user).count()}")
