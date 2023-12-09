"use strict";
// regular expressions, fundamental parts of validation
Object.defineProperty(exports, "__esModule", { value: true });
exports.phoneRegex = exports.locationRegex = exports.birthdayRegex = exports.passwordRegex = exports.emailRegex = exports.nameRegex = void 0;
exports.nameRegex = /^[a-zA-Z0-9_]{4,16}$/;
exports.emailRegex = /^("(?:[!#-\[\]-\u{10FFFF}]|\\[\t -\u{10FFFF}])*"|[!#-'*+\-/-9=?A-Z\^-\u{10FFFF}](?:\.?[!#-'*+\-/-9=?A-Z\^-\u{10FFFF}])*)@([!#-'*+\-/-9=?A-Z\^-\u{10FFFF}](?:\.?[!#-'*+\-/-9=?A-Z\^-\u{10FFFF}])*|\[[!-Z\^-\u{10FFFF}]*\])$/u;
exports.passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
exports.birthdayRegex = /^\d{4}-\d{2}-\d{2}$/;
exports.locationRegex = /^[\p{L}\d\s\.,\-']+$/u;
exports.phoneRegex = /^(\+380|0)\d{9}$/;
