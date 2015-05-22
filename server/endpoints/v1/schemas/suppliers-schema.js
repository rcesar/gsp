'use strict';
var i18n = require('i18n');
var prop = require('app-config');
var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var errorUtils = require('../../../utils/error-utils');
var documentsValidator = require('../../../validators/documents-validator');

//=============================================================================
// SUPPLIERS VALIDATORS
//=============================================================================
//FIX ME Put all validators in one a JS
var domainNameValidator = [
    validate({
        validator: 'matches',
        arguments: ['^[0-9A-Za-z_]{3,20}$', 'i'],
        message: 'O nome do domínio deve conter de 3 a 20 caracteres. Aceita somente números, letras e underline.'
    })
];

var addressZipcodeValidator = [
    validate({
        validator: 'matches',
        arguments: ['^[0-9]{8}$', 'i'],
        message: 'O CEP deve conter somente 8 números.'
    })
];

var supplierNameValidator = [
    validate({
        validator: 'isLength',
        arguments: [2, 40],
        message: 'O nome deve conter de 2 a 40 caracteres.'
    })
];

var phoneTypeValidator = [
    validate({
        validator: 'matches',
        arguments: ['^(comercial|COMERCIAL|residencial|RESIDENCIAL|celular|CELULAR)$', 'i'],
        message: 'O tipo do telefone deve ser COMERCIAL, RESIDENCIAL ou CELULAR.'
    })
];

var personTypeValidator = [
    validate({
        validator: 'matches',
        arguments: ['^(pf|PF|pj|PJ)$', 'i'],
        message: 'O tipo da pessoa deve ser PF ou PJ.'
    })
];

var addressTypeValidator = [
    validate({
        validator: 'matches',
        arguments: ['^(comercial|COMERCIAL|residencial|RESIDENCIAL)$', 'i'],
        message: 'O tipo do endereço deve ser COMERCIAL ou RESIDENCIAL.'
    })
];

var addressStreetValidator = [
    validate({
        validator: 'matches',
        arguments: ['^[0-9A-Za-zÀ-ú- ]{5,50}$', 'i'],
        message: 'O nome da rua deve ter de 5 a 50 caracteres. Aceita somente números, letras, espaço e hífen.'
    })
];

var addressNumberValidator = [
    validate({
        validator: 'matches',
        arguments: ['^[a-zA-Z0-9 ]{1,12}$', 'i'],
        message: 'O número do endereço deve ter de 1 a 12 caracteres e aceita números, letras e espaço.'
    })
];

var addressComplementValidator = [
    validate({
        validator: 'matches',
        arguments: ['^[0-9A-Za-zÀ-ú- ]{3,20}$', 'i'],
        message: 'O complemento do endereço deve ter de 3 a 20 caracteres. Aceita somente números, letras, espaço e hífen.'
    })
];

var addressNeighborhoodValidator = [
    validate({
        validator: 'matches',
        arguments: ['^[0-9A-Za-zÀ-ú- ]{3,100}$', 'i'],
        message: 'O bairro deve ter de 3 a 100 caracteres. Aceita somente números, letras, espaço e hífen.'
    })
];

var addressStateValidator = [
    validate({
        validator: 'matches',
        arguments: ['^[A-Z]{2,2}$', 'i'],
        message: 'O estado deve ter 2 caracteres. Aceita somente letras.'
    })
];

var addressCityValidator = [
    validate({
        validator: 'matches',
        arguments: ['^[0-9A-Za-zÀ-ú- ]{4,30}$', 'i'],
        message: 'A cidade deve ter de 4 a 30 caracteres. Aceita somente números, letras, espaço e hífen.'
    })
];

var addressCountryValidator = [
    validate({
        validator: 'matches',
        arguments: ['^[0-9A-Za-zÀ-ú- ]{3,30}$', 'i'],
        message: 'O país deve ter de 4 a 30 caracteres. Aceita somente números, letras, espaço e hífen.'
    })
];

var emailValidator = [
    validate({
        validator: 'isEmail',
        message: 'O email é inválido.'
    })
];

var phoneNumberValidator = [
    validate({
        validator: 'matches',
        arguments: ['^[0-9]{10,14}$', 'i'],
        message: 'O telefone deve conter de 10 a 14 números.'
    })
];

var stateInscriptionValidator = [
    validate({
        validator: 'matches',
        arguments: ['^[0-9]{5,20}$', 'i'],
        message: 'Incrição estadual aceita somente números. O tamanho deve ser entre 5 e 20 números.'
    })
];

var municipalInscriptionValidator = [
    validate({
        validator: 'matches',
        arguments: ['^[0-9]{5,20}$', 'i'],
        message: 'Incrição municipal aceita somente números. O tamanho deve ser entre 5 e 20 números.'
    })
];

