'use strict';
var i18n = require('i18n');
var prop = require('app-config');
var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var errorUtils = require('../../../utils/error-utils');

//=============================================================================
// PRODUCTS VALIDATORS
//=============================================================================
//FIX ME Put all validators in one a JS
var sessionValidator = [
    validate({
        validator: 'matches',
        arguments: ['^[0-9A-Za-zÀ-ú- ]{4,20}$', 'i'],
        message: 'Sessão deve ter de 4 a 20 caracteres. Aceita somente números, letras, espaço e hífen.'
    })
];

var lineValidator = [
    validate({
        validator: 'matches',
        arguments: ['^[0-9A-Za-zÀ-ú- ]{4,20}$', 'i'],
        message: 'Linha deve ter de 4 a 20 caracteres. Aceita somente números, letras, espaço e hífen.'
    })
];

//FIX ME -> Validade image size
var imageValidator = [
    validate({
        validator: 'isLength',
        arguments: [4, 2000000],
        message: 'A foto do produto deve ter no máximo 1MB.'
    })
];

var titleValidator = [
    validate({
        validator: 'matches',
        arguments: ['^[0-9A-Za-zÀ-ú- ]{4,30}$', 'i'],
        message: 'Título deve ter de 4 a 30 caracteres. Aceita somente números, letras, espaço e hífen.'
    })
];

var priceValidator = [
    validate({
        validator: 'matches',
        arguments: ['^[0-9]{1,15}(\.[0-9]{2})?$', 'i'],
        message: 'O preço é inválido.'
    })
];

var parentIdValidator = [
    validate({
        validator: 'matches',
        arguments: ['^[0-9a-fA-F]{24}$', 'i'],
        message: 'O ParentId é inválido.'
    })
];

var descriptionValidator = [
    validate({
        validator: 'matches',
        arguments: ['^[0-9A-Za-zÀ-ú- ]{4,50}$', 'i'],
        message: 'A descrição deve ter de 4 a 50 caracteres. Aceita somente números, letras, espaço e hífen.'
    })
];

var skuValidator = [
    validate({
        validator: 'isLength',
        arguments: [4, 20],
        message: 'O SKU deve ter de 4 a 20 caracteres.'
    })
];

var commissionValidator = [
    validate({
        validator: 'matches',
        arguments: ['^[0-9]{1,2}(\.[0-9]{1,2})?$', 'i'],
        message: 'A comissão é inválida. Ex.: 99.99'
    })
];

var optionValidator = [
    validate({
        validator: 'matches',
        arguments: ['^[0-9A-Za-zÀ-ú- ]{4,20}$', 'i'],
        message: 'A opção deve ter de 4 a 20 caracteres. Aceita somente números, letras, espaço e hífen.'
    })
];

var domainNameValidator = [
    validate({
        validator: 'matches',
        arguments: ['^[0-9A-Za-z_]{3,20}$', 'i'],
        message: 'O nome do domínio deve conter de 3 a 20 caracteres. Aceita somente números, letras e underline.'
    })
];

//=============================================================================
// PRODUCTS SCHEMA
//=============================================================================
var Products = new mongoose.Schema({
    domainName: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
        validate: domainNameValidator
    },
    image: {
        type: String,
        trim: true,
        validate: imageValidator
    },
    price: {
        type: String,
        trim: true,
        required: false,
        validate: priceValidator
    },
    session: {
        type: String,
        trim: true,
        required: true,
        validate: sessionValidator
    },
    line: {
        type: String,
        trim: true,
        required: true,
        validate: lineValidator
    },
    commission: {
        type: String,
        required: true,
        trim: true,
        validate: commissionValidator
    },
    title: {
        type: String,
        trim: true,
        required: true,
        validate: titleValidator
    },
    description: {
        type: String,
        trim: true,
        required: true,
        validate: descriptionValidator
    },
    sku: {
        type: String,
        trim: true,
        required: false,
        validate: skuValidator
    },
    option: {
        type: String,
        trim: true,
        required: false,
        validate: optionValidator
    },
    parentId: {
        type: String,
        trim: true,
        required: false,
        validate: parentIdValidator
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

Products.index({
    description: 1,
    domainName: 1,
    title: 1
}, {
    unique: true
});

var ProductsModel = mongoose.model('Products', Products);

//=============================================================================
// PRODUCTS MIDDLEWARES
//=============================================================================
//Define change date time when schema is saved
Products.pre('save', function(next) {
    this.createDateTime = new Date().getTime();
    this.changeDateTime = new Date().getTime();
    next();
});

Products.pre('save', function(next) {
    ProductsModel.findOne({
        $and: [{
            domainName: this.domainName
        }, {
            description: this.description
        }, {
            title: this.title
        }]
    }, function(err, product) {
        if (err) {
            next(err);
        } else {
            if (product && product.title) {
                next(errorUtils.getValidationError(prop.config.http.bad_request, i18n.__('validation').products_save_title_description_duplicated));
            } else {
                next();
            }
        }
    });
});

module.exports = ProductsModel;