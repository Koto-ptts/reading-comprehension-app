from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'materials', views.ReadingMaterialViewSet)
router.register(r'questions', views.QuestionViewSet)
router.register(r'answers', views.StudentAnswerViewSet)
router.register(r'annotations', views.AnnotationViewSet)
router.register(r'comments', views.CommentViewSet)
router.register(r'notifications', views.NotificationViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/auth/login/', views.CustomAuthToken.as_view(), name='api_token_auth'),
    path('api/auth/register/', views.register_user, name='api_register'),
    path('api/auth/logout/', views.logout_user, name='api_logout'),
]
