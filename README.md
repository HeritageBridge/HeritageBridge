# HeritageBridge

### install

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

        from herbridge.settings import DATABASES

        DATABASES['default']['USER'] = '<set the username for the postgres user the app will use>'
        DATABASES['default']['PASSWORD'] = '<set your own password>'

5. initial db installation

        cd herbridge
        python manage.py db install

6. initial migration and sample data load

        python manage.py db setup --loaddata
        
You can now use `python manage.py runserver` to view the app in a browser at `localhost:8000`.

### development

Running `python manage.py db setup` during development will drop and recreate your database, then make and run migrations if changes have been made to any model classes.

Adding `--loaddata` will reload the sample data fixtures that come along with the app.

Adding `--removemigrations` will delete all of the existing migration files before making new ones, which yields a single `0001_initial.py` once the command has finished. During development, please do this before committing if you have made changes that will cause a new migration file to be made (e.g. altered a model field).

