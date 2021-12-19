const joi = require('joi')
const joiValidator = require('../../utils/joiValidator')
const promise = require('bluebird')



/**
 * This UserValidaor class contains user signup and profile related API's validation.
 */
class UserValidaor {
    async validateSignUpRequest(body) {
        let schema = joi.object().keys({
            first_name: joi.string().alphanum().min(3).max(25).trim(true).required(),
            last_name: joi.string().alphanum().min(3).max(25).trim(true).required(),
            phone_number: joi.string().length(10).required(),
            email: joi.string().email().required(),
            password: joi.string().min(4).required()
        });
        try {
            await joiValidator.validateJoiSchema(body, schema)
        } catch (error) {
            return promise.reject(error)
        }
    }
    async validateVerificationCodeCheck(body) {
        let schema = joi.object().keys({
            email: joi.string().email().required(),
            verification_code: joi.string().required()
        })
        try {
            await joiValidator.validateJoiSchema(body, schema)
        } catch (error) {
            return promise.reject(error)
        }
    }
    async validateUpdateProfileRequest(body) {
        let schema = joi.object().keys({
            first_name: joi.string().alphanum().min(3).max(25).trim(true).required(),
            last_name: joi.string().alphanum().min(3).max(25).trim(true).required(),
            phone_number: joi.string().length(10).required()
        });
        try {
            await joiValidator.validateJoiSchema(body, schema)
        } catch (error) {
            return promise.reject(error)
        }
    }
}

module.exports = new UserValidaor();