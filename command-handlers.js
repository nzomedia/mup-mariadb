
const nodemiral = require('nodemiral');
const log = function(msg){
    console.log("mup-mariadb:", msg);
}

module.exports = {
  logs: function(api) {
    log('exec => mup mariadb logs');

    const args = api.getArgs();
    const sessions = api.getSessions(['mariadb']);
    args.shift(); // remove mongo from args sent to docker
    return api.getDockerLogs('mariadb', sessions, args);
  },

  setup: function(api) {
    log('exec => mup mariadb setup');

    if (!api.getConfig().mariadb) {
      // could happen when running "mup mongo setup"
      log(
        'Not setting up built-in mariadb since there is no mariadb config'
      );
      return;
    }

    const mariadbSessions = api.getSessions(['mariadb']);
    const meteorSessions = api.getSessions(['app']);
    const config = api.getConfig().mariadb;

    const list = nodemiral.taskList('Setup Mariadb');

    list.executeScript('Setup Environment', {
      script: api.resolvePath(__dirname, 'assets/mariadb-setup.sh')
    });

    const fs = require('fs');

    if(config.customConfig && config.customConfig.length){
      let mariadbConfigFile = api.resolvePath(api.getBasePath(), config.customConfig); 
      if(!fs.existsSync(mariadbConfigFile))
        log("File not found:", config.configFile);
      else {
        //To copy our custom configuration file in the remote mount point
        //so that the mariadb container can load it: 
        list.copy('Copying custom mariadb cnf file', {
          src: mariadbConfigFile,
          dest: '/opt/mariadb/config/my.cnf'
        });
      }
    }
    if(config.sqlDumpFile && config.sqlDumpFile.length){
      let customSqlDumpFile = api.resolvePath(api.getBasePath(), config.sqlDumpFile);
      if(!fs.existsSync(customSqlDumpFile))
        log("File not found:", config.sqlDumpFile);
      else {
        //we copy our initial sql commands file, to remote mount point
        list.copy('Copying mariadb database sql dump file', {
            src: customSqlDumpFile,
            dest: '/opt/mariadb/initdb/initdb.sql'
          });
      }
    }

    const sessions = api.getSessions(['mariadb']);

    return api.runTaskList(list, sessions, { verbose: api.verbose });
  },

  start: function(api) {
    log('exec => mup mariadb start');

    const mariadbSessions = api.getSessions(['mariadb']);
    const meteorSessions = api.getSessions(['app']);
    const config = api.getConfig().mariadb;

    //Mariadb will be on another host ( or container)
    // if (
    //   meteorSessions.length !== 1 ||
    //   mariadbSessions[0]._host !== meteorSessions[0]._host
    // ) {
    //   log('Skipping mariadb start. Incompatible config');
    //   return;
    // }

    const list = nodemiral.taskList('Start Mariadb');

    list.executeScript('Start Mariadb', {
      script: api.resolvePath(__dirname, 'assets/mariadb-start.sh'),
      vars: {
        mariadbVersion: config.version || '15.1',
        mariadbDir: '/var/lib/mysql',
        mariadbConfigDir: '/etc/mysql/conf.d',
        mariadbRootPassord: 'passer',
        mariadbDbName: config.databaseName,
        mariadbUserName: config.databaseUser,
        mariadbUserPassword: config.userPassword,
	mariadbPort: config.port

      }
    });
    return api.runTaskList(list, mariadbSessions, { verbose: api.verbose });
  },

  stop: function(api) {
    log('exec => mup mariadb stop');
    const list = nodemiral.taskList('Stop Mariadb');

    list.executeScript('stop mariadb', {
      script: api.resolvePath(__dirname, 'assets/mariadb-stop.sh')
    });

    const sessions = api.getSessions(['mariadb']);
    return api.runTaskList(list, sessions, { verbose: api.verbose });
  }
}
