from django.db import models
from django.conf import settings  # ← 追加
from django.contrib.auth.models import AbstractUser
import json

class CustomUser(AbstractUser):
    USER_TYPE_CHOICES = [
        ('student', '学生'),
        ('teacher', '教員'),
    ]
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='student')
    student_id = models.CharField(max_length=20, blank=True, null=True)
    grade = models.CharField(max_length=10, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.username} ({self.get_user_type_display()})"

class Group(models.Model):
    name = models.CharField(max_length=100, verbose_name='グループ名')
    teacher = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='teaching_groups', verbose_name='担当教員')
    students = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='student_groups', blank=True, verbose_name='学生')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='作成日時')
    
    class Meta:
        verbose_name = 'グループ'
        verbose_name_plural = 'グループ'
    
    def __str__(self):
        return self.name

class ReadingMaterial(models.Model):
    title = models.CharField(max_length=200, verbose_name='タイトル')
    content = models.TextField(verbose_name='本文')
    group = models.ForeignKey(Group, on_delete=models.CASCADE, verbose_name='対象グループ')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name='作成者')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='作成日時')
    
    class Meta:
        verbose_name = '読解教材'
        verbose_name_plural = '読解教材'
    
    def __str__(self):
        return self.title

class Question(models.Model):
    QUESTION_TYPES = [
        ('multiple_choice', '選択式'),
        ('descriptive', '記述式'),
    ]
    
    material = models.ForeignKey(ReadingMaterial, on_delete=models.CASCADE, related_name='questions', verbose_name='教材')
    question_text = models.TextField(verbose_name='問題文')
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPES, verbose_name='問題形式')
    choices = models.JSONField(blank=True, null=True, verbose_name='選択肢')
    correct_answer = models.TextField(blank=True, verbose_name='正解例')
    hide_text = models.BooleanField(default=False, verbose_name='文章を非表示にする')
    order = models.IntegerField(default=0, verbose_name='問題順序')
    
    class Meta:
        verbose_name = '問題'
        verbose_name_plural = '問題'
        ordering = ['order']
    
    def __str__(self):
        return f"{self.material.title} - 問題{self.order}"

class StudentAnswer(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name='学生')
    question = models.ForeignKey(Question, on_delete=models.CASCADE, verbose_name='問題')
    answer_text = models.TextField(verbose_name='回答内容')
    reasoning_note = models.TextField(blank=True, verbose_name='思考過程のノート')
    citations = models.JSONField(blank=True, null=True, verbose_name='引用箇所')
    submitted_at = models.DateTimeField(auto_now_add=True, verbose_name='提出日時')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新日時')
    
    class Meta:
        verbose_name = '学生回答'
        verbose_name_plural = '学生回答'
        unique_together = ['student', 'question']
    
    def __str__(self):
        return f"{self.student.username} - {self.question}"

class Annotation(models.Model):
    ANNOTATION_TYPES = [
        ('sticky_note', '付箋'),
        ('highlight', 'マーカー'),
    ]
    
    COLORS = [
        ('#ffff00', '黄色'),
        ('#ff9999', '赤色'),
        ('#99ff99', '緑色'),
        ('#9999ff', '青色'),
        ('#ffcc99', 'オレンジ'),
    ]
    
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name='学生')
    material = models.ForeignKey(ReadingMaterial, on_delete=models.CASCADE, verbose_name='教材')
    annotation_type = models.CharField(max_length=20, choices=ANNOTATION_TYPES, verbose_name='注釈タイプ')
    start_position = models.IntegerField(verbose_name='開始位置')
    end_position = models.IntegerField(verbose_name='終了位置')
    content = models.TextField(blank=True, verbose_name='注釈内容')
    color = models.CharField(max_length=7, choices=COLORS, default='#ffff00', verbose_name='色')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='作成日時')
    
    class Meta:
        verbose_name = '注釈'
        verbose_name_plural = '注釈'
    
    def __str__(self):
        return f"{self.student.username} - {self.get_annotation_type_display()}"

class Comment(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name='投稿者')
    target_answer = models.ForeignKey(StudentAnswer, on_delete=models.CASCADE, related_name='comments', verbose_name='対象回答')
    content = models.TextField(verbose_name='コメント内容')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='投稿日時')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新日時')
    
    class Meta:
        verbose_name = 'コメント'
        verbose_name_plural = 'コメント'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.author.username} → {self.target_answer.student.username}"

class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('comment', 'コメント'),
        ('question', '質問'),
        ('mention', 'メンション'),
    ]
    
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications', verbose_name='受信者')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_notifications', verbose_name='送信者')
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES, verbose_name='通知タイプ')
    title = models.CharField(max_length=200, verbose_name='タイトル')
    message = models.TextField(verbose_name='メッセージ')
    related_comment = models.ForeignKey(Comment, on_delete=models.CASCADE, null=True, blank=True, verbose_name='関連コメント')
    is_read = models.BooleanField(default=False, verbose_name='既読')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='作成日時')
    
    class Meta:
        verbose_name = '通知'
        verbose_name_plural = '通知'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.recipient.username} - {self.title}"
