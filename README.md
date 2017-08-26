# game-logger-backend

Game-Logger-Backend provides a simple logging service for games. 

## How to Deploy

### Configure your Database

Game-Logger-Backend uses MySQL as the database system. The database design file is in `db/db.sql`. Run the `sql` file in the mysql client and the database will be ready to use. 

### Start the Server on Bare Metal

First all, you will need to create a file with name `.env` in the root folder of the project. The content of the file should look like this:

```environment
SERVER_PORT=10080
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASS=root
DB_DATABASE=game_logger
```

After this, you need to run `npm install` to download all the project dependencies. And finally, run `node server/server.js` to start the server.

### Start Server with Docker

The server can be deployed with Docker images. Use the following command to pull the image form docker hub.

```bash
docker pull yifansun/game-logger-backend:0.1
```

When the download completes, use the following command to launch the server:

```bash
docker run -p 18080:80 --env DB_HOST=[db_host] --env DB_PORT=[db_port] --env DB_USER=[db_username] --env DB_PASS=[db_password] --env DB_DATABASE=game_logger -d --name game-logger-backend yifansun/game-logger-backend:0.1
```

You will need to replace the database linking parameters in the command to make sure that the server can connect to the database.

### Deploy with HTTPs

Although it is possible to configure the SSL certificate directly with nodejs, we recommend to use Apache as a proxy. It will be easier to deploy the certificate and enable virtual hosting.

Assuming you have Apache installed and running and you have your SSL certificate ready, you will first need to add a configuration file in `/etc/apache2/sites-available` directory with name `game_logger.conf`. The content should be the following:

```Apache
<VirtualHost *:443>
    ServerName [your_domain_name]
    ServerAlias www.[your_domain_name]

    ProxyPreserveHost On
    ProxyRequests Off

    SSLEngine on
    SSLProtocol all -SSLv2
    SSLCipherSuite HIGH:MEDIUM:!aNULL:!MD5
    SSLCertificateFile "[path/to/certificate]"
    SSLCertificateKeyFile "[path/to/private_key]"

    <Proxy *>
        Order deny,allow
        Allow from all
    </Proxy>

    ProxyPass / http://localhost:[port]/
    ProxyPassReverse / http://localhost:[port]/
</VirtualHost>
```

Then, the command `a2ensite game_logger` enables the sites. You should also need to restart the Apache Server with command `service apache2 restart` to make the change take effect.
