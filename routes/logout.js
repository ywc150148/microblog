var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  // req.session.user = null;
  res.render('logout', {
    title: '退出登录',
    navbarActive_2: true,
    error: req.flash('error')
  });
});

router.post('/', function (req, res, next) {
  // 删除session
  req.session.destroy(function (err) {
    if (err) {
      req.flash('error', '退出登录失败!')
      return res.redirect('/logout');
    } else {
      return res.redirect('/');
    }
  });
});

module.exports = router;