import uuid
from django.contrib.gis.db import models

class Resource(models.Model):

    def __str__(self):
        if self.name:
            return self.name
        else:
            return str(self.id)

    CONDITION_TYPES = (
        ("unknown","Unknown"),
        ("none","None"),
        ("minor","Minor"),
        ("moderate","Moderate"),
        ("severe","Severe"),
        ("collapsed","Collapsed"),
    )
    
    RESOURCE_TYPES = (
        ("area","Area"),
        ("building","Building"),
        ("object","Object"),
    )
    
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        unique=True,
    )
    name = models.CharField(
        max_length=100,
        null=True,
        blank=True,
    )
    images = models.ManyToManyField(
        "Image",
    )
    condition = models.CharField(
        max_length=25,
        choices=CONDITION_TYPES,
    )
    type = models.CharField(
        max_length=10,
        choices=RESOURCE_TYPES,
    )
    notes = models.CharField(
        max_length=250,
        null=True,
        blank=True,
    )
    hazards = models.NullBooleanField()
    safetyHazards = models.NullBooleanField()
    interventionRequired = models.NullBooleanField()
    
    serializer = None
    
    ## DEPRECATED JULY 17 - WAS PART OF EARLY API
    def as_json(self):
        from main.utils.serializers import HBSerializer
        
        data = {
            "id":self.pk,
            "name":self.name,
            "notes":self.notes,
            "images":HBSerializer().serialize(self.images.all()),
            "condition":self.condition,
            "hazards":self.hazards,
            "safetyHazards":self.safetyHazards,
            "interventionRequired":self.interventionRequired,
        }

        return data
