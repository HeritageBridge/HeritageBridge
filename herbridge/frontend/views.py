from django.shortcuts import render
from django.conf import settings


def index(request):
    if settings.DEBUG:
        return render(request, 'frontend/index_dev.html')
    else:
        return render(request, 'frontend/index.html')
