from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .serializers import RegisterSerializer
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import serializers

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


