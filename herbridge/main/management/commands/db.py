import os
from itertools import chain
import shutil
import psycopg2 as db
from django.core import management
from django.core.management.base import BaseCommand, CommandError
from django.conf import settings
from django.contrib.auth.models import User
from main.models import Resource, Report, Image, Assessor

class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('operation', nargs='?',
            choices=['test','setup','install','uninstall'],
            help='')
        parser.add_argument('--loaddata',action='store_true',default=False,
            help='loads fixtures containing sample data')
        parser.add_argument('--removemigrations',action='store_true',default=False,
            help='removes all existing migration files')

    def handle(self, *args, **options):
        if options['operation'] == 'test':
            self.make_db_connection()
        if options['operation'] == 'setup':
            self.setup_db(
                loaddata=options['loaddata'],
                remove_migrations=options['removemigrations'],
            )
        if options['operation'] == 'install':
            self.install()
        if options['operation'] == 'uninstall':
            self.remove_db()
            
    def make_db_connection(self,db_conn=True):
    
        dbinfo = settings.DATABASES['default']
        if db_conn:
            dbname = dbinfo['NAME']
        else:
            dbname = ''
        try:
            conn = db.connect(
                host=dbinfo['HOST'],
                user=dbinfo['USER'],
                database=dbname,
                password=dbinfo['PASSWORD'],
                port=int(dbinfo['PORT']),
            )
            conn.autocommit = True
            print("successfully connected")
        except db.OperationalError:
            print("can't make database connection. make sure all of your "\
            "settings.py DATABASES parameters are corrent, and then run\n"\
            "python manage.py db install")
            return False

        return conn
        
    def install(self,dryrun=False):
        dbuser = settings.DATABASES['default']['USER']
        dbpw = settings.DATABASES['default']['PASSWORD']
        dbname = settings.DATABASES['default']['NAME']
        
        sql = [
            f"CREATE USER {dbuser};",
            f"ALTER USER {dbuser} WITH ENCRYPTED PASSWORD '{dbpw}';",
            f"ALTER USER {dbuser} WITH SUPERUSER;",
            f"CREATE DATABASE {dbuser};",
            f"CREATE DATABASE {dbname} ENCODING 'utf8';",
            f"ALTER DATABASE {dbname} OWNER TO {dbuser};",
        ]
        
        for command in sql:
            if dryrun:
                print(command)
            else:
                os.system(f'psql -U postgres -c "{command}"')
    
    def delete_old_migration_files(self):
        '''delete all old migration files to wipe the slate clean'''
        
        mdir = os.path.join(settings.BASE_DIR,'main','migrations')
        for f in os.listdir(mdir):
            if f == "__init__.py" or f == "__pycache__":
                continue
            os.remove(os.path.join(mdir,f))
    
    def setup_db(self,loaddata=False,remove_migrations=False):
        dbname = settings.DATABASES['default']['NAME']
        conn = self.make_db_connection(db_conn=False)
        cursor = conn.cursor()
        print(f"dropping existing db: {dbname}")
        cursor.execute(f"DROP DATABASE {dbname}")
        print(f"creating db: {dbname}")
        cursor.execute(f"CREATE DATABASE {dbname} WITH ENCODING 'UTF8'")
        
        if remove_migrations:
            print("deleting existing migration files")
            self.delete_old_migration_files()
        
        management.call_command('makemigrations')
        management.call_command('migrate')
        
        print("making admin user...")
        
        admin_user = User.objects.create_user(
            settings.ADMIN_USERNAME,
            settings.ADMIN_EMAIL,
            settings.ADMIN_PW,
        )
        admin_user.is_staff = True
        admin_user.is_superuser = True
        admin_user.save()
        
        print(f"admin superuser created: {settings.ADMIN_USERNAME}\n"\
        f"password: {settings.ADMIN_PW}")
        
        if loaddata:
            for fixture in settings.FIXTURES_TO_LOAD:
                print("loading:",fixture)
                if fixture == 'images.json':
                    img_dir = os.path.join(settings.BASE_DIR,'main','fixtures','images')
                    for f in os.listdir(img_dir):
                        dest_path = os.path.join(settings.MEDIA_ROOT,'sample',f)
                        shutil.copy(os.path.join(img_dir,f),dest_path)
                management.call_command('loaddata',fixture)
            ## re-save all objects so that custom save() is called
            res = Resource.objects.all()
            rep = Report.objects.all()
            img = Image.objects.all()
            asr = Assessor.objects.all()
            all_objects = list(chain(res, rep, img, asr))
            for o in all_objects:
                o.save()
            
    def remove_db(self):
        dbuser = settings.DATABASES['default']['USER']
        dbpw = settings.DATABASES['default']['PASSWORD']
        dbname = settings.DATABASES['default']['NAME']
        
        sql = [
            f"DROP DATABASE {dbname};",
            f"DROP DATABASE {dbuser};",
            f"DROP USER {dbuser};",
        ]
        
        for command in sql:
            os.system(f'psql -U postgres -c "{command}"')