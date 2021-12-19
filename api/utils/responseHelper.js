const msg = require('./msg.json')
class responseHelper {

    sendErrorresponse(res, lang, message) {
        var obj = {
            code: 0,
            status: 'Error',
            message: message ? this.getMessage(message, lang) : undefined
        }
        //console.log("Error message obj is ::: ", obj);
        var status = 200;
        if (message == 'UNAUTHENICATED_USER' || message == 'INACTIVE_USER') {
            obj.code = 407;
            status = 200;
        }
        if (message == 'SESSION_EXPIRE') {
            obj.code = 401;
            status = 401;
        }
        if (message == 'INVALID_AUTH_TOKEN') {
            obj.code = 401;
            status = 401;
        }

        if (message == 'INVALID_USER_AUTH_TOKEN') {
            obj.code = 401;
            status = 401;
        }
        if (message == 'INVALID_USER_AUTH_TOKEN') {
            obj.code = 401;
            status = 401;
        }
        if (message == 'LINK_EXPIRED') {
            obj.code = 207;
            status = 207;
        }
        res.status(status).send(obj);

    }

    sendSuccessresponse(res, lang, message, data) {
        var obj = {
            code: 1,
            status: 'Success',
            message: message ? this.getMessage(message, lang) : undefined
        }
        //  console.log("sendSuccessresponse data ::: " ,obj);        
        // //console.log("sendSuccessresponse data ::: " ,data);        
        if (data && Object.keys(data)) {
            if (data.list != undefined && data.list.length > 0) {
                obj.data = data;
            } else {
                delete data['message'];
                obj.data = data;
            }
        }
        var status = 200;
        if (message == 'INACTIVE_USER') {
            obj.code = 402;
            status = 402;
        }
        if (message == 'EXPIRED_USER') {
            obj.code = 403;
            status = 403;
            delete obj.data;
        }
        res.status(status).send(obj);

    }


    getMessage(message, language) {
        let lang = 'en'
        if (language) {
            lang = language
        }
        if (message.param && message.type) {
            if (message.type.includes('required')) {
                return msg[lang]['PARAM_REQUIRED'].replace('PARAM', message.param)
            } else {
                return msg[lang]['INVALID_PARAM'].replace('PARAM', message.param)
            }
        } else if (msg.toString().includes('ReferenceError:')) {
            return msg[lang]['INTERNAL_SERVER_ERROR']
        } else if (message.message == 'STRIPE_ERROR') {
            return message.error;
        } else {
            return msg[lang][message]
        }
    }
}

module.exports = new responseHelper();