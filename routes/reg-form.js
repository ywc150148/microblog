var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = global.database;

router.post('/', function (req, res, next) {
  if (req.body.username == '') {
    req.flash('error', '请输入用户名!')
    return res.redirect('/reg');
  } else if (req.body.password != req.body.password || req.body.password.length < 1) {
    req.flash('error', '两次输入密码不一致或未输入密码!')
    return res.redirect('/reg');
  } else {
    var username = req.body.username;
    //生成口令的散列值
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');

    var newUser = new User({
      name: username,
      password: password
    });

    User.findOne({
      name: username
    }, function (err, user) {
      if (user) {
        req.flash('error', '用户已经存在!')
        return res.redirect('/reg');
      } else {
        newUser.save(function (err, result) {
          if (result == null) {
            req.flash('error', '注册失败，请重试!')
            return res.redirect('/reg');
          } else {
            req.flash('success', '注册成功!');
            return res.redirect('/reg');
          }
        });

      }
    })
  }
});


module.exports = router;