var joi = require('joi');

var schema = joi.object().keys({
  version: joi.string(),
  databaseName: joi.string(),
  databaseUser: joi.string(),
  port: joi.number(),
  userPassword: joi.string(),
  servers: joi.object().keys().required()
});

module.exports = function(config, utils) {
  var details = [];

  var validationErrors = joi.validate(config.mariadb, schema, utils.VALIDATE_OPTIONS);
  details = utils.combineErrorDetails(details, validationErrors);

  return utils.addLocation(details, 'mariadb');
};