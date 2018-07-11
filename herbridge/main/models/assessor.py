from django.contrib.gis.db import models

class Assessor(models.Model):

    def __str__(self):
        if self.name:
            return self.name
        else:
            return self.email
    
    email = models.EmailField()
    name = models.CharField(
        max_length=100,
        blank=True,
    )
    deviceToken = models.UUIDField(blank=True)