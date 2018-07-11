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
    startDate = models.DateField()
    endDate = models.DateField()