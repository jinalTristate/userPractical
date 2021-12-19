const responseHelper = require('../../utils/responseHelper')
const jwt = require('jsonwebtoken')
require('dotenv').config()

/**
 * This HeaderValidator class contains header verification related API's validation.
 */
class HeaderValidator {
  validateAdminHeaders(headers) {
    let error;
    if (!headers.language) {
      error = { param: 'language', type: 'required' }
    }
    if (!headers.auth_token) {
      error = { param: 'auth_token', type: 'required' }
    }
    return error
  }
  nonAuthValidation(req, res, next) {
    let static_token = process.env.JWTSTATICTOKEN;
    let error = HV.validateAdminHeaders(req.headers);
    if (error) {
      console.log("first error", process.env.JWTSTATICTOKEN)
      responseHelper.sendErrorresponse(res, error, req.headers.language)
    }
    else if (req.headers.auth_token) {
      if (static_token != req.headers.auth_token) {
        console.log("req.headers.auth_token", req.headers.auth_token)
        responseHelper.sendErrorresponse(res, 'TOKEN_INVALID', req.headers.language)
      } else {
        console.log("next")
        next();
      }
    }
  }

  adminValidation(req, res, next) {

    let error = HV.validateAdminHeaders(req.headers)
    if (error) {
      console.log(error)
      responseHelper.sendErrorresponse(res, req.headers.language, error)
    } else {
      if (!req.headers.auth_token) {
        responseHelper.sendErrorresponse(res, req.headers.language, 'LOGIN_FIRST')
      } else if (req.skip) {
        next();
      } else {
        let token = req.headers.auth_token
        jwt.verify(token, process.env.JWTSECRET, async function (err, decoded) {
          if (err) {
            // console.log(err)
            responseHelper.sendErrorresponse(res, req.headers.language, 'TOKEN_EXPIRED')
          } else {
            //console.log("decoded in authvalidator", decoded)
            //  let Class = new HeaderValidator()
            if (decoded && decoded.email) {
              console.log("email", decoded.email)
              req.email = decoded.email
              next();
              // Class.isUserActive(req, res, next, decoded)
            } else if (decoded && decoded.device_token) {
              req.device_token = decoded.device_token
              next();
              //Class.isUserActive(req, res, next, decoded)
            } else {
              console.log('decode not found or undefined')
              responseHelper.sendErrorresponse(res, req.headers.language, 'TOKEN_MALFORMED')
            }
          }
        })
      }
    }
  }

}
const HV = new HeaderValidator()
module.exports = HV
