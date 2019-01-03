from datetime import datetime
from rest_framework import serializers
import pytz
from main.models import (
    Assessor,
    Event,
    Image,
    Report,
    Resource,
)

'''
A serializer is defined here for each db model.

In main/models/__init__.py these serializers are assigned to the appropriate 
model as model.serializer, so if you import a model like:

    from main.models import Resource

then Resource().serializer = ResourceSerializer()

The serializers act as gatekeeper/conduits for the API by means of enforcing
the JSON spec. Generally, besides in very simple cases, the serializer will
have a custom definition for 1) how a model should be represented, 
to_representation(), and 2) how posted multipart or json data will be
processed to create a new model instance.
'''

class AssessorSerializer(serializers.ModelSerializer):
    
    ## this simple serializer needs no special field assignments, no custom
    ## create method, and no custom to_representation method
    
    class Meta:
        model = Assessor
        fields = (
            'email',
            'name',
            'deviceToken',
        )

class EventSerializer(serializers.ModelSerializer):

    ## define the id field here and any fields different from the model fields
    startDate = serializers.FloatField(max_value=None, min_value=None)
    endDate = serializers.FloatField(max_value=None, min_value=None)

    def create(self, validated_data):
        
        utc = pytz.utc
        
        ## convert the linux epoch timestamps into a date string that can be
        ## used to create the new object.
        startDate = datetime.fromtimestamp(validated_data.get('startDate',None))
        validated_data['startDate'] = utc.localize(startDate)
        endDate = datetime.fromtimestamp(validated_data.get('endDate',None))
        validated_data['endDate'] = utc.localize(endDate)
        
        return Event.objects.create(**validated_data)

    def to_representation(self,obj):

        return {
            'id':obj.pk,
            'name':obj.name,
            'primaryHazard':obj.primaryHazard,
            'secondaryHazard':obj.secondaryHazard,
            'startDate':obj.startDate.timestamp(),
            'endDate':obj.endDate.timestamp()
        }

    class Meta:
        model = Event
        fields = (
            'id',
            'name',
            'primaryHazard',
            'secondaryHazard',
            'startDate',
            'endDate',
        )

class ImageSerializer(serializers.ModelSerializer):

    id = serializers.UUIDField()
    image = serializers.ImageField()
    latitude = serializers.FloatField()
    longitude = serializers.FloatField()
    captureDate = serializers.FloatField()
    
    def create(self, validated_data):
        
        utc = pytz.utc
        captureDate = datetime.fromtimestamp(validated_data.get('captureDate',None))
        captureDate = utc.localize(captureDate)
        
        wkt = "POINT ({} {})".format(
            validated_data['longitude'],
            validated_data['latitude']
        )
        data = {
            'captureDate':captureDate,
            'geom':wkt,
            'image':validated_data['image'],
            'caption':validated_data['caption']
        }
        return Image.objects.create(**data)

    def to_representation(self,obj):

        if obj.geom:
            lat = obj.geom.coords[1]
            lon = obj.geom.coords[0]
        else:
            lat,lon = None,None
            
        if not obj.captureDate:
            captureDate = None
        else:
            captureDate = obj.captureDate.timestamp()

        return {
            'id':obj.pk,
            'url':obj.image.url,
            'thumbnailUrl':obj.thumbnail.url,
            'latitude':lat,
            'longitude':lon,
            'captureDate':captureDate,
            'caption':obj.caption
        }

    class Meta:
        model = Image
        fields = (
            'id',
            'image',
            'url',
            'latitude',
            'longitude',
            'captureDate',
            'caption'
        )
        
class ResourceSerializer(serializers.ModelSerializer):

    def create(self, validated_data):
        
        image_data = validated_data.pop('images')
        image_uuids = [str(i.pk) for i in image_data]

        resource = Resource.objects.create(**validated_data)

        resource.images.set(image_uuids)
        
        return resource
    
    def to_representation(self, obj):

        images = ImageSerializer(obj.images,many=True).data
        
        return {
            'id':obj.pk,
            'name':obj.name,
            'notes':obj.notes,
            'images':images,
            'condition':obj.condition,
            'type':obj.type,
            'hazards':obj.hazards,
            'safetyHazards':obj.safetyHazards,
            'interventionRequired':obj.interventionRequired,
        }
    
    class Meta:
        model = Resource
        fields = (
            'id',
            'name',
            'notes',
            'images',
            'condition',
            'type',
            'hazards',
            'safetyHazards',
            'interventionRequired',
        )

class ReportSerializer(serializers.ModelSerializer):

    ## define the id field here and any fields different from the model fields
    incident = EventSerializer(required=False)
    createdAt = serializers.FloatField(max_value=None, min_value=None)
    assessor = AssessorSerializer()
    resources = ResourceSerializer(many=True)

    def create(self, validated_data):

        utc = pytz.utc
        createdAt = datetime.fromtimestamp(validated_data.get('createdAt',None))
        validated_data['createdAt'] = utc.localize(createdAt)

        ## extract all of the necessary nested data from the submission
        event_data = validated_data.pop('incident',None)
        assessor_data = validated_data.pop('assessor')
        resource_data = validated_data.pop('resources')

        ## then create the report instance itself (sans any related objects)
        report = Report.objects.create(**validated_data)
        
        ## create and relate event
        if event_data:
            serialized_event = EventSerializer(data=event_data)
            serialized_event.is_valid(raise_exception=True)
            event = serialized_event.save()
            report.incident = event

        ## create and relate assessor
        serialized_assessor = AssessorSerializer(data=assessor_data)
        serialized_assessor.is_valid(raise_exception=True)
        assessor = serialized_assessor.save()
        report.assessor = assessor

        ## create and relate resources
        resources = []
        for resource in resource_data:
            resource['images'] = [i.pk for i in resource['images']]
            serialized_resource = ResourceSerializer(data=resource)
            serialized_resource.is_valid(raise_exception=True)
            r = serialized_resource.save()
            resources.append(r)
        report.resources.set(resources)

        report.save()

        return report

    def to_representation(self, obj):

        ## fully serialize these related objects for the best output
        event = None
        if obj.incident:
            event = EventSerializer(obj.incident).data
        coverImage = ImageSerializer(obj.coverImage).data
        assessor = AssessorSerializer(obj.assessor).data
        resources = ResourceSerializer(obj.resources,many=True).data

        return {
            'id':obj.pk,
            'title':obj.title,
            'incident':event,
            'createdAt':obj.createdAt.timestamp(),
            'type':obj.type,
            'coverImage':coverImage,
            'assessor':assessor,
            'resources':resources
        }

    class Meta:
        model = Report
        fields = (
            'id',
            'title',
            'incident',
            'createdAt',
            'type',
            'coverImage',
            'assessor',
            'resources',
        )
