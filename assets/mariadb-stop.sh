#!/bin/bash
sudo docker update --restart=no mariadb
sudo docker exec mariadb mysqld stop
sleep 5
sudo docker rm -f mariadb
