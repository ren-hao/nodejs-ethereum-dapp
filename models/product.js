//using mongoose to connect mongodb
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/jhcheng_db');
var db = mongoose.connection;

//User Schema
var ProductSchema = mongoose.Schema({
    name: {
        type: String
    },
    price: {
        type: String
    },
    productimage: {
        type: String
    },
    owner: {
        type: String
    }
});

//export User schema
var Product = module.exports = mongoose.model('product', ProductSchema);

module.exports.getProductById = function(id, callback){
    Product.findById(id, callback);
}

module.exports.getProductByOwner = function(owner, callback){
    var query = {owner: owner};
    console.log(query);
    User.find(query, callback);
}

//export createUser function
module.exports.addProduct = function(newProduct, callback){
    newProduct.save();
};
