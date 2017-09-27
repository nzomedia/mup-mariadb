
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

    const list = nodemiral.taskList('Setup Mariadb');

    list.executeScript('Setup Environment', {
      script: api.resolvePath(__dirname, 'assets/mariadb-setup.sh')
    });

    //TODO externaliser la config, puis la monter
    list.copy('Copying mariadb.conf', {
      src: api.resolvePath(__dirname, 'assets/mariadb.conf'),
      dest: '/opt/mariadb/config/my.cnf'
    });

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
