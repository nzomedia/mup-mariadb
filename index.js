import * as _commands from './commands';

import _validator from './validate';

export const name = "mariadb";
export const description = 'Commands to manage MariaDB';
export let commands = _commands;
export const validate = {
  mariadb: _validator
};

export function prepareConfig(config) {
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
}

export const hooks = {
  'post.default.setup'(api) {
    const config = api.getConfig();
    if (config.mariadb) {
      return api.runCommand('mariadb.setup').then(() => api.runCommand('mariadb.start'));
    }
  }
};

