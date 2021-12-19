const responseHandler = require("../../utils/responseHelper");
const usersHelper = require("../helpers/usersHelper");
const usersValidator = require("../validators/usersValidator");
const adminHelper = require("../helpers/adminHelper");
const common = require("../../utils/common");
const uuidv1 = require("uuid/v1");

/**
 * This User class contains User account related APIs
 */
class User {

  /**
     * API for user sign up
     * @param {string} first_name
     * @param {string} last_name
     * @param {string} phone_number
     * @param {string} profile_image
     * @param {string} email
     * @param {string} password
     * @returns success response(status code 200) with response message
     * @date 2021-12-19
     */
  async signUpUser(req, res) {
    try {
      console.log("req.body", req.body);
      console.log("req.file", req.file);
      let hashResult,
        verification_code = uuidv1();
      await usersValidator.validateSignUpRequest(req.body);
      let user = await usersHelper.userExists(req.body);
      console.log("user", user);
      if (user.length > 0) {
        throw { message: "USER_ALREADY_EXISTS" };
      } else {
        if (req.body.password)
          hashResult = await common.generateHashAndSalt(req.body.password);
        await usersHelper.insertUser(
          req.body,
          verification_code,
          hashResult,
          req.file
        );
        let emailObj = `Thank you ${
          req.body.first_name
        } for registration. <br/> Please click on below link to verify your email. <br/> ${
          process.env.VERIFICATION_LINK +
          "?verification_code=" +
          verification_code +
          "&email=" +
          req.body.email
        }`;
        await common.sendEmail(req.body.email, emailObj);
        responseHandler.sendSuccessresponse(
          res,
          req.headers.language,
          "USER_SIGNUP_SUCCESS",
          {}
        );
      }
    } catch (error) {
      console.log("errr", error);
      responseHandler.sendErrorresponse(
        res,
        req.headers.language,
        error.message
      );
    }
  }

   /**
     * API for email verification after signup
     * @param {string} email
     * @param {string} verification_code
     * @returns success response(status code 200) with response message
     * @date 2021-12-19
     */
  async verifyEmail(req, res) {
    try {
      await usersValidator.validateVerificationCodeCheck(req.body);
      let user = await usersHelper.userExists(req.body);
      if (user.length > 0) {
        await usersHelper.verificationEmail(req.body);
      } else {
        throw { message: "LINK_EXPIRED" };
      }
      responseHandler.sendSuccessresponse(
        res,
        req.headers.language,
        "USER_VERIFY_SUCCESS",
        {}
      );
    } catch (error) {
      console.log("errr", error);
      responseHandler.sendErrorresponse(
        res,
        req.headers.language,
        error.message
      );
    }
  }

   /**
     * API for get user profile based on login auth_token
     * @returns success response(status code 200) with user profile data
     * @date 2021-12-19
     */
  async getUserProfile(req, res) {
    try {
      let adminData = await adminHelper.verifyToken(req.headers.auth_token);
      let result = await usersHelper.getUserProfile(adminData.user_id);
      responseHandler.sendSuccessresponse(
        res,
        req.headers.language,
        "SUCCESS",
        result
      );
    } catch (error) {
      console.log("errorrrrrrrr", error);
      responseHandler.sendErrorresponse(
        res,
        req.headers.language,
        error.message
      );
    }
  }

   /**
     * API for get user profile based on login auth_token
     * @param {string} first_name
     * @param {string} last_name
     * @param {string} phone_number
     * @param {string} profile_image
     * @returns success response(status code 200) with response message
     * @date 2021-12-19
     */
  async updateProfile(req, res) {
    try {
      let adminData = await adminHelper.verifyToken(req.headers.auth_token);
     await usersValidator.validateUpdateProfileRequest(req.body);
      await usersHelper.updateProfile(req.body,req.file,adminData.user_id);
      responseHandler.sendSuccessresponse(
        res,
        req.headers.language,
        "USER_DETAILS_UPDATED",
        {}
      );
    } catch (error) {
      console.log("erorr",error)
      responseHandler.sendErrorresponse(
        res,
        req.headers.language,
        error.message
      );
    }
  }
}
module.exports = new User();
