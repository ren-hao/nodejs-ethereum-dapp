var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: './uploads/product'});
var path = require('path');

var Product = require('../models/product');

router.get('/products', function(req, res, next) {
  res.send({"name" : 1, "price" : 5});
});

router.post('/products', upload.single('productimage'), async function(req, res, next) {
  var name = req.body.name;
  var price = req.body.price;
  
  console.log(req.body);
  
  req.checkBody('name', 'name is required.').notEmpty();
  req.checkBody('price', 'price is required.').notEmpty();

  if(req.file) {
    console.log('uploading');
    var productimage = req.file.path;
  } 
  else {
    console.log("No file uploaded ...");
    var productimage = path.join('uploads', 'product', 'no-product-image.png');
  }
  const errors = req.validationErrors();

  if (errors) {
    res.status(404);
    res.send("please check the form again.");
  }
  else {
    var newProduct = new Product({
      name: name,
      price: price,
      productimage: productimage,
      owner: req.user.account
    });
    Product.addProduct(newProduct, function(err, user){
      if (err) throw err;
      console.log(user);
    })
    req.flash('success', 'adding successfully.')
    res.redirect('/merchant');
  }
});

router.delete('/products', async function(req, res, next){
    var id = req.body.id;
    await Product.deleteOne({_id: id}, function(err, result) {
        if (err) {
            res.status(404);
            res.send("Product doesn't exist.");
        } else {
            res.send(result);
        }
    });
});

module.exports = router;
