# Nginx Configuration
This should be fairly simple to most people familiar with Nginx. The files you need to drop in the conf folder are all in this folder.

Just a couple of things to note:
* There are a bunch of paths you'll need to update to make this work. These are all in nginx.conf
* This assumes the Django app is running on localhost:8000. If this is not true, you'll need to update this.
* Nginx needs to be compiled from source with the [nginx-http-shibboleth](https://github.com/nginx-shib/nginx-http-shibboleth), [nginx-push-stream](https://github.com/wandenberg/nginx-push-stream-module) and [headers-more-nginx-module](https://github.com/openresty/headers-more-nginx-module) modules. Ensure SSL is enabled in the ./configure script.
* Shibboleth requires a valid SSL certificate, and keys must be excahnge with UCL if you want to set something like this up on your own. The best way to contribute to this project is to submit pull requests to this main repository, as we'll then pull them onto the main server once merged. Without exchanging private keys with UCL it is not possible to set the whole site up on your own box.
* We plan to (eventually!) get this running with something like gunicorn over wsgi. Once we configure this, a new conf file will be pushed to git with information on how you can do this, too. At the moment Nginx is just being used as a reverse proxy for Django. With the current load this is not an issue.