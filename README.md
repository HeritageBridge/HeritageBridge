# HeritageBridge

### Install

The dependencies for this app are Python 3.6 and Postgres/PostGIS (versions >= 9.3 and >= 2.3 respectively should be fine). You should be able to run `psql` commands from your terminal.

It's also recommended that you install `virtualenv` (or something similar) so you can create a sandboxed Python environment for development. 

Once these things are installed, the following steps will get you up and running.

1. clone and enter the repo

        git clone https://github.com/heritagebridge/heritagebridge
        cd heritagebridge

2. make the virtualenv and activate it

        virtualenv env
        source env/bin/activate
    
    _Make sure that your env uses python 3.6. Once activated, run `python` to check this._
    
3. install all python requirements

        pip install -r requirements.txt

4. add `\herbridge\herbridge\local_settings.py` (next to `settings.py`) with the following content
        
        import os
        
        os.environ['GDAL_DATA'] = '/opt/bitnami/postgresql/share/gdal/'
        
        DATABASES['default']['USER'] = '<postgres user>'
        DATABASES['default']['PASSWORD'] = '<postgres password>'
        
        DEBUG = False
        ALLOWED_HOSTS = ['35.225.119.170', 'localhost', '127.0.0.1', '<sub.domain.com>']
        
        FRONTEND_AUTH_PASSWORD = '<a password for access to this instance>'
        FRONTEND_AUTH_TOKEN = '<a cookie for users who are logged in>'
        EAMENA_TARGET = '<an eamena installation as a target>'
        
        ## configuration for S3 static files and media storage
        AWS_ACCESS_KEY_ID = '<key>'
        AWS_SECRET_ACCESS_KEY = '<secret key>'
        
        AWS_STORAGE_BUCKET_NAME = '<bucket name>'
        AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com'
        
        AWS_S3_OBJECT_PARAMETERS = {
            'CacheControl': 'max-age=86400',
        }
        
        AWS_IS_GZIPPED = True
        
        AWS_LOCATION = 'static'
        STATICFILES_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
        STATIC_URL = f"https://{AWS_S3_CUSTOM_DOMAIN}/{AWS_LOCATION}/"
        
        DEFAULT_FILE_STORAGE = 'herbridge.storage_backends.MediaStorage'
        MEDIA_URL = f"https://{AWS_S3_CUSTOM_DOMAIN}/media/"
        
        LOGGING = {
            'version': 1,
            'disable_existing_loggers': False,
            'handlers': {
              'applogfile': {
                  'level':'DEBUG',
                  'class':'logging.handlers.RotatingFileHandler',
                  'filename':'/opt/bitnami/apps/django/django_projects/herbridge/herbridge.log',
                  'maxBytes': 1024*1024*15, # 15MB
                  'backupCount': 10,
              },
            },
            'loggers': {
                'django': {
                    'handlers': ['applogfile'],
                    'level': 'DEBUG',
                    'propagate': True,
                },
            },
        }
    
5. initial db installation

        cd herbridge
        python manage.py db install

6. initial migration and sample data load

        python manage.py db setup --loaddata
        
You can now use `python manage.py runserver` to view the app in a browser at `localhost:8000`.

### Development

Running `python manage.py db setup` during development will drop and recreate your database, then make and run migrations if changes have been made to any model classes.

Adding `--loaddata` will reload the sample data fixtures that come along with the app.

Adding `--removemigrations` will delete all of the existing migration files before making new ones, which yields a single `0001_initial.py` once the command has finished. During development, please do this before committing if you have made changes that will cause a new migration file to be made (e.g. altered a model field).

