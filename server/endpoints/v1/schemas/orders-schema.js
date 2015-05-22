'use strict';
var i18n = require('i18n');
var prop = require('app-config');
var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var errorUtils = require('../../../utils/error-utils');

//=============================================================================
// ORDERS VALIDATORS
//=============================================================================
//FIX ME Put all validators in one a JS
var domainNameValidator = [
    validate({
        validator: 'matches',
        arguments: ['^[0-9A-Za-z_]{3,20}$', 'i'],
        message: 'O nome do domínio deve conter de 3 a 20 caracteres. Aceita somente números, letras e underline.'
    })
];

var quantityValidator = [
    validate({
        validator: 'matches',
        arguments: ['^[0-9]{1,6}$', 'i'],
        message: 'A quantidade é inválida.'
    })
];

var unitDescriptionValidator = [
    validate({
        validator: 'matches',
        arguments: ['^[a-zA-Z0-9]{1,3}$', 'i'],
        message: 'A descrição da unidade é inválida. Aceita somente letras e números'
    })
];

var paymentTypeValidator = [
    validate({
        validator: 'matches',
        arguments: ['^[A-Za-z_ ]{3,40}$', 'i'],
        message: 'O tipo do pagamento deve conter de 3 a 40 caracteres. Aceita letras, underline e espaço.'
    })
];

var paymentInstallmentsValidator = [
    validate({
        validator: 'matches',
        arguments: ['^[0-9]{1,2}$', 'i'],
        message: 'O total de parcelas é inválido.'
    })
];

var customerNameValidator = [
    validate({
        validator: 'isLength',
        arguments: [2, 40],
        message: 'O nome do cliente deve conter de 2 a 40 caracteres.'
    })
];

var consultantNameValidator = [
    validate({
        validator: 'isLength',
        arguments: [2, 40],
        message: 'O nome do consultor deve conter de 2 a 40 caracteres.'
    })
];

var othersValidator = [
    validate({
        validator: 'isLength',
        arguments: [2, 500],
        message: 'O campo outros deve ter de 2 a 500 caracteres.'
    })
];

var observationValidator = [
    validate({
        validator: 'isLength',
        arguments: [2, 500],
        message: 'O campo observação deve ter de 2 a 500 caracteres.'
    })
];

var billedOrInvoicedValidator = [
    validate({
        validator: 'matches',
        arguments: ['^(FATURADO|faturado|nf|NF)$', 'i'],
        message: 'O valor deve ser [FATURADO] ou [NF].'
    })
];

//=============================================================================
// ORDERS SCHEMA
//=============================================================================
var Orders = new mongoose.Schema({
    domainName: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
        validate: domainNameValidator
    },
    orderDate: {
        type: String,
        required: true,
        validate: [isValidDate, 'Data do pedido deve ser anterior ou igual a data atual. O formato deve ser (ddmmaaaa).']
    },
    customerName: {
        type: String,
        uppercase: true,
        trim: true,
        validate: customerNameValidator
    },
    consultantName: {
        type: String,
        uppercase: true,
        trim: true,
        validate: consultantNameValidator
    },
    billedOrInvoiced: {
        type: String,
        uppercase: true,
        trim: true,
        validate: billedOrInvoicedValidator
    },
    freightPrice: {
        type: String,
        validate: [isMonetaryValue, 'O valor total do frete é inválido.']
    },
    insurancePrice: {
        type: String,
        validate: [isMonetaryValue, 'O valor total do seguro é inválido.']
    },
    retentionValue: {
        type: String,
        validate: [isMonetaryValue, 'O valor total de retenção é inválido.']
    },
    others: {
        type: String,
        trim: true,
        validate: othersValidator
    },
    observation: {
        type: String,
        trim: true,
        validate: observationValidator
    },
    items: [{
        productId: {
            type: String,
            required: true,
            validate: [isValidId, 'O id do produto é inválido.']
        },
        quantity: {
            type: String,
            required: true,
            validate: quantityValidator
        },
        unitPrice: {
            type: String,
            required: true,
            validate: [isMonetaryValue, 'O valor unitário do item é inválido.']
        },
        totalPrice: {
            type: String,
            required: true,
            validate: [isMonetaryValue, 'O valor total do item é inválido.']
        },
        itemDiscount: {
            type: String,
            validate: [isMonetaryValue, 'O valor do desconto do item é inválido.']
        },
        unitDescription: {
            type: String,
            validate: unitDescriptionValidator
        }
    }],
    payments: [{
        type: {
            type: String,
            required: true,
            validate: paymentTypeValidator
        },
        installments: {
            type: String,
            required: true,
            validate: paymentInstallmentsValidator
        },
        totalAmount: {
            type: String,
            required: true,
            validate: [isMonetaryValue, 'O valor do pagamento é inválido.']
        }
    }],
    orderDiscount: {
        type: String,
        validate: [isMonetaryValue, 'O valor total do desconto do pedido é inválido.']
    },
    orderTotal: {
        type: String,
        required: true,
        validate: [isMonetaryValue, 'O valor total do pedido é inválido.']
    },
    customerId: {
        type: String,
        validate: [isValidId, 'O id do cliente é inválido.']
    },
    invoiceId: {
        type: String,
        validate: [isValidId, 'O id do nota fiscal é inválido.']
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

function isMonetaryValue(value) {
    if (value && value.match(/^[0-9]{1,15}(\.[0-9]{2})?$/)) {
        return true;
    }
    return false;
}

function isValidId(value) {
    if (value && value.match(/^[0-9a-fA-F]{24}$/)) {
        return true;
    }
    return false;
}

function isValidDate(value) {
    if (value && value.length == 8) {
        if (value.match(/^(0[1-9]|[1,2][0-9]|3[0,1])(0[1-9]|1[0,1,2])\d{4}$/)) {
            var informedDate = new Date(value.substring(4, 8), value.substring(2, 4) - 1, value.substring(0, 2));
            var currentDate = new Date();
            if (informedDate <= currentDate) {
                return true;
            }
        }
    }
    return false;
}

var OrdersModel = mongoose.model('Orders', Orders);

//=============================================================================
// ORDERS MIDDLEWARES
//=============================================================================
//Define change date time when schema is saved
Orders.pre('save', function(next) {
    this.createDateTime = new Date().getTime();
    this.changeDateTime = new Date().getTime();
    next();
});

Orders.pre('save', function(next) {
    next();
});

module.exports = OrdersModel;