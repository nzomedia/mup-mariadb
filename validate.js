var joi = require('joi');

var schema = joi.object().keys({
  version: joi.string(),
  databaseName: joi.string().required(),
  databaseUser: joi.string().required(),
  port: joi.number().default(3306),
  userPassword: joi.string(),
  sqlDumpFile: joi.string().default(""),
  customConfig: joi.string().default(""),
  servers: joi.object().keys().required(),
  backup: joi.object().keys({
    destinationPath: joi.string().required()
  }),
  restore: joi.object().keys({
    sqlDumpFile: joi.string().required()
  }),
});

module.exports = function(config, utils) {
  var details = [];

  var validationErrors = joi.validate(config.mariadb, schema, utils.VALIDATE_OPTIONS);
  details = utils.combineErrorDetails(details, validationErrors);

  return utils.addLocation(details, 'mariadb');
};