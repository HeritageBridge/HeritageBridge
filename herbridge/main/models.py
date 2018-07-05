import os
import uuid
from django.contrib.gis.db import models

from imagekit.models import ImageSpecField
from imagekit.processors import ResizeToFill

import exifread

class Image(models.Model):
    image = models.ImageField(
        upload_to="images",
    )
    # thumbnail = models.ImageField(
        # upload_to='images/%Y/%m/%d/',
        # max_length=500,
    # )
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

    ## UNUSED July 5 2018 - new thumbnail strategy generates them on demand
    ## and the thumbnail files are not stored on disk.
    def create_thumbnail(self,imagefile):

        from PIL import Image as PILImage
        from io import BytesIO
        from django.core.files.uploadedfile import SimpleUploadedFile

        # original code for this method came from
        # http://snipt.net/danfreak/generate-thumbnails-in-django-with-pil/

        # If there is no image associated with this.
        # do not create thumbnail
        if not self.image:
            return

        # Set our max thumbnail size in a tuple (max width, max height)
        THUMBNAIL_SIZE = (99, 66)

        if self.image.name.lower().endswith(".jpg"):
            PIL_TYPE = 'jpeg'
            FILE_EXTENSION = 'jpg'
            DJANGO_TYPE = 'image/jpeg'

        elif self.image.name.lower().endswith(".png"):
            PIL_TYPE = 'png'
            FILE_EXTENSION = 'png'
            DJANGO_TYPE = 'image/png'

        # Open original photo which we want to thumbnail using PIL's Image
        image = PILImage.open(BytesIO(open(self.image.path,'rb').read()))
        
        # We use our PIL Image object to create the thumbnail, which already
        # has a thumbnail() convenience method that contrains proportions.
        # Additionally, use PIL.Image.ANTIALIAS to make the image look better.
        # Without antialiasing the image pattern artifacts may result.
        image.thumbnail(THUMBNAIL_SIZE, PILImage.ANTIALIAS)

        # Save the thumbnail
        temp_handle = BytesIO()
        image.save(temp_handle, PIL_TYPE)
        temp_handle.seek(0)

        # Save image to a SimpleUploadedFile which can be saved into
        # ImageField
        suf = SimpleUploadedFile(os.path.split(self.image.name)[-1],
                temp_handle.read(), content_type=DJANGO_TYPE)
        # Save SimpleUploadedFile into image field
        self.thumbnail.save(
            '%s_thumbnail.%s' % (os.path.splitext(suf.name)[0], FILE_EXTENSION),
            suf,
            save=False
        )

    def get_geotags(self):

        tags = exifread.process_file(self.image)
        geotags = {}
        for k,v in tags.items():
            if k.startswith("GPS"):
                geotags[k] = v
        return geotags
        
    def make_geom_from_geotags(self,geotags):
        
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

    def __unicode__(self):
        return '{"thumbnail": "%s", "image": "%s"}' % (self.thumbnail.url, self.image.url)

    def save(self, *args, **kwargs):

        ## UNUSED July 5, 2018 -- manually handle the creation of thumbnails
        ## which uses create_thumbnail() above and stores the files to disk
        # if not self.thumbnail:
            # print("no thumb yet")
            # print(self.image.path)
            # print("%Y")
            # self.create_thumbnail(self.image)
        # else:
            # fname = os.path.splitext(self.image.path.split("/")[-1])[0]
            # tname = os.path.splitext(self.thumbnail.path.split("/")[-1])[0]
            # print(fname,tname)
            # if tname != fname+"_thumbnail":
                # self.create_thumbnail(self.image)
                
        force_update = False
        if self.id:
            force_update = True
        
        # get and create geometry from geo tags
        gts = self.get_geotags()
        if not gts:
            return

        necessary_tags = [
            'GPS GPSLongitude',
            'GPS GPSLongitudeRef',
            'GPS GPSLatitude',
            'GPS GPSLatitudeRef',
        ]
        
        for nt in necessary_tags:
            if not nt in gts.keys():
                return

        self.geom = self.make_geom_from_geotags(gts)
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
