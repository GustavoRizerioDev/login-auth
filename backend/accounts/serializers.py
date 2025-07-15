# accounts/serializers.py
from django.contrib.auth.models import User
from rest_framework import serializers
from django.utils import timezone
from .models import Task

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password']
        )
        return user
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.save()
        return instance
    
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        if not data.get('username') or not data.get('password'):
            raise serializers.ValidationError("Username and password are required.")
        return data

class TaskSerializer(serializers.ModelSerializer):
    """Serializer para o modelo Task"""
    
    user = serializers.StringRelatedField(read_only=True)
    is_overdue = serializers.ReadOnlyField()
    is_completed = serializers.ReadOnlyField()
    
    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'priority', 'status',
            'due_date', 'created_at', 'updated_at', 'completed_at',
            'user', 'is_overdue', 'is_completed'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'completed_at', 'user']
    
    def create(self, validated_data):
        """Cria uma nova tarefa associada ao usuário logado"""
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class TaskCreateSerializer(serializers.ModelSerializer):
    """Serializer simplificado para criação de tarefas"""
    
    class Meta:
        model = Task
        fields = ['title', 'description', 'priority', 'due_date']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class TaskUpdateSerializer(serializers.ModelSerializer):
    """Serializer para atualização de tarefas"""
    
    class Meta:
        model = Task
        fields = ['title', 'description', 'priority', 'status', 'due_date']
    
    def update(self, instance, validated_data):
        # Se mudando para concluída, definir data de conclusão
        if validated_data.get('status') == 'completed' and instance.status != 'completed':
            validated_data['completed_at'] = timezone.now()
        # Se mudando de concluída para outro status, remover data de conclusão
        elif validated_data.get('status') != 'completed' and instance.status == 'completed':
            validated_data['completed_at'] = None
        
        return super().update(instance, validated_data)

class TaskStatusSerializer(serializers.ModelSerializer):
    """Serializer apenas para atualização do status"""
    
    class Meta:
        model = Task
        fields = ['status']
    
    def update(self, instance, validated_data):
        if validated_data.get('status') == 'completed':
            instance.mark_as_completed()
        else:
            instance.status = validated_data.get('status', instance.status)
            if instance.status != 'completed':
                instance.completed_at = None
            instance.save()
        return instance
