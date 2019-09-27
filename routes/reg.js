var express = require('express'),
  router = express.Router(),
  md = require('../model/model');

var model = new md();
/* GET home page. */
router.get('/', function (req, res, next) {

  model.isUser(req.session.user, function (bool) {
    if (bool) {
      res.render('reg', {
        title: '用户注册',
        error: "请退出登录后操作！",
        navbarActive_5: true
      });

    } else {
      res.render('reg', {
        title: '用户注册',
        name: req.flash('name'),
        error: req.flash('error'),
        success: req.flash('success'),
        navbarActive_5: true
      });
    }
  })

});

// 注册表单处理
router.post('/', function (req, res, next) {

  var name = req.body.name,
  password = req.body.password;

  if (req.session.user) {
    return res.redirect('/reg');
  }

  req.flash('name', name);

  if (!model.notNull(name) || name.length < 1) {
    req.flash('error', '请输入用户名!')
    return res.redirect('/reg');
  }

  if (password !== req.body['password-repeat'] || password.length < 1) {
    req.flash('error', '两次输入密码不一致或未输入密码!');
    return res.redirect('/reg');
  }

  model.save({
    name: name,
    password: password
  }, function (err, result) {
    if (err) {
      req.flash('error', err)
      return res.redirect('/reg');
    } else {
      req.flash('success', '注册成功!');
      req.session.user = result;
      return res.redirect('/');
    }
  })
});


module.exports = router;