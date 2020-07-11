var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: './uploads'});
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register', {title: 'Register'})
});

router.post('/register', upload.single('profileimage'), async function(req, res, next) {
  var identity = req.body.identity;
  var acc = req.body.account;
  var email = req.body.email;
  var pwd = req.body.password;
  var pwd2 = req.body.password2;
  var ethacc = req.body.ethereumaccount;
  console.log(req.body);
  req.checkBody('account', 'account is required.').notEmpty();
  let obj = await User.findOne({account: acc});
  console.log(obj);
  if (obj) {
    res.render('register', {
      errors: [{msg:"account is already used"}]
    });
    return;
  }

  req.checkBody('password', 'password is required.').notEmpty();
  req.checkBody('password2', 'password do not match.').equals(pwd);
  req.checkBody('email', 'email is not valid.').isEmail();
  req.checkBody('ethereumaccount', 'ethereum account is required.').notEmpty();

  if(req.file) {
    console.log('uploading');
    var profileimage = req.file.filename;
  } 
  else {
    console.log("No file uploaded ...");
    var profileimage = 'noimage.jpg';
  }
  const errors = req.validationErrors();

  if (errors) {
    res.render('register', {
      errors: errors,
    })
  }
  else {
    var newUser = new User({
      identity: identity,
      account: acc,
      email: email,
      password: pwd,
      ethereumaccount: ethacc,
      profileimage: profileimage
    });
    User.createUser(newUser, function(err, user){
      if (err) throw err;
      console.log(user);
    })
    req.flash('success', 'you are now registered and can login')
    console.log("current user:" + identity);
    switch (Number(identity)) {
      case (1):
        res.redirect('/point-user');
        break;
      case (2):
        res.redirect('/point-provider');
        break;
      case (3):
        res.redirect('/merchant');
        break;
      default:
        res.redirect('/');
    }
  }
});

// router.post('/login', function(req, res, next ){
//   passport.authenticate('local', function(err, users, info) {
//     if (err) { return next(err) }
//     if (!users) { return res.json( { message: info.message }) }
//     res.json(users);
//   })(req, res, next);   
// });

// POST request to login
router.post('/login', 
  passport.authenticate('local', {failureRedirect:'/', failureFlash: 'Invalid username or password'}),
  function(req, res) {
      req.flash('success', 'You are now logged in');
      switch (Number(req.user.identity)) {
        case (1):
          res.redirect('/point-user');
          break;
        case (2):
          res.redirect('/point-provider');
          break;
        case (3):
          res.redirect('/merchant');
          break;
      }
});

router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'you are now logout');
  res.redirect('/');
});

// Login without passport
// router.post('/login', function(req, res, next) {
//   var account = req.body.account;
//   var password = req.body.password;
//   User.getUserByAccount(account, function(err, users){
//     if(err) throw err;
//     if(!users){
//         return done(null, false, {message: 'Unknown User'});
//     }
//     //compare password
//     User.comparePassword(password, users.password, function(err, isMatch){
//         if(err) throw err;
//         if(isMatch){
//           res.redirect('/merchant');
//           // return done(null, user);
//         } else {
//           res.redirect('/');
//           // return done(null, false, {message: 'Invalid Password'});
//         }
//     });
//   });  
// })

module.exports = router;
