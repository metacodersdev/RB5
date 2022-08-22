# Site-specific configuration settings for Review Board.
# Definitions for some of these settings can be found at
# https://docs.djangoproject.com/en/dev/ref/settings/

# Database configuration.
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": "reviewboard",
        "USER": "reviewboard",
        "PASSWORD": "reviewboard123",
        "HOST": "db",
        "PORT": ""
    }
}

# Cache backend settings.
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.memcached.PyMemcacheCache",
        "LOCATION": "memcached:11211"
    }
}

# Unique secret key. Don't share this with anybody!
#
# This is used for generating encrypted content, like repository credentials
# and user password hashes, and for your server's Install Key (needed for
# some extensions and for support).
#
# The same key must be used for any server talking to the configured
# database. If you create or move the site, this same key must be used.
SECRET_KEY = "m0!7y7@0x*(c*m_g(k=alqxl7c-)c!o#4obpuz^dy%h_0q^49n"

# The path in the URL of the Review Board server, relative to the domain.
SITE_ROOT = "/"

# This should *always* be set to False in production! Only set this to True
# on test servers when requested by Beanbag, Inc. support.
DEBUG = True

# A list of domains or IP addresses that this server identifies as.
# Review Board will refuse to handle requests to anything else.
ALLOWED_HOSTS = [
    "127.0.0.1",
    "localhost",
    "0.0.0.0",
    "192.168.50.160"
]
LOGGING_TO_STDOUT = True
