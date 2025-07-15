# 🔐 Sistema de Login e Autenticação

Sistema completo de autenticação desenvolvido com Django REST Framework e React, implementando JWT para autenticação segura e interface moderna com Tailwind CSS.

## 🛠 Tecnologias Utilizadas

### Backend
- **Django** 5.2.3 - Framework web Python
- **Django REST Framework** - API REST
- **Simple JWT** - Autenticação JWT
- **PostgreSQL** - Banco de dados
- **CORS Headers** - Configuração CORS
- **python-decouple** - Gerenciamento de variáveis de ambiente

### Frontend
- **React** 18+ - Biblioteca JavaScript
- **React Router DOM** - Roteamento SPA
- **Axios** - Cliente HTTP para API
- **Tailwind CSS** - Framework CSS utilitário

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração de containers

## 🚀 Instalação e Configuração

### Opção 1: Usando Docker (Recomendado)

#### Pré-requisitos
- Docker Desktop
- Docker Compose

```bash
# Clone o repositório
git clone https://github.com/GustavoRizerioDev/login-auth.git
cd login-auth

# Inicie apenas o PostgreSQL
docker-compose up postgres -d

# Execute o backend localmente (recomendado para desenvolvimento)
cd backend
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver

# Execute o frontend (em outro terminal)
cd frontend/auth-frontend
npm install
npm start
```

### Opção 2: Docker Completo

```bash
# Execute todos os serviços com Docker
docker-compose up --build

# Acesse:
# Backend: http://localhost:8000
# PostgreSQL: localhost:5432
```

### Opção 3: Instalação Manual

#### Pré-requisitos
- Python 3.8+
- Node.js 16+
- PostgreSQL 13+
- npm ou yarn

### 1. Clone o repositório
```bash
git clone https://github.com/GustavoRizerioDev/login-auth.git
cd login-auth
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
pip install -r requirements.txt

# Configure o banco PostgreSQL local e crie o arquivo .env:
# DB_HOST=localhost
# DB_NAME=postgres
# DB_USER=postgres
# DB_PASSWORD=12345
# DB_PORT=5432
# DEBUG=True
# SECRET_KEY=sua-chave-secreta-aqui

# Execute as migrações
python manage.py makemigrations
python manage.py migrate

# Crie um superusuário
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

## 📡 API Endpoints

### Autenticação
- `POST /api/register/` - Registro de usuário
- `POST /api/login/` - Login (JWT Token)
- `POST /api/token/refresh/` - Refresh do token JWT

### Usuários
- `GET /api/users/` - Listar usuários (autenticado)
- `GET /api/protected/` - Rota protegida de teste

### 📋 Tarefas (Nova Funcionalidade)
- `GET /api/tasks/` - Listar tarefas do usuário
- `POST /api/tasks/` - Criar nova tarefa
- `GET /api/tasks/{id}/` - Obter tarefa específica
- `PUT /api/tasks/{id}/` - Atualizar tarefa
- `DELETE /api/tasks/{id}/` - Deletar tarefa
- `PATCH /api/tasks/{id}/mark_completed/` - Marcar como concluída
- `GET /api/tasks/completed/` - Listar tarefas concluídas
- `GET /api/tasks/pending/` - Listar tarefas pendentes
- `GET /api/tasks/overdue/` - Listar tarefas atrasadas
- `GET /api/task-stats/` - Estatísticas das tarefas

### Exemplos de Requisições

#### Registro de Usuário
```javascript
POST /api/register/
Content-Type: application/json

{
  "username": "usuario123",
  "email": "usuario@email.com",
  "password": "minhasenha123"
}

// Resposta de sucesso:
{
  "user_id": 1,
  "username": "usuario123",
  "email": "usuario@email.com"
}
```

#### Login
```javascript
POST /api/login/
Content-Type: application/json

{
  "username": "usuario@email.com",
  "password": "minhasenha123"
}

// Resposta de sucesso:
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

#### Acessar Rota Protegida
```javascript
GET /api/protected/
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...

// Resposta:
{
  "msg": "Olá, usuario123!"
}
```

#### Criar Nova Tarefa
```javascript
POST /api/tasks/
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
Content-Type: application/json

{
  "title": "Estudar Django REST Framework",
  "description": "Revisar conceitos de serializers e viewsets",
  "priority": "high",
  "due_date": "2025-07-20T15:00:00Z"
}

// Resposta de sucesso:
{
  "id": 1,
  "title": "Estudar Django REST Framework",
  "description": "Revisar conceitos de serializers e viewsets",
  "priority": "high",
  "status": "pending",
  "due_date": "2025-07-20T15:00:00Z",
  "created_at": "2025-07-15T10:00:00Z",
  "updated_at": "2025-07-15T10:00:00Z",
  "completed_at": null,
  "user": "usuario123",
  "is_overdue": false,
  "is_completed": false
}
```

#### Listar Tarefas do Usuário
```javascript
GET /api/tasks/
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...

// Resposta: Array de tarefas do usuário autenticado
```

#### Obter Estatísticas das Tarefas
```javascript
GET /api/task-stats/
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...

// Resposta:
{
  "total": 10,
  "completed": 3,
  "pending": 5,
  "in_progress": 2,
  "cancelled": 0,
  "overdue": 1,
  "by_priority": {
    "low": 2,
    "medium": 4,
    "high": 3,
    "urgent": 1
  }
}
```

## 🎨 Funcionalidades

