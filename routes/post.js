var express = require('express'),
  router = express.Router(),
  verify = require('../model/verify'),
  postModel = require('../database/postModel');

// 验证登录
router.get('/', verify.checkSession);

/* GET home page. */
router.get('/', function (req, res, next) {

  postModel.find().sort({
    "date": -1
  }).limit(100).exec(function (err, data) {
    if (err) res.send(err);

    // console.log(data)
    res.render('post', {
      title: '发微博',
      error: req.flash('error'),
      success: req.flash('success'),
      navbarActive_6: true,
      data: data
    });

  })


});

router.post('/', function (req, res, next) {

  // 记录发送者_id，内容
  var newpost = new postModel({
    user_id: req.session.user._id,
    post: req.body.post
  });

  if (req.body.post== '') {
    req.flash('error', "内容不能为空");
    return res.redirect('/post');
  }

  newpost.save(function (err, doc) {
    if (err) {
      req.flash('error', err);
      return res.redirect('/post');
    }
    req.flash('success', "发送成功");
    return res.redirect('/post');
  })

});

module.exports = router;