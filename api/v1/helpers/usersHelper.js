var db = require("../../utils/databaseHelper");
var promise = require("bluebird");
const common = require("../../utils/common");
require("dotenv").config();

/**
 * This UserHelper class contains user signup and profile management related API's logic and required database operations. This class' functions are called from users controller.
 */
class UserHelper {
  async userExists(body) {
    try {
      let where = {
        email: body.email,
      };
      if (body.verification_code) {
        where.verification_code = body.verification_code;
      }
      let user = await db.find("users", where, {});
      console.log("user", user);
      return user;
    } catch (error) {
      return promise.reject(error);
    }
  }
  insertUser(body, verification_code, password, file) {
    try {
      let user = {
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        phone_number: body.phone_number,
        profileImage: file.originalname,
        verification_code: verification_code,
        is_verified: 0,
        is_activated: 1,
        created_date: common.getCurrentTimeStamp(),
        modified_date: common.getCurrentTimeStamp(),
      };
      if (password) {
        user.salt = password.salt;
        user.hash = password.hash;
      }

      return db.insertOne("users", user);
    } catch (error) {
      return promise.reject(error);
    }
  }
  async verificationEmail(body) {
    try {
      let where = {
        email: body.email,
        verification_code: body.verification_code,
      };
      let update = {
        is_verified: 1,
        verification_code: "",
      };
      return db.updateOne("users", where, update, {}, 0, "");
    } catch (error) {
      return promise.reject(error);
    }
  }

  async getUserProfile(user_id) {
    try {
      var where = { is_verified: 1, _id: db.getMongoObjectId(user_id) };

      var projection = {
        _id: 1,
        first_name: 1,
        last_name: 1,
        email: 1,
        phone_number: 1,
        profileImage: 1,
        is_activated:1
      };

      let result = await db.find("users", where, projection);
      return result;
    } catch (error) {
      console.log("erro in helper", error);
      return promise.reject("SOMETHING_WENT_WRONG");
    }
  }

  async updateProfile(body,file, user_id) {
    try {
      let update = {
        first_name: body.first_name,
        last_name: body.last_name,
        phone_number: body.phone_number,
        is_verified: 1,
        is_activated:1,
        modified_date: common.getCurrentTimeStamp(),
      };
      if(file){
        update.profileImage=file.originalname
      }
      let where = {
        _id: db.getMongoObjectId(user_id),
      };
      return db.updateOne("users", where, update, {}, 0, "");
    } catch (error) {
      return promise.reject(error);
    }
  }
}
module.exports = new UserHelper();
