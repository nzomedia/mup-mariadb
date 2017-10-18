# mup-mariadb
MariaDb container plugin for meteor-up

## why ?
I needed this in a project where mysql was used to store data. I also needed to separate mysql 
from our meteor application. So i thought it would be good if we could setup a mysql container aside the meteor application one.

## How i did ?
I took a look at meteor-up source code, mostly the mongodb plugin. Then did some copy pasting, basically replace mongodb docker image with a mariadb one and tweaked shell commands to make it work.

Then i realized there's an [official documentation to build plugins](http://meteor-up.com/docs.html#creating-a-plugin). Please folow that if you intend to create your own plugin as it simplifies the process.

## What does it do ?
The plugin will add a mariadb (remember mariadb is a drop-in replacement of mysql) container to meteor-up default setup. The container will be linked to the meteor app container, it will be named **mariadb**.
It also shares mariadb data files and config through docker volumes in host folder **/opt/mariadb/**.

For the moment the container is based on the official mariadb docker hub image ([mariadb:latest](https://hub.docker.com/_/mariadb/)).

Actually it sets mariadb root password to "**passer**". i'll change that soon.
Visit the official image page, to see different options to manage root password.

## How to use ?
* Install mup-mariadb plugin:

`npm i -g nzomedia/mup-mariadb`

* Add mup-mariadb plugin in your mup.js file like this:
```
File mup.js:
{
    ...
    plugins: [ "mup-mariadb" ]
    ...
}
```
* Add a configuration object in the mup.js file, to define the database name, user name and password, etc...:
```
    File mup.js:
    {
        ...
        mariadb: {
            version: 'latest',
            databaseName: "my-database",
            port: 3306, 
            databaseUser: "my-database-user",
            userPassword: "my-database-user-password",
            customConfig: "path/to/my/custom/mysql/my.cnf",
            sqlDumpFile: "path/to/my/sql/dump.sql",
            servers: {
                one: {}
            }
        ...
        }
    }
```
### Configuration properties explained:
    - version: the mariadb docker image version.
    - databaseName: the container will automatically create a database with that name by default.
    - port: Mariadb port, default 3306.
    - databaseUser: the user that owns "databaseName",
    - userPassword: the database owner password.
    - customConfig: If you want to use your own configuration file, put its path here. it will be mounted in the container and override the default configuration of mariadb.
    - sqlDumpFile: Say you want to populate your database with some content. Make a sql dump file containing your initial data and past its path here. The container will automatically execute the sql commands.
    It's also useful in order to give some privileges to the db user or set some configuration parameters.
    servers: The server on which the mariadb container will run.

**NB:**
The **customConfig** and **sqlDumpFile** paths are taken from **were the mup.js file is**. So write a relative path from were mup.js is located.

The **databaseName**, **databaseUser** are required.

* That's it, run your mup setup commands as usual:
```
    mup validate // to make sure your configuration is correct.
    mup setup //You should see "setup mariadb" among the build steps.
    mup deploy //to build, prepare, push to remote server and run your app, you already know :)
```

## Backup and restore database Data:
Presently, the plugin provides a mean to make logical backups and restores of the database using _mysqldump_ command internally.

### Backup procedure:
1. Add `mariadb.backup` property to _mup.js_. It should have a key named `destinationPath` that indicates where to store sql dump file. The path should be already present on the host file system and read-writable.

    Exemple:
    ```
    File mup.js:
    mariadb: {
        databaseName: "my-database",
        port: 3306, 
        databaseUser: "my-database-user",
        userPassword: "my-database-user-password",
        servers: {
            one: {}
        },
        backup: {
            destinationPath: "/folder/inside/host/machine/"
        }
    }

    ```
    _Database information (name, user, password,...) is required._

2. On the CLI run the command:
```
mup mariadb backup
```

**What happens next ?**<br>
The sql dump will be saved in the specified path and the name will be <database-name>_YYYY-MM-dd_HH-mm-ss.sql_.
With _MM_ specifying the month number on two digits.<br>
Exemple: `my-database_2017-10-11_19-10-20.sql`

Remember the dump file is actually stored on the host. In the future, if necessary, i'll implement a way to compress, and download it.


### Restore procedure:

To restore database data:
1. Add `mariadb.restore` property to _mup.js_ file. It should have a property named `sqlDumpFile` that indicates the sql dump file containing SQL commands (DDL, LMD, ...) to execute.

    Exemple:

    ```
    File mup.js:
    mariadb: {
        databaseName: "my-database",
        port: 3306, 
        databaseUser: "my-database-user",
        userPassword: "my-database-user-password",
        servers: {
            one: {}
        },
        restore: {
            sqlDumpFile: "/path/to/sql_dump_file.sql"
        }
    }
    ```
    _Database information (name, user, password,...) is required._

2. On the CLI run the command:
    ```
    mup mariadb restore
    ```
**What happens next ?**<br>
The SQL dump file will be copied in the host at `/opt/<app-name>/tmp` then we use _mysqldump_ to execute its commands. At last, we delete it from the host.


## What remains ?
1. Write tests (how ???)
2. Pass tests
3. Find a better way to manage root password.
3. Reduce the size of the container, it's actually using debian:jessy base image. And in my setup it uses ~400MB on disk once installed.

## This project is under development, it doesn't have tests yet, it may contain errors. I'll update the readme in case of change. If you want to help, please contact me :).
