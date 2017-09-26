#!/bin/bash

sudo mkdir -p /opt/mariadb/data
sudo mkdir -p /opt/mariadb/config
sudo chown ${USER} /opt/mariadb -R

#nécessaire pour les cas où l'hote utilise seLinux
#pour permettre l'accés au dossier monté avec docker:
chcon -Rt svirt_sandbox_file_t /opt/mariadb
