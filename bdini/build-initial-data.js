//=============================================================================
// START THE SERVER
//=============================================================================
var mongoose = require('mongoose');
var prop = require('../config/dev/config.js');
var User = require('./users');

mongoose.connect(prop.database.mongo_url);

User.add('ROOT', 'root@root.com', 'ROOT');
// User.add('ADMIN', 'root@root.com', 'TESTE');
// User.add('CONSULTOR', 'root@root.com', 'TESTE');