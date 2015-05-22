//=============================================================================
// DATABASE CONFIGURATION FOR MONGODB
//=============================================================================
'use strict';
var prop = require('app-config');
var mongoose = require('mongoose');
var db = mongoose.connection;
var dbConfig = {};

/**
 * Configure application database.
 * @param app - Express instance initialized.
 */
dbConfig.init = function(app) {

  //Configure default output for errors
  db.on('error', console.error);

  //Configure default output for each connection on database
  db.once('open', function() {
    console.log(prop.config.message.database.mongo_connected);
  });

  //Connect on database
  mongoose.connect(prop.config.database.mongo_url, function(error) {
    if (error) {
      console.log(error);
    }
  });
};

module.exports = dbConfig;