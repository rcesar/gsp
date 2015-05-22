var mongoose = require('mongoose');
var prop = require('../config/dev/config.js');
var User = {};

User.add = function(type, email, domain) {

  var conn = mongoose.connection;

  var user = {
    username: email,
    password: type,
    role: type,
    domainName: domain,
    fullName: 'Rennan Nogarotto',
    nickName: 'Rennan',
    timeZone: '+0300',
    cpf: '32212047878',
    phone: '55211988887777',
    userPhoto: '12345',
    createDateTime: new Date().getTime(),
    changeDateTime: new Date().getTime(),
    active: true
  };

  conn.collection('users').insert(user, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('User '+type+' created.');
    }
  });
  return true;
};

module.exports = User;