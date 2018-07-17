import os
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
        processors=[ResizeToFill(100, 100)],
        format='JPEG',
        options={'quality': 60}
    )
    
    serializer = None
    
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
    
    ## DEPRECATED JULY 17 - WAS PART OF EARLY API
    def as_json(self):
    
        if self.geom:
            lat,long = self.geom.coords[1],self.geom.coords[0]
        else:
            lat,long = None,None
    
        data = {
            "url":self.image.url,
            "thumbnailURL":self.thumbnail.url,
            "latitude":lat,
            "longitude":long,
            "captureDate":int(self.captureDate.timestamp()),
        }

        return data
