var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var identity2path = new Map();
identity2path.set(1, '/point-user');
identity2path.set(2, '/point-provider');
identity2path.set(3, '/merchant');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (!req.user) {
    res.render('index', { title: 'Points' });
  }
  else {
    res.redirect(identity2path.get(Number(req.user.identity)));
  }
});

router.get('/point-user', ensureAuthenticated, function(req, res, next) {
  if (Number(req.user.identity) !== 1) {
    res.redirect('/');
  }
  else {
    res.render('point-user', {title: 'Point User'})
  }
});

router.get('/point-provider', ensureAuthenticated, function(req, res, next) {
  if (Number(req.user.identity) !== 2) {
    res.redirect('/');
  }
  else {
    res.render('point-provider', {title: 'Point Provider'})
  }
});

router.get('/merchant', ensureAuthenticated, async function(req, res, next) {
  if (Number(req.user.identity) !== 3) {
    res.redirect('/');
  }
  else {
    let products = await Product.find({owner: req.user.account});
    res.render('merchant', {title: 'Merchant', products: products});
  }
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  else {
    res.redirect('/');
  }
}

module.exports = router;
