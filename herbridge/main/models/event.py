import datetime
from django.contrib.gis.db import models

class Event(models.Model):

    def __str__(self):
        return f"{self.name} - {self.startDate} to {self.endDate}"

    name = models.CharField(
        max_length=100,
    )
    primaryHazard = models.CharField(
        max_length=250,
    )
    secondaryHazard = models.CharField(
        max_length=250,
        blank=True,
        null=True,
    )
    startDate = models.DateTimeField()
    endDate = models.DateTimeField()

    serializer = None
    
    ## DEPRECATED JULY 17 - WAS PART OF EARLY API
    import datetime
    
    def as_json(self):
        
        startDateTime = datetime.datetime.combine(self.startDate,datetime.time())
        startEpoch = int(startDateTime.timestamp())
        
        endDateTime = datetime.datetime.combine(self.endDate,datetime.time())
        endEpoch = int(startDateTime.timestamp())
        
        data = {
            "id":self.pk,
            "name":self.name,
            "primaryHazard":self.primaryHazard,
            "secondaryHazard":self.secondaryHazard,
            "startDate":startEpoch,
            "endDate":endDateTime,
        }

        return data
    