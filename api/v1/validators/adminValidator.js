const joi = require('joi')
const joiValidator = require('../../utils/joiValidator')
var bcrypt = require('bcryptjs');
const promise = require('bluebird')


/**
 * This AdminValidator class contains admin login and auth token related API's validation.
 */
class AdminValidator {
    async validateLoginRequest(body) {
        let schema = joi.object().keys({
            email: joi.string().email().required(),
            password: joi.string().min(4).required()
        });
        try {
            await joiValidator.validateJoiSchema(body, schema)
        } catch (error) {
            return promise.reject(error)
        }
    }

    async validatePassword(db_password, body_password) {
        try {
            var result = bcrypt.compareSync(body_password, db_password);
            return result
        } catch (error) {
            return promise.reject(error)
        }
    }
}

module.exports = new AdminValidator();