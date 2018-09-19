from django.core.exceptions import ValidationError
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics
from rest_framework.parsers import MultiPartParser, JSONParser
from main.models import get_model
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import json

def home(request):
    return render(request, 'index.html')


def api_ref(request):

    model_list = [
        'assessors',
        'events',
        'images',
        'reports',
        'resources',
    ]
    
    ref_links = []
    for name in model_list:
        model = get_model(name)
        ref_links.append((f"/api/{name}/","list all"))
        ob = model.objects.all()[0]
        ref_links.append((f"/api/{name}/{ob.pk}/","get by id"))

    return render(request, 'api_ref.html', {'ref_links':ref_links})


class ListView(generics.ListCreateAPIView):
    """
    Returns a list of all instances as specified by the model name in the url.
    """
    parser_classes = (MultiPartParser,JSONParser)
    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        return super(ListView, self).dispatch(request, *args, **kwargs)

    def get_queryset(self):
        model = get_model(self.kwargs.get('model'))
        return model.objects.all()

    def get_serializer_class(self):
        model = get_model(self.kwargs.get('model'))
        return model.serializer


class InstanceView(generics.RetrieveAPIView):
    """
    Returns a single instance as specified by the model name and pk in the url.
    """
    
    def get_queryset(self):
        model = get_model(self.kwargs.get('model'))
        return model.objects.filter(pk=self.kwargs.get('pk'))
        
    def get_serializer_class(self):
        model = get_model(self.kwargs.get('model'))
        return model.serializer


class LoginAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        body_unicode = request.body
        if not body_unicode:
            return Response({
                'detail' : 'No password specified'
            }, status=422)

        # Extract out the password
        body = json.loads(request.body)
        if 'password' not in body:
            return Response({
                'detail': 'No password specified'
            }, status=422)

        # Check the password matches
        if body['password'] == settings.FRONTEND_AUTH_PASSWORD:
            return Response({
                'token': settings.FRONTEND_AUTH_TOKEN
            })
        else:
            return Response({
                'detail': 'Password is incorrect'
            }, status=401)


# DEPRECATED JULY 17 - WAS PART OF EARLY API
from main.utils.serializers import HBSerializer
from main.models import Assessor, Event, Image, Report, Resource
def api_dispatch(request,model_name=None,id=None):

    lookup = {
        'assessors':Assessor,
        'events':Event,
        'images':Image,
        'reports':Report,
        'resources':Resource,
    }

    if not model_name or not model_name in lookup:
        raise Http404()

    model = lookup[model_name]
    if id:
        try:
            i = get_object_or_404(model, pk=id)
        except ValidationError:
            raise Http404()
        data = i.as_json()
    else:
        i = model.objects.all()
        data = HBSerializer().serialize(i)
        
    return JsonResponse(data, safe=False)

