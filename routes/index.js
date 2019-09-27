var express = require('express'),
  router = express.Router(),
  moment = require('moment');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.locals.navbarActive_1 = true;
  res.render('index', {
    title: '首页',
    error: req.flash('error'),
    success: req.flash('success'),
    navbarActive_1: true,
    data:moment().format('YYYY-MM-DD HH:mm:ss')
  });
});

module.exports = router;