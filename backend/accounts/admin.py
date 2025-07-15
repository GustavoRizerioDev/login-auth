from django.contrib import admin
from .models import Task

# Register your models here.

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin): 
    list_display = [
        'title', 'user', 'priority', 'status', 
        'due_date', 'created_at', 'is_overdue'
    ]
    list_filter = ['status', 'priority', 'created_at', 'due_date']
    search_fields = ['title', 'description', 'user__username']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at', 'completed_at']
    
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('title', 'description', 'user')
        }),
        ('Configurações', {
            'fields': ('priority', 'status', 'due_date')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'completed_at'),
            'classes': ('collapse',)
        }),
    )
    
    def is_overdue(self, obj):
        """Exibe se a tarefa está atrasada"""
        return obj.is_overdue()
    is_overdue.boolean = True
    is_overdue.short_description = 'Atrasada'
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('user')
