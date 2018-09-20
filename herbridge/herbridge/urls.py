"""herbridge URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.decorators.csrf import csrf_exempt
from main import views

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('', views.home, name='home'),
    path('api/', views.api_ref, name='api_ref'),
    path('api/<str:model>/', views.ListView.as_view(), name='object-list'),
    path('api/<str:model>/<int:pk>/', views.InstanceView.as_view(), name='object-instance'),
    path('api/<str:model>/<uuid:pk>/', views.InstanceView.as_view(), name='object-instance'),
    path('api/login', csrf_exempt(views.LoginAuthToken.as_view())),
    ## FOLLOWING 3 URLS ARE DEPRECATED JULY 17 - WERE PART OF EARLY API
    path('api-DEP/<str:model_name>/', views.api_dispatch, name='api_dispatch'),
    path('api-DEP/<str:model_name>/<int:id>/', views.api_dispatch, name='api_dispatch'),
    path('api-DEP/<str:model_name>/<uuid:id>/', views.api_dispatch, name='api_dispatch'),
    ## FOLLOWING URLS ARE FOR THE FRONTEND
    path('', include('frontend.urls')),
    
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
