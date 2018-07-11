import os
import uuid
from django.contrib.gis.db import models
from PIL import Image as PILImage
from io import BytesIO
from imagekit.models import ImageSpecField
from imagekit.processors import ResizeToFill
from datetime import datetime
import exifread

class Image(models.Model):
    image = models.ImageField(
        upload_to="images",
    )
    
    orientation = models.CharField(
        max_length=10,
        choices=(('portrait','portrait'),('landscape','landscape')),
        editable=False,
    )
    captureDate = models.DateTimeField(
        null=True,
        editable=False,
    )
    geom = models.PointField(null=True, blank=True)
    
    ## this is not actually a db field, but a property definition
    thumbnail = ImageSpecField(
        source='image',
        processors=[ResizeToFill(100, 50)],
        format='JPEG',
        options={'quality': 60}
    )
    
    def __str__(self):
        return self.image.url
        
    def get_tags(self):
        return exifread.process_file(self.image)

    def get_orientation(self,tags):
        '''pretty naive way of calculating the orientation'''

        orientation = None
        orient_tag = tags.get('Image Orientation',None)

        if orient_tag:
            if "horizontal" in str(orient_tag).lower():
                orientation = "landscape"
            else:
                orientation = "portrait"

        else:
            image = PILImage.open(BytesIO(open(self.image.path,'rb').read()))
            landscape = image.size[1] < image.size[0]
            if landscape:
                orientation = "landscape"
            else:
                orientation = "portrait"
        print(f"orientation: {orientation}")
        return orientation

    def get_geotags(self,tags):
        '''get all spatial exif tags from image'''

        geotags = {}
        for k,v in tags.items():
            if k.startswith("GPS"):
                geotags[k] = v
        return geotags
        
    def get_date(self,tags):
        '''get the date from the exif tags and return a datetime object'''

        ## 7-11-18: No timezone support is attempted here, though django would
        ## accept it.
        date_tag = tags.get('Image DateTime',None)
        if not date_tag:
            return None
            
        date = datetime.strptime(str(date_tag), '%Y:%m:%d %H:%M:%S')
        print(f"date: {date}")
        return date
        
        
    def make_geom_from_geotags(self,geotags):
        '''process the spatial exif tags and return wkt'''
        
        raw_lat = geotags['GPS GPSLatitude']
        raw_long = geotags['GPS GPSLongitude']
        ew = str(geotags['GPS GPSLongitudeRef'])
        ns = str(geotags['GPS GPSLatitudeRef'])
        
        # create latitute from tags
        lat_str = str(raw_lat).lstrip('[').rstrip(']')
        lat_list = lat_str.split(",")
        la_deg = int(lat_list[0])
        la_dec_deg_num = float(lat_list[1].split("/")[0].lstrip())
        la_dec_deg_denom = float(lat_list[1].split("/")[1].lstrip())
        la_dec_deg = (la_dec_deg_num/la_dec_deg_denom)/60
        lat = str(la_deg+la_dec_deg)
        
        # create longitude from tags
        lon_str = str(raw_long).lstrip('[').rstrip(']')
        lon_list = lon_str.split(",")
        lo_deg = int(lon_list[0])
        lo_dec_deg_num = float(lon_list[1].split("/")[0].lstrip())
        lo_dec_deg_denom = float(lon_list[1].split("/")[1].lstrip())
        lo_dec_deg = (lo_dec_deg_num/lo_dec_deg_denom)/60
        long = str(lo_deg+lo_dec_deg)
        
        wkt = "POINT ({} {})".format(long,lat)
        return wkt
        
    def get_geometry(self,tags):
        '''look for geom tags, process, and return wkt'''
        
        gts = self.get_geotags(tags)
        
        if not gts:
            return None

        necessary_tags = [
            'GPS GPSLongitude',
            'GPS GPSLongitudeRef',
            'GPS GPSLatitude',
            'GPS GPSLatitudeRef',
        ]
        
        for nt in necessary_tags:
            if not nt in gts.keys():
                return None
        
        wkt = self.make_geom_from_geotags(gts)
        print(f"wkt: {wkt}")
        return wkt

    def __unicode__(self):
        return '{"thumbnail": "%s", "image": "%s"}' % (self.thumbnail.url, self.image.url)

    def save(self, *args, **kwargs):
        '''override the default save method'''

        tags = self.get_tags()
        self.captureDate = self.get_date(tags)
        self.orientation = self.get_orientation(tags)
        self.geom = self.get_geometry(tags)

        force_update = False
        if self.id:
            force_update = True
        super(Image, self).save(force_update=force_update)
        
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
        ("place","Place"),
        ("feature","Feature"),
        ("component","Component"),
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
    images = models.ForeignKey(
        Image,
        on_delete=models.CASCADE,
    )
    condition = models.CharField(
        max_length=25,
        choices=CONDITION_TYPES,
    )
    type = models.CharField(
        max_length=10,
        choices=RESOURCE_TYPES,
    )
    condition = models.CharField(
        max_length=25,
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
        Event,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
    )
    coverImage = models.OneToOneField(
        Image,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
    )
    assessor = models.OneToOneField(
        Assessor,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
    )
    resources = models.ForeignKey(
        Resource,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
    )
