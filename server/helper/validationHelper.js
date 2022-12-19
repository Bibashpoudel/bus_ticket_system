'use strict';
const Validator = require('validator');
const PhoneNumber = require('awesome-phonenumber');
// const isEmpty = require('./../validation/isEmpty');
const responseHelper = require('./responseHelper');
const httpStatus = require('http-status')

const isEmpty = value =>
  value === undefined ||
  value === null ||
  (typeof value === "object" && Object.keys(value).length === 0) ||
  (typeof value === "string" && value.trim().length === 0);


module.exports = {
    validation : (data1, validationArray) => {
    let errors = {};
    let value;
  
    for (let i = 0; i < validationArray.length; i++) {
      let field = validationArray[i].field;
      let validation = validationArray[i].validate;
      let data = data1;
  
      //if nested filed (eg: name.lastname = value)
      if (field && field.split('.').length > 1) {
        for (let k = 0; k < field.split('.').length; k++) {
          data = !isEmpty(data[field.split('.')[k]]) ? data[field.split('.')[k]] : '';
        }
        value = '' + data;
      } else {
        value = !isEmpty(data[field]) ? '' + data[field] : '';
      }
  
      for (let j = 0; j < validation.length; j++) {
        const val = validation[j];
  
        switch (val.condition) {
          case 'IsAfter':
            if (val.option) {
              if (!Validator.isAfter(value, val.option.date)) {
                errors[field] = val.msg;
              }
            }
            break;
          case 'IsAlphaNumeric':
            if (!Validator.isAlphanumeric(value)) {
              errors[field] = val.msg;
            }
            break;
          case 'IsBefore':
            if (val.option) {
              !Validator.isBefore(value, val.option.date) ? (errors[field] = val.msg) : null;
            }
            break;
          case 'IsBoolean':
            if (!Validator.isBoolean(value.toString())) {
              errors[field] = val.msg;
            }
            break;
          case 'IsDate':
            if (!Validator.isISO8601(value)) {
              errors[field] = val.msg;
            }
            break;
          case 'IsEmail':
            if (!Validator.isEmail(value)) {
              errors[field] = val.msg;
            }
            break;
          case 'IsEmpty':
            if (Validator.isEmpty(value)) {
              errors[field] = val.msg;
            }
            break;
          case 'IsEqual':
            if (val.option) {
              if (!Validator.equals(val.option.one, val.option.two)) {
                errors[field] = val.msg;
              }
            }
            break;
          case 'IsFloat':
            if (val.option) {
              if (!Validator.isFloat(value, val.option)) {
                errors[field] = val.msg;
              }
            } else {
              if (!Validator.isFloat(value)) {
                errors[field] = val.msg;
              }
            }
            break;
          case 'IsIn':
            if (val.option) {
              if (!Validator.isIn(value, val.option)) {
                errors[field] = val.msg;
              }
            }
            break;
          case 'IsInt':
            if (val.option) {
              if (!Validator.isInt(value, val.option)) {
                errors[field] = val.msg;
              }
            } else {
              if (!Validator.isInt(value)) {
                errors[field] = val.msg;
              }
            }
            break;
          case 'IsJSON':
            !Validator.isJSON(value) ? (errors[field] = val.msg) : null;
            break;
          case 'IsJWT':
            !Validator.isJWT(value) ? (errors[field] = val.msg) : null;
            break;
          case 'IsLength':
            if (val.option) {
              if (!Validator.isLength(value, val.option)) {
                errors[field] = val.msg;
              }
            }
            break;
          case 'IsMongoId':
            if (!Validator.isMongoId(value)) {
              errors[field] = val.msg;
            }
            break;
          case 'IsNumeric':
            !Validator.isNumeric(value) ? (errors[field] = val.msg) : null;
            break;
          case 'IsPhone':
            let pn = new PhoneNumber(value);
            if (pn.isValid()) {
              if (val.option) {
                if (val.option.isMobile) {
                  if (!pn.isMobile()) {
                    errors[field] = 'Enter mobile number';
                  } else {
                    data[field] = pn.getNumber('e164');
                  }
                } else {
                  if (!pn.isFixedLine()) {
                    errors[field] = 'Enter landline number';
                  } else {
                    data[field] = pn.getNumber('e164');
                  }
                }
              }
            } else {
              errors[field] = val.msg;
            }
            break;
          case 'IsPostalCode':
            if (val.option && val.option.region) {
              if (!Validator.isPostalCode(value, val.option.region)) {
                errors[field] = val.msg;
              }
            } else {
              if (!Validator.isPostalCode(value, 'any')) {
                errors[field] = val.msg;
              }
            }
            break;
          case 'IsUppercase':
            if (!Validator.isUppercase(value)) {
              errors[field] = val.msg;
            }
            break;
          case 'IsURL':
            if (val.option) {
              if (!Validator.isURL(value, val.option.protocols)) {
                errors[field] = val.msg;
              }
            } else {
              if (!Validator.isURL(value,)) {
                errors[field] = val.msg;
              }
            }
            break;
          case 'IsWhitelisted':
            if (val.chars) {
              if (!Validator.isWhitelisted(value, val.chars)) {
                errors[field] = val.msg;
              }
            }
            break;
  
          default:
            break;
        }
  
        if (errors[field]) {
          break;
        }
      }
    }
    return errors;
  },  


  sanitize : (req, sanitizeArray) => {
    for (let i = 0; i < sanitizeArray.length; i++) {
      let field = sanitizeArray[i].field;
      req.body[field] = !isEmpty(req.body[field]) ? req.body[field] + '' : '';
      const sanitization = sanitizeArray[i].sanitize;
      if (sanitization.blacklist) {
        req.body[field] = Validator.blacklist(req.body[field]);
      }
      if (sanitization.escape) {
        req.body[field] = Validator.escape(req.body[field]);
      }
      if (sanitization.ltrim) {
        req.body[field] = Validator.ltrim(req.body[field]);
      }
      if (sanitization.rtrim) {
        req.body[field] = Validator.rtrim(req.body[field]);
      }
      if (sanitization.toBoolean) {
        req.body[field] = Validator.toBoolean(req.body[field]);
      }
      if (sanitization.toDate) {
        req.body[field] = Validator.toDate(req.body[field]);
      }
      if (sanitization.toFloat) {
        req.body[field] = Validator.toFloat(req.body[field]);
      }
      if (sanitization.toInt) {
        req.body[field] = Validator.toInt(req.body[field]);
      }
      if (sanitization.trim) {
        req.body[field] = Validator.trim(req.body[field]);
      }
      if (sanitization.unescape) {
        req.body[field] = Validator.unescape(req.body[field]);
      }
      if (sanitization.whitelist) {
        req.body[field] = Validator.whitelist(req.body[field]);
      }
    }
    return true;
  },
}