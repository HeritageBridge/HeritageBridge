from .assessor import Assessor
from .event import Event
from .image import Image
from .report import Report
from .resource import Resource
from main.serializers import (
    AssessorSerializer,
    EventSerializer,
    ImageSerializer,
    ReportSerializer,
    ResourceSerializer,
)

'''This file facilitates the standard import pattern:

    from main.models import Resource
    
while also allowing for the association of serializers with models.'''

## set the serializer classes here
Assessor.serializer = AssessorSerializer
Event.serializer = EventSerializer
Image.serializer = ImageSerializer
Report.serializer = ReportSerializer
Resource.serializer = ResourceSerializer

def get_model(model_name):
    '''helper function that can be used anywhere to get a model class based on
    the string name of the model used like this:
    
        from main.models import get_model
        res_model = get_model('resource')
    
    mainly used to link url strings with models.
    '''
    
    lookup = {
        'assessors':Assessor,
        'events':Event,
        'images':Image,
        'reports':Report,
        'resources':Resource,
    }
    
    return lookup.get(model_name,None)
