var express = require('express'),
  router = express.Router(),
  verify = require('../../model/verify'),
  md = require('../../model/model'),
  model = new md();

// 验证登录
router.get('/', verify.checkSession);

router.get('/', function (req, res, next) {
  model.findOne(req.session.user.name, function (err, data) {
    if (err) {
      return res.render('user/user-modify-info', {
        title: '修改资料',
        error: err,
      });
    }

    res.render('user/user-modify-info', {
      title: '修改资料',
      error: req.flash('error'),
      success: req.flash('success'),
      password: req.flash('password'),
      rp_pwd: req.flash('rp_pwd'),
      name: data.name,
      navbarActive_3: true
    });
  });

});

router.post('/', function (req, res, next) {

  if (!model.notNull(req.session.user)) {
    req.flash('error', '需要登录才可以访问。');
    return res.redirect('/');
  }

  // console.log(' req.body.name', req.body.name)

  var name = req.session.user.name,
    password = req.body.password,
    rp_pwd = req.body['password-repeat'];

  req.flash('name', name);
  req.flash('password', password);
  req.flash('rp_pwd', rp_pwd);

  if (!model.notNull(req.session.user.name)) {
    req.flash('error', '读取session.user.name失败!')
    return res.redirect('/modifyinfo');
  }

  if (!model.notNull(password) || !model.notNull(rp_pwd) || rp_pwd.length < 1) {
    req.flash('error', '原密码或新密码不能为空!');
    return res.redirect('/modifyinfo');
  }

  model.isUser({
    name: name,
    password: model.createHash(password)
  }, function (bool) {

    if (!bool) {
      req.flash('error', '用户身份验证失败!');
      return res.redirect('/modifyinfo');
    }

    model.updateOne({
      name: name
    }, {
      "$set": {
        password: model.createHash(rp_pwd)
      }
    }, function (err, doc) {

      if (err) {
        req.flash('error', '修改密码失败!');
        return res.redirect('/modifyinfo');
      }

      req.session.user.password = model.createHash(rp_pwd);
      req.flash('success', "修改密码成功！");
      return res.redirect('/modifyinfo');
    })

  })

});

module.exports = router;