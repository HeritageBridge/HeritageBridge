from django.core.exceptions import ValidationError
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics
from main.models import get_model

def home(request):
    return render(request, 'index.html')

def api_ref(request):

    lookup = {
        'assessor':Assessor,
        'event':Event,
        'image':Image,
        'report':Report,
        'resource':Resource,
    }
    
    ref_links = []
    for k,v in lookup.items():
        ref_links.append((f"/api/{k}/","list all"))
        ob = v.objects.all()[0]
        ref_links.append((f"/api/{k}/{ob.pk}/","get by id"))

    return render(request, 'api_ref.html', {'ref_links':ref_links})
    
class ListView(generics.ListCreateAPIView):
    """
    Returns a list of all instances as specified by the model name in the url.
    """
    
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

## DEPRECATED JULY 17 - WAS PART OF EARLY API
from main.utils.serializers import HBSerializer
from main.models import Assessor, Event, Image, Report, Resource
def api_dispatch(request,model_name=None,id=None):

    lookup = {
        'assessor':Assessor,
        'event':Event,
        'image':Image,
        'report':Report,
        'resource':Resource,
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
