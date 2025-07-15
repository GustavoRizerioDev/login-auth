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

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('protected/', ProtectedView.as_view(), name='protected'),
    path('users/', UserListView.as_view(), name='users'),
    
    path('', include(router.urls)),
    
    path('my-tasks/', TaskListView.as_view(), name='my-tasks'),
    path('my-tasks/<int:pk>/', TaskDetailView.as_view(), name='task-detail'),
    path('task-stats/', TaskStatsView.as_view(), name='task-stats'),
]