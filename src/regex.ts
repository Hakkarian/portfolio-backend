export const nameRegex = /^[a-zA-Z0-9_]{4,16}$/
export const emailRegex = /^("(?:[!#-\[\]-\u{10FFFF}]|\\[\t -\u{10FFFF}])*"|[!#-'*+\-/-9=?A-Z\^-\u{10FFFF}](?:\.?[!#-'*+\-/-9=?A-Z\^-\u{10FFFF}])*)@([!#-'*+\-/-9=?A-Z\^-\u{10FFFF}](?:\.?[!#-'*+\-/-9=?A-Z\^-\u{10FFFF}])*|\[[!-Z\^-\u{10FFFF}]*\])$/u;
export const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
export const birthdayRegex = /^\d{4}-\d{2}-\d{2}$/;
export const locationRegex = /^[\p{L}\d\s\.,\-']+$/u;
export const phoneRegex = /^(\+380|0)\d{9}$/;
