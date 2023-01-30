import { UpdateResult, WithId, Document, MongoClient, MongoClientOptions, Db } from 'mongodb';
/* @ts-ignore */
const url: string = GetConvar("mongodb_url", "mongodb://localhost:27017");
/* @ts-ignore */
const dbName: string = GetConvar("mongodb_database", "fivem");

type UpdatedDocument = WithId<Document> & {
    _id: string;
}

class MongoDB {
    private client: MongoClient;
    private dbName: string;
    private connected: boolean;
    private db: Db;

    constructor(url: string, dbName: string) {
        this.dbName = dbName;
        this.client = new MongoClient(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        } as MongoClientOptions);
        this.connected = false;
        this.db = this.client.db(dbName);
    }

    async connect() {
        await this.client.connect();
    }

    async close() {
        await this.client.close();
    }

    isConnected() {
        return this.connected
    }

    async isDBexist(): Promise<boolean> {
        const admin = this.client.db().admin();
        const dbInfo = await admin.listDatabases();
        for (const db of dbInfo.databases) {
            if (db.name === this.dbName) {
                this.connected = true
                console.log(`\x1b[36m[MongoDB]\x1b[0m Connected to database "${this.dbName}".`);
                return true
            };
        }
        console.log(`\x1b[36m[MongoDB]\x1b[0m Failed connecting to database "${this.dbName}".`);
        return false;
    }

    async insertOne(collectionName: string, data: object) {
        const collection = this.db.collection(collectionName);
        return await collection.insertOne(data);
    }

    async insertMany(collectionName: string, data: object[]) {
        const collection = this.db.collection(collectionName);
        return await collection.insertMany(data);
    }

    async findOne(collectionName: string, query: object) {
        const collection = this.db.collection(collectionName);
        return await collection.findOne(query);
    }

    async findMany(collectionName: string, query: object) {
        const collection = this.db.collection(collectionName);
        return await collection.find(query).toArray();
    }

    async updateOne(collectionName: string, query: object, newData: object) {
        const collection = this.db.collection(collectionName);
        return await collection.updateOne(query, { $set: newData });
    }

    async updateMany(collectionName: string, query: object, newData: object) {
        const collection = this.db.collection(collectionName);
        return await collection.updateMany(query, { $set: newData });
    }

    async deleteOne(collectionName: string, query: object) {
        const collection = this.db.collection(collectionName);
        return await collection.deleteOne(query);
    }

    async deleteMany(collectionName: string, query: object) {
        const collection = this.db.collection(collectionName);
        return await collection.deleteMany(query);
    }
}

const mongo = new MongoDB(url, dbName);

(async () => {
    try {
        await mongo.connect();
        await mongo.isDBexist();
    } catch (error) {
        console.log(error);
    }
})();

//// exports

exports("isConnected", () => {
    return mongo.isConnected()
});

const handleCallbackAndError = (result: string | string[] | UpdatedDocument | Document | (UpdatedDocument | null)[] | UpdateResult | null, callback?: Function) =>
    callback ? mongo.isConnected() ? callback(false, result) : callback(true, 'Not connected to MongoDB') : mongo.isConnected() ? { error: false, result } : { error: true, reason: 'Not connected to MongoDB' };

const handleError = (error: unknown, callback?: Function) =>
    callback ? callback(true, error) : { error: true, result: error };

const formatResult = (result: WithId<Document> | null) =>
    result ? { ...result, _id: result._id.toString() } : null;

const insertOne = async (collection: string, query: Object, callback?: Function) => {
    try {
        const result = await mongo.insertOne(collection, query);
        return handleCallbackAndError(result.insertedId.toString(), callback);
    } catch (error) {
        return handleError(error, callback);
    }
};
exports("insertOne", insertOne);


const insertMany = async (collection: string, query: object[], callback?: Function) => {

    try {
        const result = await mongo.insertMany(collection, query);
        return handleCallbackAndError(Object.values(result.insertedIds).map(value => value.toString()), callback);
    } catch (error) {
        return handleError(error, callback);
    }
};
exports("insertMany", insertMany);

const findOne = async (collection: string, query: object, callback?: Function) => {

    try {
        const result = await mongo.findOne(collection, query);
        return handleCallbackAndError(formatResult(result), callback);
    } catch (error) {
        return handleError(error, callback);
    }
};
exports("findOne", findOne);

const findMany = async (collection: string, query: object, callback?: Function) => {

    try {
        const result = await mongo.findMany(collection, query);
        return handleCallbackAndError(Object.values(result).map(formatResult), callback);
    } catch (error) {
        return handleError(error, callback);
    }
};
exports("findMany", findMany);

const updateOne = async (collection: string, query: object, newData: object, callback?: Function) => {

    try {
        const result = await mongo.updateOne(collection, query, newData);
        return handleCallbackAndError(result, callback);
    } catch (error) {
        return handleError(error, callback);
    }
};
exports("updateOne", updateOne);



const updateMany = async (collection: string, query: object, newData: object, callback?: Function) => {
    try {

        const result = await mongo.updateMany(collection, query, newData);
        return handleCallbackAndError(result, callback);
    } catch (error) {
        return handleError(error, callback);
    }
};
exports("updateMany", updateMany);


const deleteOne = async (collection: string, query: object, callback?: Function) => {
    try {

        const result = await mongo.deleteOne(collection, query);
        return handleCallbackAndError(result, callback);
    } catch (error) {
        return handleError(error, callback);
    }
};
exports("deleteOne", deleteOne);

const deleteMany = async (collection: string, query: object, callback?: Function) => {
    try {

        const result = await mongo.deleteMany(collection, query);
        return handleCallbackAndError(result, callback);
    } catch (error) {
        return handleError(error, callback);
    }
};
exports("deleteMany", deleteMany);