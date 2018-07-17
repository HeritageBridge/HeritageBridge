from django.contrib.gis.db import models

class Assessor(models.Model):

    email = models.EmailField()
    name = models.CharField(
        max_length=100,
        blank=True,
    )
    deviceToken = models.UUIDField(blank=True)
    
    serializer = None

    def __str__(self):
        if self.name:
            return self.name
        else:
            return self.email
    
    ## DEPRECATED JULY 17 - WAS PART OF EARLY API
    def as_json(self):

        data = {
            "email":self.email,
            "name":self.name,
            "deviceToken":self.deviceToken,
        }

        return data