var documentRGValidator = [
    validate({
        validator: 'matches',
        arguments: ['^[A-Za-z0-9-]{8,12}$', 'i'],
        message: 'RG aceita letra, números e hífen. O tamanho deve ser de 8 a 12 caracteres.'
    })
];

//=============================================================================
// SUPPLIERS SCHEMA
//=============================================================================
var Suppliers = new mongoose.Schema({
    supplierName: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
        validate: supplierNameValidator
    },
    cnpjOrCpf: {
        type: String,
        required: true,
        validate: [isValidCPFOrCNPJ, 'CPF ou CNPJ inválidos.']
    },
    personType: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
        validate: personTypeValidator
    },
    birthdate: {
        type: String,
        validate: [isValidBirthdate, 'Data de aniversário deve ser anterior a data atual. O formato deve ser (ddmmaaaa).']
    },
    domainName: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
        validate: domainNameValidator
    },
    stateInscription: {
        type: String,
        required: false,
        trim: true,
        validate: stateInscriptionValidator
    },
    municipalInscription: {
        type: String,
        required: false,
        trim: true,
        validate: municipalInscriptionValidator
    },
    documentRG: {
        type: String,
        required: false,
        trim: true,
        validate: documentRGValidator
    },
    addresses: [{
        street: {
            type: String,
            required: true,
            uppercase: true,
            trim: true,
            validate: addressStreetValidator
        },
        number: {
            type: String,
            required: true,
            validate: addressNumberValidator
        },
        complement: {
            type: String,
            uppercase: true,
            validate: addressComplementValidator
        },
        neighborhood: {
            type: String,
            required: true,
            uppercase: true,
            trim: true,
            validate: addressNeighborhoodValidator
        },
        state: {
            type: String,
            required: true,
            uppercase: true,
            trim: true,
            validate: addressStateValidator
        },
        city: {
            type: String,
            required: true,
            uppercase: true,
            trim: true,
            validate: addressCityValidator
        },
        //FIX ME Applied only for Brazil
        zipCode: {
            type: String,
            required: true,
            validate: addressZipcodeValidator
        },
        country: {
            type: String,
            required: true,
            uppercase: true,
            trim: true,
            validate: addressCountryValidator
        },
        type: {
            type: String,
            required: false,
            uppercase: true,
            validate: addressTypeValidator
        },
        main: {
            type: Boolean,
            required: true
        }
    }],
    emails: [{
        email: {
            type: String,
            required: true,
            validate: emailValidator
        },
        main: {
            type: Boolean,
            required: true
        }
    }],
    phones: [{
        number: {
            type: String,
            required: true,
            validate: phoneNumberValidator
        },
        type: {
            type: String,
            required: false,
            uppercase: true,
            validate: phoneTypeValidator
        },
        main: {
            type: Boolean,
            required: true
        }
    }],
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

function isValidCPFOrCNPJ(value) {
    if (this.personType === 'PF' || this.personType === 'pf') {
        return documentsValidator.isValidCPF(value);
    } else {
        return documentsValidator.isValidCNPJ(value);
    }
}

function isValidBirthdate(value) {
    if (value && value.length == 8) {
        if (value.match(/^(0[1-9]|[1,2][0-9]|3[0,1])(0[1-9]|1[0,1,2])\d{4}$/)) {
            var informedDate = new Date(value.substring(4, 8), value.substring(2, 4) - 1, value.substring(0, 2));
            var currentDate = new Date();
            if (informedDate < currentDate) {
                return true;
            }
        }
    }
    return false;
}


Suppliers.index({
    supplierName: 1,
    domainName: 1,
    cnpjOrCpf: 1
}, {
    unique: true
});

var SuppliersModel = mongoose.model('Suppliers', Suppliers);

//=============================================================================
// SUPPLIERS MIDDLEWARES
//=============================================================================
//Define change date time when schema is saved
Suppliers.pre('save', function(next) {
    this.createDateTime = new Date().getTime();
    this.changeDateTime = new Date().getTime();
    next();
});

//Validate duplicated cnpj, name or externalCompanyId.
Suppliers.pre('save', function(next) {
    SuppliersModel.findOne({
        $or: [{
            $and: [{
                domainName: this.domainName
            }, {
                supplierName: this.supplierName
            }]
        }, {
            $and: [{
                domainName: this.domainName
            }, {
                cnpjOrCpf: this.cnpjOrCpf
            }]
        }]
    }, function(err, supplier) {
        if (err) {
            next(err);
        } else {
            if (supplier && supplier.supplierName) {
                next(errorUtils.getValidationError(prop.config.http.bad_request, i18n.__('validation').suppliers_save_cnpj_suppliername_duplicated));
            } else {
                next();
            }
        }
    });
});

module.exports = SuppliersModel;