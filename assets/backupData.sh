#!/bin/bash

#Backup mysql/mariadb data
BACKUP_DESTINATION=<%= destinationPath %>
DB_USER=<%= user %>
DB_USER_PASSWORD=<%= password %>
DB=<%= db %>

echo "Backup of $DB:"
if [[ ! -d $BACKUP_DESTINATION ]]
then
    echo "$BACKUP_DESTINATION is not a directory or does not exists."
    exit 0
else
    backupFilePath=$(echo $BACKUP_DESTINATION | sed "s/\/$//")/${DB}_$(date +"%Y-%m-%d_%H-%M-%S").sql 
    docker exec mariadb /usr/bin/mysqldump --databases $DB -u $DB_USER --password=$DB_USER_PASSWORD > $backupFilePath
    echo "Backup file ($backupFilePath) created." 
fi