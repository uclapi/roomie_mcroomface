# Supervisor Configuration for Shibboleth
Supervisor is a command line unix tool for converting applications into services that can be stopped, started and restarted like real daemons. We use it to bind the Shibboleth authoriser and responder to Unix sockets that Nginx can connect to.

We have included a file called `shib.conf` in this folder. Drop this into your Supervisor configuration's `/etc/supervisor/conf.d` folder and restart Supervisor to get Shibboleth running. This requires the installation of the Ubuntu Supervisor package along with all the Shib packages.

The following command should install the required dependancies to build Nginx, set up Supervisor, run the Django code and install Shibboleth.
`apt-get -y install libpq-dev build-essential python3-pip letsencrypt git libssl-dev supervisor shibboleth-sp2-common shibboleth-sp2-schemas shibboleth-sp2-utils libgeoip-dev libpcre3 libpcre3-dev wget geoip-bin geoip-database python-virtualenv`