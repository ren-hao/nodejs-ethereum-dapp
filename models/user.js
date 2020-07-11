//using mongoose to connect mongodb
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
mongoose.connect('mongodb://localhost:27017/jhcheng_db');
var db = mongoose.connection;

//User Schema
var UserSchema = mongoose.Schema({
    identity: {
        type: String
    },
    account: {
        type: String,
        index: true
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    ethereumaccount: {
        type: String
    },
    profileimage: {
        type: String
    }
});

//export User schema
var User = module.exports = mongoose.model('user', UserSchema);

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

module.exports.getUserByAccount = function(account, callback){
    var query = {account: account};
    console.log(query);
    User.findOne(query, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
    // Load hash from your password DB.
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        callback(null, isMatch);
    });   
}

//export createUser function
module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(newUser.password, salt, function(err, hash){
            newUser.password = hash;
            newUser.save(callback); //mongoose function to insert to DB
        });
    });
};
