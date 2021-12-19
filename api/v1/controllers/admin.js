const adminValidator = require('../validators/adminValidator');
const adminHelper = require('../helpers/adminHelper');
const responseHandler = require('../../utils/responseHelper');

/**
 * This Admin class contains login related APIs
 */
class Admin {
/**
     * API for login with email
     * @param {string} email
     * @param {string} password
     * @returns success response(status code 200) with auth_token
     * @date 2021-12-19
     */
    async login(req, res) {
        try {
            await adminValidator.validateLoginRequest(req.body);
            let data = await adminHelper.adminExists(req.body);
            if (data.length > 0) {
                if(data[0].is_verified==0){
                    throw {message:'USER_NOT_VERIFIED'}
                }else{
                    let validatePassword = await adminValidator.validatePassword(data[0].hash, req.body.password);
                    if (!validatePassword) {
                        responseHandler.sendErrorresponse(res, req.headers.language, 'INCORRECT_PASSWORD');
                    } else {
                        delete data[0].password;
                        let token = await adminHelper.getJwtToken(data[0].email,data[0]._id)
                        responseHandler.sendSuccessresponse(res, req.headers.language, 'LOGIN_SUCCESS', { admin_data: data, auth_token: token });
                    }
                }
            } else {
                responseHandler.sendErrorresponse(res, req.headers.language, 'USER_NOT_EXIST');
            }
        }
        catch (error) {
            responseHandler.sendErrorresponse(res, req.headers.language, error.message);
        }
    }
}
module.exports = new Admin();