var express = require('express'),
  router = express.Router(),
  verify = require('../model/verify'),
  md = require('../model/model'),
  model = new md(),
  moment = require('moment')

router.get('/', verify.checkNotLogin);

router.get('/', function (req, res, next) {

  res.render('login', {
    title: '登录',
    error: req.flash('error'),
    name: req.flash('uname'),
    password: req.flash('password'),
    navbarActive_4: true,
  });
});

router.post('/', function (req, res, next) {

  var name = req.body.name,
    password = req.body.password;

  req.flash('name', name);
  req.flash('password', password);

  if (req.body.name == '') {
    req.flash('error', '请输入用户名!')
    return res.redirect('/login');
  }

  if (req.body.password == '') {
    req.flash('error', '请输入密码!');
    return res.redirect('/login');
  }

  model.getUser({
    name: name,
    password: model.createHash(password)
  }, function (err, result) {

    if (err) {
      req.flash('error', err);
      return res.redirect('/login');
    } else if (!result) {
      req.flash('error', "用户名或密码不正确！");
      return res.redirect('/login'); 
    }

    // 上一次登录和最近登录时间
    model.updateOne({
      _id: result._id
    }, {
      "$set": {
        lastLogin: result.latestlogin,
        latestlogin:moment().format('YYYY-MM-DD HH:mm:ss')
      }
    }, function (err, doc) {
      if(err){
        console.log("修改最近登录时间失败：",err);
      }
    })
    req.session.user = result;
    req.flash('success', "登陆成功！");
    res.redirect('/');
  })

});

module.exports = router;