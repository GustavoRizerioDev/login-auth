# 🔐 Sistema de Login e Autenticação

## 🛠 Tecnologias Utilizadas

### Backend
- **Django** 5.2.3 - Framework web Python
- **Django REST Framework** - API REST
- **Simple JWT** - Autenticação JWT
- **SQLite** - Banco de dados
- **CORS Headers** - Configuração CORS

### Frontend
- **React** 19.1.0 - Biblioteca JavaScript
- **React Router DOM** 7.6.3 - Roteamento
- **Axios** 1.10.0 - Cliente HTTP
- **Tailwind CSS** - Estilização (classes utilitárias)

## 🚀 Instalação e Configuração

### Pré-requisitos
- Python 3.8+
- Node.js 14+
- npm ou yarn

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd login_app
```

### 2. Configuração do Backend

```bash
# Navegue para o diretório do backend
cd backend

# Crie um ambiente virtual (recomendado)
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Instale as dependências
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers

# Execute as migrações
python manage.py makemigrations
python manage.py migrate

# Crie um superusuário (opcional)
python manage.py createsuperuser

# Inicie o servidor
python manage.py runserver
```

### 3. Configuração do Frontend

```bash
# Abra um novo terminal e navegue para o frontend
cd frontend/auth-frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm start
```

### Exemplos de Requisições

#### Registro
```javascript
POST /api/register/
{
  "username": "usuario",
  "email": "usuario@email.com",
  "password": "senha123"
}
```

#### Login
```javascript
POST /api/login/
{
  "username": "usuario",
  "password": "senha123"
}
```

## 🎨 Funcionalidades

### Tela de Login
- ✅ Formulário de autenticação
- ✅ Validação de credenciais
- ✅ Redirecionamento após login
- ✅ Link para registro

### Tela de Registro
- ✅ Formulário de cadastro
- ✅ Validação de dados
- ✅ Confirmação de cadastro
- ✅ Link para login

## 🔧 Configurações Importantes

### Backend Settings
```python
# CORS configurado para desenvolvimento
CORS_ALLOW_ALL_ORIGINS = True

# JWT Authentication
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}
```

### Frontend Axios Config
- Base URL: `http://127.0.0.1:8000/api/`
- Headers: `Authorization: Bearer {token}`

## 🐛 Solução de Problemas

### Problemas Comuns

1. **CORS Error**: Verifique se `django-cors-headers` está instalado e configurado
2. **Token Inválido**: Verifique se o token JWT não expirou
3. **Rota não encontrada**: Confirme se ambos os servidores estão rodando
4. **Module not found**: Execute `npm install` no frontend

### Logs Úteis
- Backend: Console do Django
- Frontend: Console do navegador (F12)