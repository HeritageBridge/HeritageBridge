from django.core.serializers.python import Serializer

class HBSerializer(Serializer):
    '''custom serializer just calls the as_json() method which has been added
    to each model.'''
    
    def end_object( self, obj ):
        self.objects.append(obj.as_json())