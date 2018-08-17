import os
import json
import uuid
from django.test import TestCase

from main.models import Assessor, Image, Resource, Event, Report

class AssessorTestCase(TestCase):
    url = "/api/assessors/"
    
    fixtures = ['images']

    def test_create_assessor_from_json_post(self):

        python_dict = {
            "name": "bob the dob",
            "deviceToken": "bf6fb410-2c28-4930-9318-6531ee3ffae2",
            "email": "fake@email.com"
        }
        response = self.client.post(self.url,
                                    json.dumps(python_dict),
                                    content_type='application/json'
                                    )
        self.assertEquals(response.status_code,201)
    
class ResourceTestCase(TestCase):
    url = "/api/resources/"
    fixtures = ['images']
    
    def test_create_resource_from_json_post(self):
        
        image_uuids = [str(i.pk) for i in Image.objects.all()]
        res_data = {
            "name": "South Staircase",
            "notes": "modeled after stairs in Hong Kong",
            "images": image_uuids,
            "condition": "moderate",
            "type": "object",
            "hazards": False,
            "safetyHazards": False,
            "interventionRequired": False
        }
        
        response = self.client.post(self.url,
                                    json.dumps(res_data),
                                    content_type='application/json'
                                    )
                                    
        self.assertEquals(response.status_code,201)
        response_content = str(response.content, encoding='utf8')

class ReportTestCase(TestCase):
    url = "/api/reports/"
    fixtures = ['images']
    
    def test_create_full_report_from_json_post(self):

        image_uuids = [str(i.pk) for i in Image.objects.all()]
        report_post_data = {
            "title": "Report 2",
            "incident": {
                "id": 1,
                "name": "Acid Rain",
                "primaryHazard": "burning rain from the sky",
                "secondaryHazard": "drainage",
                "startDate": 1525168800.0,
                "endDate": 1525518000.0
            },
            "createdAt": 1530810991.0,
            "type": "field_report",
            "coverImage": image_uuids[0],
            "assessor": {
                "email": "athos@dumas.org",
                "name": "Athos",
                "deviceToken": "dddd0000-0000-0000-0000-000000000001"
            },
            "resources": [
                {
                    "name": "Castle Dumas",
                    "notes": "nice old castle",
                    "images": image_uuids[1:3],
                    "condition": "unknown",
                    "type": "area",
                    "hazards": True,
                    "safetyHazards": False,
                    "interventionRequired": True
                },
                {
                    "name": "Castle Dumas",
                    "notes": "nice old castle",
                    "images": image_uuids[4:5],
                    "condition": "unknown",
                    "type": "area",
                    "hazards": True,
                    "safetyHazards": False,
                    "interventionRequired": True
                }
            ]
        }
        
        response = self.client.post(self.url,
            json.dumps(report_post_data),
            content_type='application/json'
        )
        
        response_content = str(response.content, encoding='utf8')
        self.assertEquals(response.status_code,201)
        
        number_of_Resources = len(Resource.objects.all())
        self.assertEquals(number_of_Resources,2)
        
        number_of_Events = len(Event.objects.all())
        self.assertEquals(number_of_Events,1)
        
        number_of_Reports = len(Report.objects.all())
        self.assertEquals(number_of_Reports,1)
        
        number_of_Assessors = len(Assessor.objects.all())
        self.assertEquals(number_of_Assessors,1)
        
    def test_create_untitled_no_incident_report_from_json_post(self):

        image_uuids = [str(i.pk) for i in Image.objects.all()]
        report_post_data = {
            "id": "a0000000-0000-0000-0000-000000000011",
            "title": "",
            "createdAt": 1530810991.0,
            "type": "field_report",
            "coverImage": "e0000000-0000-0000-0000-000000000004",
            "assessor": {
                "email": "athos@dumas.org",
                "name": "Athos",
                "deviceToken": "dddd0000-0000-0000-0000-000000000001"
            },
            "resources": [
                {
                    "id": "b0000000-0000-0000-0000-000000000010",
                    "name": "Castle Dumas 2",
                    "notes": "nice old castle",
                    "images": [ "e0000000-0000-0000-0000-000000000001"],
                    "condition": "unknown",
                    "type": "area",
                    "hazards": True,
                    "safetyHazards": False,
                    "interventionRequired": True
                }
            ]
        }
        
        response = self.client.post(self.url,
            json.dumps(report_post_data),
            content_type='application/json'
        )
        
        response_content = str(response.content, encoding='utf8')
        self.assertEquals(response.status_code,201)
        
        print(json.dumps(json.loads(response_content),indent=1))

        number_of_Reports = len(Report.objects.all())
        self.assertEquals(number_of_Reports,1)

