from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.http import JsonResponse
from . import views

# API Root View
def api_root(request):
    return JsonResponse({
        "message": "Reading Comprehension API",
        "version": "1.0", 
        "status": "running",
        "endpoints": {
            "materials": "/api/materials/",
            "questions": "/api/questions/",
            "answers": "/api/answers/",
            "annotations": "/api/annotations/",
            "comments": "/api/comments/",
            "notifications": "/api/notifications/",
            "auth_login": "/api/auth/login/",
            "auth_register": "/api/auth/register/",
            "auth_logout": "/api/auth/logout/",
            "admin": "/admin/"
        }
    })

router = DefaultRouter()
router.register(r'materials', views.ReadingMaterialViewSet)
router.register(r'questions', views.QuestionViewSet)
router.register(r'answers', views.StudentAnswerViewSet)
router.register(r'annotations', views.AnnotationViewSet)
router.register(r'comments', views.CommentViewSet)
router.register(r'notifications', views.NotificationViewSet)

urlpatterns = [
    path('', api_root, name='api_root'),  # ← ルートURL追加
    path('api/', include(router.urls)),
    path('api/auth/login/', views.CustomAuthToken.as_view(), name='api_token_auth'),
    path('api/auth/register/', views.register_user, name='api_register'),
    path('api/auth/logout/', views.logout_user, name='api_logout'),
]
