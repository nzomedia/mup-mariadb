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
  }
}
