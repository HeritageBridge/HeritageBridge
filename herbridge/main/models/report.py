import uuid
from django.contrib.gis.db import models
from main.utils.serializers import HBSerializer

class Report(models.Model):

    def __str__(self):
        return str(self.createdAt)
    
    TYPE_CHOICES = (
        ("field_report","Field Report"),
        ("risk_report","Risk Report"),
        ("rapid_impact","Rapid Impact"),
        ("training_report","Training Report"),
        ("test_report","Test Report")
    )
    
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        unique=True,
    )
    title = models.CharField(
        max_length=100,
    )
    createdAt = models.DateTimeField(auto_now_add=True)
    type = models.CharField(
        max_length=25,
        choices=TYPE_CHOICES,
    )
    incident = models.ForeignKey(
        "Event",
        on_delete=models.CASCADE,
        blank=True,
        null=True,
    )
    coverImage = models.OneToOneField(
        "Image",
        on_delete=models.CASCADE,
        blank=True,
        null=True,
    )
    assessor = models.OneToOneField(
        "Assessor",
        on_delete=models.CASCADE,
        blank=True,
        null=True,
    )
    resources = models.ManyToManyField(
        "Resource",
    )
    
    def get_resources(self):
        '''gets the resources that are related to this report and sorts them
        into categories as defined in the JSON spec. it may be good to build
        these categories directly from the Resource().type choices, but they
        are hard-coded for now.'''
        
        places = HBSerializer().serialize(self.resources.filter(type="place"))
        features = HBSerializer().serialize(self.resources.filter(type="feature"))
        components = HBSerializer().serialize(self.resources.filter(type="component"))
        
        data = {
            'areas':places,
            'sites':features,
            'objects':components,
        }

        return data
    
    def as_json(self):

        data = {
            "id":self.pk,
            "title":self.title,
            "incident":self.incident.as_json(),
            "createdAt":int(self.createdAt.timestamp()),
            "type":self.type,
            "coverImage":self.coverImage.as_json(),
            "assessor":self.assessor.as_json(),
            "resources":self.get_resources(),
        }

        return data
