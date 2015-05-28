import os
import sys
sys.path.append('/var/www/addigy-summer-2015')
sys.path.append('/var/www/addigy-summer-2015/macmanage')
os.environ['DJANGO_SETTINGS_MODULE'] = 'macmanage.settings'

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()

#import django.core.handlers.wsgi
#application = django.core.handlers.wsgi.WSGIHandler()
