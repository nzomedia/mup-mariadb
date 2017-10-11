#!/bin/bash

# Restore mysql/mariadb data
DUMP_FILE_PATH=<%= dumpFilePath %>
DB_USER=<%= user %>
DB_USER_PASSWORD=<%= password %>
DB=<%= db %>

echo "Restoring data to database \"$DB\":"
if [[ ! -f $DUMP_FILE_PATH ]]
then
    echo "$DUMP_FILE_PATH does not exists."
    exit 0
else
    cat $DUMP_FILE_PATH | docker exec -i mariadb /usr/bin/mysql -u $DB_USER --password=$DB_USER_PASSWORD $DB
    echo "Data restoration finished." 
    echo "Deleting sql dump file:"
    rm -- $DUMP_FILE_PATH
    echo "Done"
fi