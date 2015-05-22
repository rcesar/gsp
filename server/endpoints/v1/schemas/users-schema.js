'use strict';
var i18n = require('i18n');
var prop = require('app-config');
var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var errorUtils = require('../../../utils/error-utils');
var documentsValidator = require('../../../validators/documents-validator');

//=============================================================================
// BACKOFFICE USER VALIDATORS
//=============================================================================
//FIX ME Put all validators in one a JS
var usernameValidator = [
    validate({
        validator: 'isEmail',
        message: 'Username deve ser um e-mail válido.'
    })
];

var fullNameValidator = [
    validate({
        validator: 'matches',
        arguments: ['^[0-9A-Za-zÀ-ú-]{2,30}[ ]{1,1}[0-9A-Za-zÀ-ú- ]{2,30}$', 'i'],
        message: 'Nome completo inválido. O nome completo aceita somente números, letras, espaço e hífen.'
    })
];

var nickNameValidator = [
    validate({
        validator: 'isLength',
        arguments: [4, 20],
        message: 'O apelido deve ter de 4 a 20 caracteres.'
    })
];

var passwordValidator = [
    validate({
        validator: 'isLength',
        arguments: [4, 12],
        message: 'A senha deve ter de 4 a 12 caracteres.'
    })
];

var userPhotoValidator = [
    validate({
        validator: 'isLength',
        arguments: [4, 2000000],
        message: 'A foto do usuário deve ter no máximo 1MB.'
    })
];

var passwordValidator = [
    validate({
        validator: 'isLength',
        arguments: [4, 20],
        message: 'A senha deve ter de 4 a 20 caracteres.'
    })
];

var phoneValidator = [
    validate({
        validator: 'matches',
        arguments: ['^[0-9]{10,14}$', 'i'],
        message: 'O telefone aceita somente números e deve ter de 10 a 14 números.'
    })
];

var timeZoneValidator = [
    validate({
        validator: 'matches',
        arguments: ['^(?:Z|[+-](?:2[0-3]|[01][0-9])[0-5][0-9])$', 'i'],
        message: 'O Time Zone deve conter um sinal e 4 números.'
    })
];

var domainNameValidator = [
    validate({
        validator: 'matches',
        arguments: ['^[0-9A-Za-z_]{3,20}$', 'i'],
        message: 'O nome do domínio deve conter de 3 a 20 caracteres. Aceita somente números, letras e underline.'
    })
];

var commissionValidator = [
    validate({
        validator: 'matches',
        arguments: ['^[0-9]{1,2}(\.[0-9]{1,2})?$', 'i'],
        message: 'A comissão é inválida. Ex.: 99.99'
    })
];

var roleValidator = [
    validate({
        validator: 'matches',
        arguments: ['^(admin|ADMIN|consultor|CONSULTOR)$', 'i'],
        message: 'A role deve ser ADMIN ou CONSULTOR.'
    })
];

//=============================================================================
// BACKOFFICE USER SCHEMA
//=============================================================================
var Users = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        validate: usernameValidator
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        validate: fullNameValidator
    },
    nickName: {
        type: String,
        required: true,
        trim: true,
        validate: nickNameValidator
    },
    userPhoto: {
        type: String,
        trim: true,
        validate: userPhotoValidator
    },
    cpf: {
        type: String,
        required: true,
        validate: [isValidCPF, 'CPF inválido.']
    },
    timeZone: {
        type: String,
        trim: true,
        required: true,
        validate: timeZoneValidator
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        validate: phoneValidator
    },
    commission: {
        type: String,
        trim: true,
        validate: commissionValidator
    },
    password: {
        type: String,
        validate: passwordValidator
    },
    domainName: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
        validate: domainNameValidator
    },
    role: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
        validate: roleValidator
    },
    token: {
        type: String,
        required: false,
        select: false
    },
    active: {
        type: Boolean,
        required: true
    },
    createDateTime: {
        type: Number
    },
    changeDateTime: {
        type: Number
    },
    __v: {
        type: Number,
        select: false
    }
});

Users.index({
    username: 1,
    domainName: 1
}, {
    unique: true
});

function isValidCPF(value) {
    return documentsValidator.isValidCPF(value);
}

var UsersModel = mongoose.model('Users', Users);

//=============================================================================
// COMPANY MIDDLEWARES
//=============================================================================
//Define change date time when schema is saved
Users.pre('save', function(next) {
    this.createDateTime = new Date().getTime();
    this.changeDateTime = new Date().getTime();
    next();
});

//Validate duplicated cnpj, name or externalCompanyId.
Users.pre('save', function(next) {
    UsersModel.findOne({
        $and: [{
            'username': this.username
        }, {
            'domainName': this.domainName
        }]
    }, function(err, user) {
        if (err) {
            next(err);
        } else {
            if (user && user.username) {
                next(errorUtils.getValidationError(prop.config.http.bad_request, i18n.__('validation').users_save_username_duplicated));
            } else {
                next();
            }
        }
    });
});

module.exports = UsersModel;