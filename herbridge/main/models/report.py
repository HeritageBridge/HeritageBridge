import uuid
from django.contrib.gis.db import models

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
    resources = models.ForeignKey(
        "Resource",
        on_delete=models.CASCADE,
        blank=True,
        null=True,
    )
