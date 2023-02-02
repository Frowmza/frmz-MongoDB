import { UpdateResult, WithId, Document, MongoClient, MongoClientOptions, Db } from 'mongodb'
/* @ts-ignore */
const url: string = GetConvar("mongodbUrl", "none")
/* @ts-ignore */
const dbName: string = GetConvar("mongodbDatabase", "none")
/* @ts-ignore */
RegisterNetEvent('frmz-mongodb:DatabaseConnected')

type UpdatedDocument = WithId<Document> & {
    _id: string
}
class MongoDB {
    client: MongoClient
    dbName: string
    connected: boolean
    db: Db

    constructor(url: string, dbName: string) {
        if (url == 'none' || dbName == 'none') throw new Error('Both `url` and `dbName` must be provided and cannot be "none".');
        this.dbName = dbName
        this.client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true } as MongoClientOptions)
        this.connected = false
        this.db = this.client.db(dbName)
    }

    async connect() {
        await this.client.connect()
    }

    async close() {
        await this.client.close()
    }

    isConnected() {
        return this.connected
    }

    async isDBexist() {
        const admin = this.client.db().admin()
        const dbInfo = await admin.listDatabases()
        const isDbExist = dbInfo.databases.some((db) => db.name === this.dbName)
        this.connected = isDbExist
        /* @ts-ignore */
        if (isDbExist) {emit("frmz-mongodb:DatabaseConnected"); console.log(`\x1b[36m[MongoDB]\x1b[0m Connected to database "${this.dbName}".`)}
        else console.log(`\x1b[36m[MongoDB]\x1b[31m[ERROR]\x1b[0m Failed connecting to database "${this.dbName}".`)
        return isDbExist
    }

    collection(name: string) {
        return this.db.collection(name)
    }

    async findOne(collection: string, query: object) {
        return await this.collection(collection).findOne(query)
    }

    async findMany(collection: string, query: object) {
        return await this.collection(collection).find(query).toArray()
    }

    async insertOne(collection: string, data: object) {
        return await this.collection(collection).insertOne(data)
    }

    async insertMany(collection: string, data: object[]) {
        return await this.collection(collection).insertMany(data)
    }

    async updateOne(collection: string, query: object, newData: object) {
        return await this.collection(collection).updateOne(query, { $set: newData })
    }

    async updateMany(collection: string, query: object, newData: object) {
        return await this.collection(collection).updateMany(query, { $set: newData })
    }

    async deleteOne(collection: string, query: object) {
        return await this.collection(collection).deleteOne(query)
    }

    async deleteMany(collection: string, query: object) {
        return await this.collection(collection).deleteMany(query)
    }
}

const mongo = new MongoDB(url, dbName);

(async () => {
    try {
        await mongo.connect()
        await mongo.isDBexist()
    } catch (error) {
        console.log(error)
    }
})()

const handleCallbackAndError = (result: string | string[] | UpdatedDocument | Document | (UpdatedDocument | null)[] | UpdateResult | null, callback?: Function) => {
  if (!mongo.isConnected()) return callback ? callback(true, 'Not connected to MongoDB') : { error: true, reason: 'Not connected to MongoDB' }
  return callback ? callback(false, result) : { error: false, result }
}

const handleError = (error: unknown, callback?: Function) =>
    callback ? callback(true, error) : { error: true, result: error }

const formatResult = (result: WithId<Document> | null) =>
    result ? { ...result, _id: result._id.toString() } : null

//// exports

exports("isConnected", () => {
    return mongo.isConnected()
})

const insertOne = async (collection: string, query: Object, callback?: Function) => {
    try {
        const result = await mongo.insertOne(collection, query)
        return handleCallbackAndError(result.insertedId.toString(), callback)
    } catch (error) {
        return handleError(error, callback)
    }
}
exports("insertOne", insertOne)


const insertMany = async (collection: string, query: object[], callback?: Function) => {
    try {
        const result = await mongo.insertMany(collection, query)
        return handleCallbackAndError(Object.values(result.insertedIds).map(value => value.toString()), callback)
    } catch (error) {
        return handleError(error, callback)
    }
}
exports("insertMany", insertMany)

const findOne = async (collection: string, query: object, callback?: Function) => {
    try {
        const result = await mongo.findOne(collection, query)
        return handleCallbackAndError(formatResult(result), callback)
    } catch (error) {
        return handleError(error, callback)
    }
}
exports("findOne", findOne)

const findMany = async (collection: string, query: object, callback?: Function) => {
    try {
        const result = await mongo.findMany(collection, query)
        return handleCallbackAndError(Object.values(result).map(formatResult), callback)
    } catch (error) {
        return handleError(error, callback)
    }
}
exports("findMany", findMany)

const updateOne = async (collection: string, query: object, newData: object, callback?: Function) => {
    try {
        const result = await mongo.updateOne(collection, query, newData)
        return handleCallbackAndError(result, callback)
    } catch (error) {
        return handleError(error, callback)
    }
}
exports("updateOne", updateOne)



const updateMany = async (collection: string, query: object, newData: object, callback?: Function) => {
    try {
        const result = await mongo.updateMany(collection, query, newData)
        return handleCallbackAndError(result, callback)
    } catch (error) {
        return handleError(error, callback)
    }
}
exports("updateMany", updateMany)


const deleteOne = async (collection: string, query: object, callback?: Function) => {
    try {
        const result = await mongo.deleteOne(collection, query)
        return handleCallbackAndError(result, callback)
    } catch (error) {
        return handleError(error, callback)
    }
}
exports("deleteOne", deleteOne)

const deleteMany = async (collection: string, query: object, callback?: Function) => {
    try {
        const result = await mongo.deleteMany(collection, query)
        return handleCallbackAndError(result, callback)
    } catch (error) {
        return handleError(error, callback)
    }
}
exports("deleteMany", deleteMany)
