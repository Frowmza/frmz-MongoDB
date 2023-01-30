# MongoDB Wrapper

This is a Node.js library for wrapping the [MongoDB Driver](https://mongodb.github.io/node-mongodb-native/).

# Connecting to the Database
To connect to a MongoDB database, you need to add the following settings in .cfg
```cfg
set mongodbUrl "mongodb://localhost:27017" #localhost
set mongodbDatabase "fivem" #database
```

# Available Operations
The library provides the following basic database operations:

**isConnected**: Check if connected to database
```lua
   local isConnected = exports['frmz-mongodb']:isConnected()
   print(isConnected) -- boolean
```
**DatabaseConnected**: Triggered when database is connected
```lua
AddEventHandler('frmz-mongodb:DatabaseConnected', function()
end)
```

**insertOne**: Inserts a single document into the collection.
```lua
    --LUA
    -- Callback
    exports['frmz-mongodb']:insertOne('cars', {model='sultan', plate= 'myplate'}, function(err, result)
        print(err, result, 'insertOne')
    end)
    --[[ 
        err: boolean
        result: insertedId|error
    ]]
    
    -- Promise
    local result = exports['frmz-mongodb']:insertOne('cars', {model='sultan', plate= 'myplate'})
    print(result, 'insertOne')
    --[[ 
        result.error: boolean
        result: insertedId | result.reason: error
    ]]
```
**insertMany**: Inserts multiple documents into the collection.
```lua
    --LUA
    -- Callback
    exports['frmz-mongodb']:insertMany('cars', {{model='sultan', plate= 'myplate'}, {model='sultan2', plate= 'myplate2'}}, function(err, result)
        print(err, result, 'insertMany')
    end)
    --[[ 
        err: boolean
        result: array<insertedId>|error
    ]]
    
    -- Promise
    local result = exports['frmz-mongodb']:insertMany('cars', {{model='sultan', plate= 'myplate'}, {model='sultan2', plate= 'myplate2'}})
    print(result, 'insertMany')
    --[[ 
        result.error: boolean
        result: array<insertedId>  | result.reason:error
    ]]
```
**findOne**: Returns a single document that matches the query.
```lua
    --LUA
    -- Callback
    exports['frmz-mongodb']:findOne('cars', {model='sultan', plate= 'myplate'}, function(err, result)
        print(err, result, 'findOne')
    end)
    --[[ 
        err: boolean
        result: Object|error
    ]]
    
    -- Promise
    local result = exports['frmz-mongodb']:findOne('cars', {model='sultan', plate= 'myplate'})
    print(result, 'findOne')
    --[[ 
        result.error: boolean
        result: Object | result.reason:error
    ]]
```
**findMany**: Returns an array of documents that match the query.
```lua
    --LUA
    -- Callback
    exports['frmz-mongodb']:findMany('cars', {model='sultan', plate= 'myplate'}, function(err, result)
        print(err, result, 'findMany')
    end)
    --[[ 
        err: boolean
        result: Array|error
    ]]
    
    -- Promise
    local result = exports['frmz-mongodb']:findMany('cars', {model='sultan', plate= 'myplate'})
    print(result, 'findMany')
    --[[ 
        result.error: boolean
        result: Array | result.reason:error
    ]]
```
**updateOne**: Updates a single document in the collection.
```lua
    --LUA
    -- Callback
    exports['frmz-mongodb']:updateOne('cars', {model='sultan'}, {plate = 'newPlate'}, function(err, result)
        print(err, result, 'updateOne')
    end)
    --[[ 
        err: boolean
        result: Object | error
    ]]
    
    -- Promise
    local result = exports['frmz-mongodb']:updateOne('cars', {model='sultan'}, {plate = 'newPlate'})
    print(result, 'updateOne')
    --[[ 
        result.error: boolean
        result: Object | result.reason:error
    ]]
```
**updateMany**: Updates multiple documents in the collection.
```lua
    --LUA
    -- Callback
    exports['frmz-mongodb']:updateMany('cars', {model='sultan'}, {plate = 'newPlate'}, function(err, result)
        print(err, result, 'updateMany')
    end)
    --[[ 
        err: boolean
        result: Object | error
    ]]
    
    -- Promise
    local result = exports['frmz-mongodb']:updateMany('cars', {model='sultan'}, {plate = 'newPlate'})
    print(result, 'updateMany')
    --[[ 
        result.error: boolean
        result: Object | result.reason:error
    ]]
```
**deleteOne**: Deletes a single document from the collection.
```lua
    --LUA
    -- Callback
    exports['frmz-mongodb']:deleteOne('cars', {model='sultan', plate= 'newPlate'}, function(err, result)
        print(err, result, 'deleteOne')
    end)
    --[[ 
        err: boolean
        result: Object|error
    ]]
    
    -- Promise
    local result = exports['frmz-mongodb']:deleteOne('cars', {model='sultan', plate= 'newPlate'})
    print(result, 'deleteOne')
    --[[ 
        result.error: boolean
        result: Object | result.reason:error
    ]]
```
**deleteMany**: Deletes multiple documents from the collection.
```lua
    --LUA
    -- Callback
    exports['frmz-mongodb']:deleteMany('cars', {model='sultan', plate= 'newPlate'}, function(err, result)
        print(err, result, 'deleteMany')
    end)
    --[[ 
        err: boolean
        result: Object|error
    ]]
    
    -- Promise
    local result = exports['frmz-mongodb']:deleteMany('cars', {model='sultan', plate= 'newPlate'})
    print(result, 'deleteMany')
    --[[ 
        result.error: boolean
        result: Object | result.reason:error
    ]]
```
