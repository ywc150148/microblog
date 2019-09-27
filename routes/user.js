var express = require('express'),
  router = express.Router(),
  verify = require('../model/verify'),
  md = require('../model/model'),
  Model = new md();

// 验证登录
router.get('/', verify.checkSession);

router.get('/', function (req, res, next) {

  Model.findOne (req.session.user.name,function (err, data) {
    if (err) {
      return res.render('user', {
        title: '用户信息',
        error: err,
      });
    }

    res.render('user', {
      title: '用户信息',
      error: err,
      data: data,
      navbarActive_3: true
    });
  });
  
});

module.exports = router;