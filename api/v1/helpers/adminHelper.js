var db = require("../../utils/databaseHelper");
var promise = require("bluebird");
const jwt = require("jsonwebtoken");
require('dotenv').config()

/**
 * This AdminHelper class contains login management related API's logic and required database operations. This class' functions are called from admin controller.
 */
class AdminHelper {
  async adminExists(body) {
    try {
      let where = {
        email: body.email
      };
      let admin = await db.find("users", where, {});
      return admin;
    } catch (error) {
      return promise.reject(error);
    }
  }
  async getJwtToken(email, user_id) {
    try {
      let sign;
      if (email) {
        sign = {
          email: email,
          user_id: user_id,
        };
        console.log("sign", sign);
      }
      let token = jwt.sign(sign, process.env.JWTSECRET);
      console.log("token", token);
      return token;
    } catch (error) {
      return promise.reject(error);
    }
  }

  async verifyToken(token) {
    var secret = process.env.JWTSECRET;
    try {
     let decode=   await jwt.verify(token,secret)
     if(!decode){
         throw { message: "UNAUTHENICATED_USER" };
     }else {
        console.log("decode", decode);
        let userStatusResult = await db.find(
          "users",
          { _id: db.getMongoObjectId(decode.user_id) },
          { is_deleted: 1 }
        );
        if (userStatusResult.length > 0) {
          if (userStatusResult[0].status == 0) {
            throw { message: "INACTIVE_USER" };
          } else {
            return decode;
          }
        } else {
          throw { message: "USER_NOT_FOUND" };
        }
      }
    } catch (error) {
      return promise.reject(error);
    }
  }
}

module.exports = new AdminHelper();
