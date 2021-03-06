# Generated by Django 2.0.7 on 2018-09-04 18:31

import django.contrib.gis.db.models.fields
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Assessor',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(max_length=254)),
                ('name', models.CharField(blank=True, max_length=100)),
                ('deviceToken', models.UUIDField(blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('primaryHazard', models.CharField(max_length=250)),
                ('secondaryHazard', models.CharField(blank=True, max_length=250, null=True)),
                ('startDate', models.DateTimeField()),
                ('endDate', models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('image', models.ImageField(upload_to='images')),
                ('orientation', models.CharField(choices=[('portrait', 'portrait'), ('landscape', 'landscape')], editable=False, max_length=10)),
                ('captureDate', models.DateTimeField(editable=False, null=True)),
                ('caption', models.CharField(blank=True, max_length=250, null=True)),
                ('geom', django.contrib.gis.db.models.fields.PointField(blank=True, null=True, srid=4326)),
            ],
        ),
        migrations.CreateModel(
            name='Report',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('title', models.CharField(blank=True, max_length=100, null=True)),
                ('createdAt', models.DateTimeField()),
                ('type', models.CharField(choices=[('field_report', 'Field Report'), ('risk_report', 'Risk Report'), ('rapid_impact', 'Rapid Impact'), ('training_report', 'Training Report'), ('test_report', 'Test Report')], max_length=25)),
                ('assessor', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='main.Assessor')),
                ('coverImage', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='main.Image')),
                ('incident', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='main.Event')),
            ],
        ),
        migrations.CreateModel(
            name='Resource',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('name', models.CharField(blank=True, max_length=100, null=True)),
                ('condition', models.CharField(choices=[('unknown', 'Unknown'), ('none', 'None'), ('minor', 'Minor'), ('moderate', 'Moderate'), ('severe', 'Severe'), ('collapsed', 'Collapsed')], max_length=25)),
                ('type', models.CharField(choices=[('area', 'Area'), ('building', 'Building'), ('object', 'Object'), ('unknown', 'Unknown')], max_length=10)),
                ('notes', models.CharField(blank=True, max_length=250, null=True)),
                ('hazards', models.NullBooleanField()),
                ('safetyHazards', models.NullBooleanField()),
                ('interventionRequired', models.NullBooleanField()),
                ('images', models.ManyToManyField(to='main.Image')),
            ],
        ),
        migrations.AddField(
            model_name='report',
            name='resources',
            field=models.ManyToManyField(to='main.Resource'),
        ),
    ]
