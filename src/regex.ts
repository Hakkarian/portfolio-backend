// regular expressions, fundamental parts of validation

// Name should consist of alphanumeric characters and underscores, with a length between 4 and 16 characters
export const nameRegex = /^[a-zA-Z0-9_]{4,16}$/;

// email can start with a double quote followed by any character except fr a newline or a double quote,
// and can start with any character except for certain special characters
// after the initial characters, the email address can contain can contain any character except for certain special characters, including periods
// the email address must contain an "@" symbol
// after it must be at least one character that is not a special character or a period
// the domain part of email can consist of any character except for certain special characters, including periods
// the domain part can alo be enclosed in square brackets if it is an IPv6 address
// case-sensitive and support Unicode characters
export const emailRegex =
  /^("(?:[!#-\[\]-\u{10FFFF}]|\\[\t -\u{10FFFF}])*"|[!#-'*+\-/-9=?A-Z\^-\u{10FFFF}](?:\.?[!#-'*+\-/-9=?A-Z\^-\u{10FFFF}])*)@([!#-'*+\-/-9=?A-Z\^-\u{10FFFF}](?:\.?[!#-'*+\-/-9=?A-Z\^-\u{10FFFF}])*|\[[!-Z\^-\u{10FFFF}]*\])$/u;

// password must contain at least one lowercase, uppercase and special character from between 8 and 16 characters long
export const passwordRegex =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;

// used to validate a birthday string in format YYYY-MM-DD
export const birthdayRegex = /^\d{4}-\d{2}-\d{2}$/;

// allows letters, digits, whitespace, hyphens and single quotes
export const locationRegex = /^[\p{L}\d\s\.,\-']+$/u;

// allows either country code (starting with "+" followed by 1 to 5 digits)
// or a leading "0" followed by a 10 - digit number
// starting with a digit between 7 and 9
export const phoneRegex = /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/;
