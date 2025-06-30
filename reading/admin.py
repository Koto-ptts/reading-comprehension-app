from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Group, ReadingMaterial, Question, StudentAnswer, Annotation, Comment, Notification

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'user_type', 'student_id', 'grade', 'is_staff', 'date_joined')
    list_filter = ('user_type', 'is_staff', 'is_superuser', 'grade')
    search_fields = ('username', 'student_id')
    
    fieldsets = UserAdmin.fieldsets + (
        ('追加情報', {'fields': ('user_type', 'student_id', 'grade')}),
    )

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Group)
admin.site.register(ReadingMaterial)
admin.site.register(Question)
admin.site.register(StudentAnswer)
admin.site.register(Annotation)
admin.site.register(Comment)
admin.site.register(Notification)
