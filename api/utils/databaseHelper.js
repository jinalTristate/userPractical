const mongo = require('mongodb').MongoClient
var objectID = require('mongodb').ObjectID;
require('dotenv').config()
const promise = require('bluebird');
let _db

class databaseHelper {
    getMongoObjectId(id) {
        return new objectID(id)
    }

    connect() {
        return new promise((resolve, reject) => {
            console.log(process.env.DBURL);
            mongo.connect(process.env.DBURL).then((db) => {
                _db = db.db(process.env.DBNAME);
                console.log("DB connected");
                resolve(db);
            }).catch((error) => {
                console.log(error);
                reject({ code: 0, message: 'DB_ERROR' });
            })
        })
    }

    insertOne(table, data) {
        return new promise((resolve, reject) => {
            _db.collection(table).insertOne(data)
                .then((data) => {
                    resolve(data);
                }).catch((error) => {
                    console.log(error);
                    reject({ code: 0, message: 'DB_ERROR' });
                })
        })
    }

    find(table, where, projection) {
        console.log("table==============",table)
        console.log(`\n\nfind(${JSON.stringify(where)} , ${JSON.stringify(projection)})`);
        return new promise((resolve, reject) => {
            _db.collection(table).find(where, projection).toArray()
                .then((data) => {
                    // console.log("Find data ", data);
                    resolve(data);
                }).catch((error) => {
                    reject({ code: 0, message: 'DB_ERROR' });
                })
        })
    }

    findWithFilter(table, where, projection, sort, skip, limit) {
      console.log(`\n\nfind(${JSON.stringify(where)} , ${JSON.stringify(projection)})`);
        console.log("sort ::: ", sort);
           console.log("skip ::: ", skip);
           console.log("limit ::: ", limit);
           console.log("where",where)
        return new promise((resolve, reject) => {
            _db.collection(table).find(where, projection)
                .collation({ locale: "en" })
                .sort(sort)
                .skip(+skip)
                .limit(+limit)
                .toArray()
                .then((data) => {
                    resolve(data);
                    console.log("data::", sort, skip)
                }).catch((error) => {
                console.log("error==========",error);
                    reject({ code: 0, message: 'DB_ERROR' });
                })
        })
    }

    update(table, where, newData) {
        return new promise((resolve, reject) => {
            //console.log("where ::: ", where);
            //console.log("new Data ::: ", newData);
            _db.collection(table).findOneAndUpdate(where,
                {
                    $set: newData
                })
                .then((data) => {
                    // //console.log("Update success", data);
                    resolve(data);
                }).catch((error) => {
                    //     console.log(error);
                    reject({ code: 0, message: 'DB_ERROR' });
                })
        })
    }

    getTotalRecordsCount(table, where) {
        return new promise((resolve, reject) => {
           console.log("where getTotalRecordsCount ::: ", where);
            _db.collection(table).find(where).count()
                .then((data) => {
                    resolve(data);
                }).catch((error) => {
                    //console.log(error);
                    reject({ code: 0, message: 'DB_ERROR' });
                })
        })
    }

    findWithAggregate(table, aggregatation) {
        return new promise((resolve, reject) => {
            //    //console.log("-------------", table)
                console.log("-------------", aggregatation)
            _db.collection(table).aggregate(aggregatation).toArray()
                .then((result) => {
                    resolve(result)
                })
                .catch((error) => {
                    console.log("error", error)
                    reject({ code: 0, message: 'DB_ERROR' })
                })
        })
    }

    updateOne(table, where, data, options, code, errMsg) {
        return new promise((resolve, reject) => {
            _db.collection(table).findOneAndUpdate(where, { $set: data }, options)
                .then((result) => {
                    if (result.lastErrorObject.updatedExisting) {
                        resolve(result.value)
                    } else {
                        reject({ code: code || 0, message: errMsg || 'DATA_NOT_UPDATED' })
                    }
                })
                .catch((error) => {
                    //     //console.log(error);
                    reject({ code: 0, message: 'DB_ERROR' })
                })
        })
    }

}

module.exports = new databaseHelper();