### Frontend (React)
- ✅ **Tela de Login** - Interface moderna com validação
- ✅ **Tela de Registro** - Cadastro de novos usuários
- ✅ **Lista de Usuários** - Visualização de usuários cadastrados (protegida)
- ✅ **Autenticação JWT** - Sistema de tokens seguro
- ✅ **Roteamento Protegido** - Controle de acesso às páginas
- ✅ **Design Responsivo** - Interface adaptável com Tailwind CSS
- ✅ **Validação de Formulários** - Feedback visual para o usuário

### Backend (Django REST API)
- ✅ **API RESTful** - Endpoints bem estruturados
- ✅ **Autenticação JWT** - Tokens de acesso e refresh
- ✅ **Sistema de Tarefas** - CRUD completo para gerenciamento de tarefas
- ✅ **Filtros e Estatísticas** - Endpoints avançados para tarefas
- ✅ **Validação de Dados** - Serializers com validação
- ✅ **CORS Configurado** - Comunicação frontend/backend
- ✅ **Admin Interface** - Painel administrativo Django
- ✅ **Banco PostgreSQL** - Persistência de dados robusta
- ✅ **Middlewares de Segurança** - Proteções integradas

### 📋 Sistema de Tarefas
1. **Criação**: Usuários podem criar tarefas com título, descrição, prioridade e data de vencimento
2. **Gerenciamento**: Status (pendente, em progresso, concluída, cancelada)
3. **Prioridades**: Baixa, média, alta, urgente
4. **Filtros**: Por status, prioridade, data de vencimento
5. **Estatísticas**: Dashboard com métricas das tarefas
6. **Segurança**: Cada usuário vê apenas suas próprias tarefas

### Fluxo de Autenticação
1. **Registro**: Usuário cria conta com email/username/senha
2. **Login**: Sistema gera JWT tokens (access + refresh)
3. **Autenticação**: Token enviado no header Authorization
4. **Refresh**: Renovação automática do token de acesso
5. **Logout**: Invalidação local do token

## 🗂 Estrutura do Projeto

```
login-auth/
├── backend/
│   ├── accounts/                # App de autenticação e tarefas
│   │   ├── models.py           # Modelos (User, Task)
│   │   ├── serializers.py      # Serializers da API
│   │   ├── views.py            # Views da API
│   │   ├── admin.py            # Admin interface
│   │   └── urls.py             # URLs do app
│   ├── login_projeto/          # Configurações Django
│   │   ├── settings.py         # Configurações principais
│   │   └── urls.py             # URLs principais
│   ├── requirements.txt        # Dependências Python
│   ├── manage.py              # Script de gerenciamento Django
│   ├── create_sample_tasks.py  # Script para criar tarefas de exemplo
│   ├── TASKS_API.md           # Documentação da API de tarefas
│   └── .env                   # Variáveis de ambiente
├── frontend/
│   └── auth-frontend/         # App React
│       ├── src/
│       │   ├── pages/         # Componentes de página
│       │   │   ├── Login.js   # Página de login
│       │   │   ├── Register.js # Página de registro
│       │   │   └── UserList.js # Lista de usuários
│       │   ├── App.js         # Componente principal
│       │   └── index.js       # Ponto de entrada
│       ├── package.json       # Dependências Node.js
│       └── tailwind.config.js # Configuração Tailwind
├── docker-compose.yml         # Configuração Docker
└── README.md                  # Documentação
```

## 🔧 Configurações Importantes

### Backend Settings (settings.py)
```python
# JWT Authentication
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

# CORS configurado para desenvolvimento
CORS_ALLOW_ALL_ORIGINS = True

# Database PostgreSQL
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME', default='postgres'),
        'USER': config('DB_USER', default='postgres'),
        'PASSWORD': config('DB_PASSWORD', default='12345'),
        'HOST': config('DB_HOST', default='localhost'),
        'PORT': config('DB_PORT', default=5432),
    }
}
```

### Variáveis de Ambiente (.env)
```bash
# Database
DB_HOST=localhost
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=12345
DB_PORT=5432

# Django
DEBUG=True
SECRET_KEY=sua-chave-secreta-aqui
```

### URLs Principais
- **Backend API**: http://localhost:8000/api/
- **Frontend**: http://localhost:3000
- **Django Admin**: http://localhost:8000/admin/
- **PostgreSQL**: localhost:5432

## 🐛 Solução de Problemas

### Problemas Comuns

#### 1. Erro de CORS
```bash
# Verifique se django-cors-headers está instalado
pip install django-cors-headers

# Confirme no settings.py:
INSTALLED_APPS = [..., 'corsheaders']
MIDDLEWARE = ['corsheaders.middleware.CorsMiddleware', ...]
CORS_ALLOW_ALL_ORIGINS = True
```

#### 2. Erro de Banco de Dados
```bash
# Verifique se o PostgreSQL está rodando
docker-compose up postgres -d

# Execute as migrações
python manage.py makemigrations
python manage.py migrate
```

#### 3. Token JWT Inválido
```bash
# Verifique se o token não expirou
# Tokens de acesso expiram em 24h por padrão
# Use o endpoint /api/token/refresh/ para renovar
```

#### 4. Dependências Frontend
```bash
# Se houver erro de módulos
cd frontend/auth-frontend
rm -rf node_modules package-lock.json
npm install
```

#### 5. Problemas com Tarefas
```bash
# Se as tarefas não aparecem, verifique autenticação
# Certifique-se de enviar o token JWT no header Authorization

# Para criar tarefas de exemplo:
cd backend
python manage.py shell < create_sample_tasks.py

# Verificar no Django Admin:
# http://localhost:8000/admin/accounts/task/
```

### Logs Úteis
- **Backend**: Console Django (onde roda `python manage.py runserver`)
- **Frontend**: Console do navegador (F12 → Console)
- **Database**: Docker logs (`docker logs postgres`)
