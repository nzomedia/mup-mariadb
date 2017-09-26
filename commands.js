import * as commandHandlers from './command-handlers';

export let setup = {
  description: 'Installs and starts MariaDB',
  handler: commandHandlers.setup
};

export let logs = {
  description: 'View MariaDB logs',
  handler: commandHandlers.logs
};

export let start = {
  description: 'Start MariaDB',
  handler: commandHandlers.start
};

export let stop = {
  description: 'Stop MariaDB',
  handler: commandHandlers.stop
};
