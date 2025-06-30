from rest_framework import serializers
from .models import Group, ReadingMaterial, Question, StudentAnswer, Annotation, Comment, Notification
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class GroupSerializer(serializers.ModelSerializer):
    teacher = UserSerializer(read_only=True)
    students = UserSerializer(many=True, read_only=True)
    
    class Meta:
        model = Group
        fields = ['id', 'name', 'teacher', 'students', 'created_at']

class ReadingMaterialSerializer(serializers.ModelSerializer):
    group = GroupSerializer(read_only=True)
    created_by = UserSerializer(read_only=True)
    
    class Meta:
        model = ReadingMaterial
        fields = ['id', 'title', 'content', 'group', 'created_by', 'created_at']

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'material', 'question_text', 'question_type', 'choices', 'correct_answer', 'hide_text', 'order']

class StudentAnswerSerializer(serializers.ModelSerializer):
    student = UserSerializer(read_only=True)
    question = QuestionSerializer(read_only=True)
    
    class Meta:
        model = StudentAnswer
        fields = ['id', 'student', 'question', 'answer_text', 'reasoning_note', 'citations', 'submitted_at', 'updated_at']

class AnnotationSerializer(serializers.ModelSerializer):
    student = UserSerializer(read_only=True)
    
    class Meta:
        model = Annotation
        fields = ['id', 'student', 'material', 'annotation_type', 'start_position', 'end_position', 'content', 'color', 'created_at']

class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'author', 'target_answer', 'content', 'created_at', 'updated_at']

class NotificationSerializer(serializers.ModelSerializer):
    recipient = UserSerializer(read_only=True)
    sender = UserSerializer(read_only=True)
    
    class Meta:
        model = Notification
        fields = ['id', 'recipient', 'sender', 'notification_type', 'title', 'message', 'is_read', 'created_at']
