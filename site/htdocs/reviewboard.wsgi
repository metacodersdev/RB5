import __main__
__main__.__requires__ = ['ReviewBoard']
import pkg_resources

import os

os.environ['REVIEWBOARD_SITEDIR'] = '/site'

from reviewboard.wsgi import application
