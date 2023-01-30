CreateThread(function()
    Wait(1000)
    exports['frmz-mongodb']:insertOne('cars', {model='gza', plate= 'dffsdfsf'}, function(err, result)
        print(err, result, 'insertOne')
    end)

    exports['frmz-mongodb']:insertMany('cars', {{model='sultan', plate= 'dffsdfsf'}, {model='sultan2', plate= 'dffsdfsf'}}, function(err, result)
        print(err, json.encode(result), 'insertmany')
    end)

    exports['frmz-mongodb']:findOne('cars', {model='gza', plate= 'dffsdfsf'}, function(err, result)
        print(err, json.encode(result), 'findOne')
    end)

    exports['frmz-mongodb']:findMany('cars', {model='sultan'}, function(err, result)
        print(err, json.encode(result), 'findMany')
    end)

    exports['frmz-mongodb']:updateOne('cars', {model='sultan'}, {plate = '123456'}, function(err, result)
        print(err, json.encode(result), 'updateOne')
    end)

    exports['frmz-mongodb']:updateMany('cars', {model='sultan'}, {plate = '123456'}, function(err, result)
        print(err, json.encode(result), 'updateMany')
    end)

    exports['frmz-mongodb']:deleteOne('cars', {model='gza', plate= 'dffsdfsf'}, function(err, result)
        print(err, json.encode(result), 'deleteOne')
    end)

    exports['frmz-mongodb']:deleteMany('cars', {model='gza', plate= 'dffsdfsf'}, function(err, result)
        print(err, json.encode(result), 'deleteMany')
    end)

end)