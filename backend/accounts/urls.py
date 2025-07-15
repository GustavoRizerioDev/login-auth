from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProtectedView, RegisterView, UserListView,
    TaskViewSet, TaskListView, TaskDetailView, TaskStatsView
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

# Router para ViewSets
router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    # Autenticação
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Usuários
    path('protected/', ProtectedView.as_view(), name='protected'),
    path('users/', UserListView.as_view(), name='users'),
    
    # Tarefas - ViewSet routes (CRUD completo)
    path('', include(router.urls)),
    
    # Tarefas - Views customizadas alternativas
    path('my-tasks/', TaskListView.as_view(), name='my-tasks'),
    path('my-tasks/<int:pk>/', TaskDetailView.as_view(), name='task-detail'),
    path('task-stats/', TaskStatsView.as_view(), name='task-stats'),
]