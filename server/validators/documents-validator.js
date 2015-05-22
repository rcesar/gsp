//=============================================================================
// DOCUMENTS VALIDATORS
//=============================================================================
'use strict';
var DocumentsValidator = {};

DocumentsValidator.isValidCPF = function(strCPF) {

    var soma = 0;
    var resto;

    if (!strCPF) {
        return false;
    }

    strCPF = strCPF.replace(/[^\d]+/g, '');

    if (strCPF == '' ||
        strCPF.length !== 11 ||
        strCPF == "00000000000" ||
        strCPF == "11111111111" ||
        strCPF == "22222222222" ||
        strCPF == "33333333333" ||
        strCPF == "44444444444" ||
        strCPF == "55555555555" ||
        strCPF == "66666666666" ||
        strCPF == "77777777777" ||
        strCPF == "88888888888" ||
        strCPF == "99999999999") {
        return false;
    }

    for (var i = 1; i <= 9; i++) {
        soma = soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if ((resto == 10) || (resto == 11)) {
        resto = 0;
    }
    if (resto != parseInt(strCPF.substring(9, 10))) {
        return false;
    }
    soma = 0;
    for (var i = 1; i <= 10; i++) {
        soma = soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if ((resto == 10) || (resto == 11)) {
        resto = 0;
    }
    if (resto != parseInt(strCPF.substring(10, 11))) {
        return false;
    }
    return true;
};

DocumentsValidator.isValidCNPJ = function(cnpj) {

    if (!cnpj) {
        return false;
    }

    cnpj = cnpj.replace(/[^\d]+/g, '');

    if (cnpj == '' ||
        cnpj.length !== 14 ||
        cnpj == "00000000000000" ||
        cnpj == "11111111111111" ||
        cnpj == "22222222222222" ||
        cnpj == "33333333333333" ||
        cnpj == "44444444444444" ||
        cnpj == "55555555555555" ||
        cnpj == "66666666666666" ||
        cnpj == "77777777777777" ||
        cnpj == "88888888888888" ||
        cnpj == "99999999999999") {
        return false;
    }

    var tamanho = cnpj.length - 2
    var numeros = cnpj.substring(0, tamanho);
    var digitos = cnpj.substring(tamanho);
    var soma = 0;
    var pos = tamanho - 7;
    for (var i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0)) {
        return false;
    }
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (var i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1)) {
        return false;
    }
    return true;
}

exports = module.exports = DocumentsValidator;