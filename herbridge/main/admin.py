from django.contrib import admin
from main.models import Resource, Image, Assessor, Report, Event

class ImageInline(admin.TabularInline):
    model = Image
    extra = 1
    exclude = ('thumbnail',)

class ResourceAdmin(admin.ModelAdmin):
    search_fields = ['name','type','condition']
    inlines = [ImageInline,]
    ordering = ('name',)
    
class ImageAdmin(admin.ModelAdmin):
    exclude = ['thumbnail',]

admin.site.register(Assessor)
admin.site.register(Event)
admin.site.register(Image,ImageAdmin)
admin.site.register(Report)
admin.site.register(Resource)

