#!/bin/bash

MARIADB_VERSION=<%= mariadbVersion %>

set -e

#pas besoin de creer le dossier de données ici sudo mkdir -p <%= mariadbDir %>
sudo docker pull mariadb:$MARIADB_VERSION

set +e

sudo docker update --restart=no mariadb
sudo docker exec mariadb mysqld stop
sleep 5
sudo docker rm -f mariadb

set -e

echo "Running mariadb:<%= mariadbVersion %>"

sudo docker run \
  -d \
  --restart=always \
  --publish=127.0.0.1:3306:<%= mariadbPort %> \
  --volume=/opt/mariadb/data:<%= mariadbDir %> \
  --volume=/opt/mariadb/config:<%= mariadbConfigDir %> \
  --volume=/opt/mariadb/initdb:/docker-entrypoint-initdb.d \
  -e MYSQL_ROOT_PASSWORD=<%= mariadbRootPassord %> \
  -e MYSQL_DATABASE=<%= mariadbDbName %> \
  -e MYSQL_USER=<%= mariadbUserName %> \
  -e MYSQL_PASSWORD=<%= mariadbUserPassword %> \
  --name=mariadb \
  mariadb:$MARIADB_VERSION
