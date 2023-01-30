"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const url = GetConvar("mongodb_url", "mongodb://localhost:27017");
const dbName = GetConvar("mongodb_database", "fivem");
class MongoDB {
    constructor(url, dbName) {
        this.dbName = dbName;
        this.client = new mongodb_1.MongoClient(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        this.connected = false;
        this.db = this.client.db(dbName);
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.connect();
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.close();
        });
    }
    isConnected() {
        return this.connected;
    }
    isDBexist() {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = this.client.db().admin();
            const dbInfo = yield admin.listDatabases();
            for (const db of dbInfo.databases) {
                if (db.name === this.dbName) {
                    this.connected = true;
                    console.log(`\x1b[36m[MongoDB]\x1b[0m Connected to database "${this.dbName}".`);
                    return true;
                }
                ;
            }
            console.log(`\x1b[36m[MongoDB]\x1b[0m Failed connecting to database "${this.dbName}".`);
            return false;
        });
    }
    insertOne(collectionName, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = this.db.collection(collectionName);
            return yield collection.insertOne(data);
        });
    }
    insertMany(collectionName, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = this.db.collection(collectionName);
            return yield collection.insertMany(data);
        });
    }
    findOne(collectionName, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = this.db.collection(collectionName);
            return yield collection.findOne(query);
        });
    }
    findMany(collectionName, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = this.db.collection(collectionName);
            return yield collection.find(query).toArray();
        });
    }
    updateOne(collectionName, query, newData) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = this.db.collection(collectionName);
            return yield collection.updateOne(query, { $set: newData });
        });
    }
    updateMany(collectionName, query, newData) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = this.db.collection(collectionName);
            return yield collection.updateMany(query, { $set: newData });
        });
    }
    deleteOne(collectionName, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = this.db.collection(collectionName);
            return yield collection.deleteOne(query);
        });
    }
    deleteMany(collectionName, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = this.db.collection(collectionName);
            return yield collection.deleteMany(query);
        });
    }
}
const mongo = new MongoDB(url, dbName);
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongo.connect();
        yield mongo.isDBexist();
    }
    catch (error) {
        console.log(error);
    }
}))();
exports("isConnected", () => {
    return mongo.isConnected();
});
const handleCallbackAndError = (result, callback) => mongo.isConnected() ? callback ? callback(false, result) : { error: false, result } : callback ? callback(true, 'Not connected to MongoDB') : { error: true, 'Not connected to MongoDB':  };
const handleError = (error, callback) => callback ? callback(true, error) : { error: true, result: error };
const checkConnection = (callback) => !mongo.isConnected() && handleError('Not connected to MongoDB', callback);
const formatResult = (result) => result ? Object.assign(Object.assign({}, result), { _id: result._id.toString() }) : null;
const insertOne = (collection, query, callback) => __awaiter(void 0, void 0, void 0, function* () {
    checkConnection(callback);
    try {
        const result = yield mongo.insertOne(collection, query);
        return handleCallbackAndError(result.insertedId.toString(), callback);
    }
    catch (error) {
        return handleError(error, callback);
    }
});
exports("insertOne", insertOne);
const insertMany = (collection, query, callback) => __awaiter(void 0, void 0, void 0, function* () {
    checkConnection(callback);
    try {
        const result = yield mongo.insertMany(collection, query);
        return handleCallbackAndError(Object.values(result.insertedIds).map(value => value.toString()), callback);
    }
    catch (error) {
        return handleError(error, callback);
    }
});
exports("insertMany", insertMany);
const findOne = (collection, query, callback) => __awaiter(void 0, void 0, void 0, function* () {
    checkConnection(callback);
    try {
        const result = yield mongo.findOne(collection, query);
        return handleCallbackAndError(formatResult(result), callback);
    }
    catch (error) {
        return handleError(error, callback);
    }
});
exports("findOne", findOne);
const findMany = (collection, query, callback) => __awaiter(void 0, void 0, void 0, function* () {
    checkConnection(callback);
    try {
        const result = yield mongo.findMany(collection, query);
        return handleCallbackAndError(Object.values(result).map(formatResult), callback);
    }
    catch (error) {
        return handleError(error, callback);
    }
});
exports("findMany", findMany);
const updateOne = (collection, query, newData, callback) => __awaiter(void 0, void 0, void 0, function* () {
    checkConnection(callback);
    try {
        const result = yield mongo.updateOne(collection, query, newData);
        return handleCallbackAndError(result, callback);
    }
    catch (error) {
        return handleError(error, callback);
    }
});
exports("updateOne", updateOne);
const updateMany = (collection, query, newData, callback) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        checkConnection(callback);
        const result = yield mongo.updateMany(collection, query, newData);
        return handleCallbackAndError(result, callback);
    }
    catch (error) {
        return handleError(error, callback);
    }
});
exports("updateMany", updateMany);
const deleteOne = (collection, query, callback) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        checkConnection(callback);
        const result = yield mongo.deleteOne(collection, query);
        return handleCallbackAndError(result, callback);
    }
    catch (error) {
        return handleError(error, callback);
    }
});
exports("deleteOne", deleteOne);
const deleteMany = (collection, query, callback) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        checkConnection(callback);
        const result = yield mongo.deleteMany(collection, query);
        return handleCallbackAndError(result, callback);
    }
    catch (error) {
        return handleError(error, callback);
    }
});
exports("deleteMany", deleteMany);
