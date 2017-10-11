const commandHandlers = require('./command-handlers');

module.exports = {
  setup: {
    description: 'Installs and starts MariaDB',
    handler: commandHandlers.setup
  },

  logs: {
    description: 'View MariaDB logs',
    handler: commandHandlers.logs
  },

  start: {
    description: 'Start MariaDB',
    handler: commandHandlers.start
  },

  stop: {
    description: 'Stop MariaDB',
    handler: commandHandlers.stop
  },
  backup: {
    description: "Make a backup of the database data",
    handler: commandHandlers.backup
  },
  restore: {
    description: "Restore data from a SQL dump file.",
    handler: commandHandlers.restore
  }

}
