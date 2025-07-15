from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .serializers import (
    RegisterSerializer, TaskSerializer, TaskCreateSerializer, 
    TaskUpdateSerializer, TaskStatusSerializer
)
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import serializers
from rest_framework.decorators import action
from rest_framework.viewsets import ModelViewSet
from django.db.models import Q
from .models import Task

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user_id": user.id,
            "username": user.username,
            "email": user.email,
        }, status=status.HTTP_201_CREATED)

class LoginView(generics.GenericAPIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({"token": token.key})
        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
    
class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"msg": f"Olá, {request.user.username}!"})

# Serializer para retornar informações do usuário
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'date_joined']

class UserListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

# Views para Tasks
class TaskViewSet(ModelViewSet):
    """ViewSet completo para gerenciar tarefas"""
    
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Retorna apenas as tarefas do usuário logado"""
        return Task.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        """Retorna o serializer apropriado baseado na action"""
        if self.action == 'create':
            return TaskCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return TaskUpdateSerializer
        return TaskSerializer
    
    def perform_create(self, serializer):
        """Associa a tarefa ao usuário logado"""
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['patch'])
    def mark_completed(self, request, pk=None):
        """Action para marcar tarefa como concluída"""
        task = self.get_object()
        task.mark_as_completed()
        serializer = TaskSerializer(task)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def completed(self, request):
        """Retorna apenas tarefas concluídas"""
        completed_tasks = self.get_queryset().filter(status='completed')
        serializer = TaskSerializer(completed_tasks, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Retorna apenas tarefas pendentes"""
        pending_tasks = self.get_queryset().filter(status='pending')
        serializer = TaskSerializer(pending_tasks, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def overdue(self, request):
        """Retorna tarefas atrasadas"""
        overdue_tasks = []
        for task in self.get_queryset().filter(status__in=['pending', 'in_progress']):
            if task.is_overdue():
                overdue_tasks.append(task)
        serializer = TaskSerializer(overdue_tasks, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_priority(self, request):
        """Retorna tarefas agrupadas por prioridade"""
        priority = request.query_params.get('priority', None)
        if priority:
            tasks = self.get_queryset().filter(priority=priority)
        else:
            tasks = self.get_queryset()
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

class TaskListView(APIView):
    """View simples para listar tarefas do usuário"""
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        tasks = Task.objects.filter(user=request.user)
        
        # Filtros opcionais
        status_filter = request.query_params.get('status', None)
        priority_filter = request.query_params.get('priority', None)
        
        if status_filter:
            tasks = tasks.filter(status=status_filter)
        
        if priority_filter:
            tasks = tasks.filter(priority=priority_filter)
        
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = TaskCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TaskDetailView(APIView):
    """View para operações detalhadas com uma tarefa específica"""
    
    permission_classes = [IsAuthenticated]
    
    def get_object(self, pk, user):
        try:
            return Task.objects.get(pk=pk, user=user)
        except Task.DoesNotExist:
            return None
    
    def get(self, request, pk):
        task = self.get_object(pk, request.user)
        if not task:
            return Response({"error": "Tarefa não encontrada"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = TaskSerializer(task)
        return Response(serializer.data)
    
    def put(self, request, pk):
        task = self.get_object(pk, request.user)
        if not task:
            return Response({"error": "Tarefa não encontrada"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = TaskUpdateSerializer(task, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(TaskSerializer(task).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        task = self.get_object(pk, request.user)
        if not task:
            return Response({"error": "Tarefa não encontrada"}, status=status.HTTP_404_NOT_FOUND)
        
        task.delete()
        return Response({"message": "Tarefa deletada com sucesso"}, status=status.HTTP_204_NO_CONTENT)

class TaskStatsView(APIView):
    """View para estatísticas das tarefas do usuário"""
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user_tasks = Task.objects.filter(user=request.user)
        
        stats = {
            'total': user_tasks.count(),
            'completed': user_tasks.filter(status='completed').count(),
            'pending': user_tasks.filter(status='pending').count(),
            'in_progress': user_tasks.filter(status='in_progress').count(),
            'cancelled': user_tasks.filter(status='cancelled').count(),
            'overdue': sum(1 for task in user_tasks.filter(status__in=['pending', 'in_progress']) if task.is_overdue()),
            'by_priority': {
                'low': user_tasks.filter(priority='low').count(),
                'medium': user_tasks.filter(priority='medium').count(),
                'high': user_tasks.filter(priority='high').count(),
                'urgent': user_tasks.filter(priority='urgent').count(),
            }
        }
        
        return Response(stats)


