const _commands = require('./commands');
const _validator = require('./validate');

module.exports = {
  name: "mariadb",
  description: 'Commands to manage MariaDB',
  commands: _commands,
  validate: function(){
    mariadb: _validator
  },

  prepareConfig: function(config) {
    if (!config.app || !config.mariadb) {
      return config;
    }

    config.app.env = config.app.env || {};
    var dbName = config.mariadb.databaseName || config.app.name.split('.').join('');
    var dbPort = config.mariadb.port || 3306;
    config.app.env['MARIADB_URL'] = `mysql://mariadb:${dbPort}/${dbName}`;

    if (!config.app.docker) {
      config.app.docker = {};
    }

    if (!config.app.docker.args) {
      config.app.docker.args = [];
    }

    config.app.docker.args.push('--link=mariadb:mariadb');
  },

hooks: {
  'post.default.setup'(api) {
    const config = api.getConfig();
    if (config.mariadb) {
      return api.runCommand('mariadb.setup').then(() => api.runCommand('mariadb.start'));
    }
  }
}
};

