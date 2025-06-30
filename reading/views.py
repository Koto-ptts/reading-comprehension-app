from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from .models import Group, ReadingMaterial, Question, StudentAnswer, Annotation, Comment, Notification
from .serializers import (
    GroupSerializer, ReadingMaterialSerializer, QuestionSerializer,
    StudentAnswerSerializer, AnnotationSerializer, CommentSerializer,
    NotificationSerializer, UserSerializer
)

class ReadingMaterialViewSet(viewsets.ModelViewSet):
    queryset = ReadingMaterial.objects.all()
    serializer_class = ReadingMaterialSerializer
    permission_classes = [AllowAny]  # 開発用：本番では認証が必要
    
    @action(detail=True, methods=['get'])
    def questions(self, request, pk=None):
        """特定の教材の問題一覧を取得"""
        material = self.get_object()
        questions = Question.objects.filter(material=material).order_by('order')
        serializer = QuestionSerializer(questions, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def annotations(self, request, pk=None):
        """特定の教材の注釈一覧を取得"""
        material = self.get_object()
        student_id = request.query_params.get('student_id')
        if student_id:
            annotations = Annotation.objects.filter(material=material, student_id=student_id)
        else:
            annotations = Annotation.objects.filter(material=material)
        serializer = AnnotationSerializer(annotations, many=True)
        return Response(serializer.data)

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [AllowAny]

class StudentAnswerViewSet(viewsets.ModelViewSet):
    queryset = StudentAnswer.objects.all()
    serializer_class = StudentAnswerSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        """回答の作成または更新"""
        student_id = request.data.get('student')
        question_id = request.data.get('question')
        
        # 既存の回答があるかチェック
        try:
            existing_answer = StudentAnswer.objects.get(
                student_id=student_id, 
                question_id=question_id
            )
            # 既存の回答を更新
            serializer = self.get_serializer(existing_answer, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        except StudentAnswer.DoesNotExist:
            # 新しい回答を作成
            return super().create(request, *args, **kwargs)

class AnnotationViewSet(viewsets.ModelViewSet):
    queryset = Annotation.objects.all()
    serializer_class = AnnotationSerializer
    permission_classes = [AllowAny]

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [AllowAny]

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['get'])
    def unread(self, request):
        """未読通知の取得"""
        user_id = request.query_params.get('user_id')
        if user_id:
            notifications = Notification.objects.filter(
                recipient_id=user_id, 
                is_read=False
            )
            serializer = self.get_serializer(notifications, many=True)
            return Response(serializer.data)
        return Response([])

from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from .models import CustomUser

class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'username': user.username,
            'user_type': user.user_type,
            'student_id': user.student_id,
            'grade': user.grade
        })

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """新規ユーザー登録"""
    username = request.data.get('username')
    password = request.data.get('password')
    user_type = request.data.get('user_type', 'student')
    student_id = request.data.get('student_id', '')
    grade = request.data.get('grade', '')
    
    if CustomUser.objects.filter(username=username).exists():
        return Response({'error': 'ユーザー名が既に存在します'}, status=400)
    
    user = CustomUser.objects.create_user(
        username=username,
        password=password,
        user_type=user_type,
        student_id=student_id,
        grade=grade
    )
    
    token, created = Token.objects.get_or_create(user=user)
    
    return Response({
        'token': token.key,
        'user_id': user.pk,
        'username': user.username,
        'user_type': user.user_type,
        'message': 'ユーザー登録が完了しました'
    })

@api_view(['POST'])
def logout_user(request):
    """ログアウト"""
    try:
        request.user.auth_token.delete()
        return Response({'message': 'ログアウトしました'})
    except:
        return Response({'error': 'ログアウトに失敗しました'}, status=400)
