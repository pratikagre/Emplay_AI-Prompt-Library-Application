from django.urls import path
from . import views

urlpatterns = [
    path('', views.prompt_list_create, name='prompt-list-create'),
    path('<uuid:pk>/', views.prompt_detail, name='prompt-detail'),
]
