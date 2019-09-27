var createError = require('http-errors'),
  express = require('express'),
  path = require('path'),
  fs = require('fs'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  flash = require('connect-flash'),
  logger = require('morgan'),
  db = require('./database/db');
  verify = require('./model/verify');

var MongoStore = require('connect-mongo')(session);

var indexRouter = require('./routes/index'),
  userRouter = require('./routes/user'),
  userModifyInfoRouter = require('./routes/user/user-modify-info'),
  postRouter = require('./routes/post'),
  regRouter = require('./routes/reg'),
  regFormRouter = require('./routes/reg-form'),
  loginRouter = require('./routes/login'),
  logoutRouter = require('./routes/logout');

var app = express();

// 禁用etag 不使用缓存 使用就304
app.disable('etag');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.set('view options', {
  layout: 'layouts/layout'
});

// 回话session
app.use(session({
  secret: db.secret,
  // name: 'userid', //返回客户端key的名称，默认为connect_sid
  cookie: {
    maxAge: 1000 * 10 * 60 * 1
    // maxAge: 1000*60*60*24*7
  },
  rolling: true, // 在每次请求时进行设置cookie，将重置cookie过期时间
  store: new MongoStore({
    url: db.url
  }),
  resave: false, // 是否强制保存session
  saveUninitialized: true, // 强制将为初始化的session保存
}));

// 重定向跳转时传递消息
app.use(flash());
app.use(cookieParser());

// 检查用户是否有效
app.use(function (req, res, next) {
  verify.getUser(req.session.user, function (err, result) {
    req.session.user = result;
    res.locals.userinfo = {
      user: result,
      islogin: !err && result ? true : false,
      notlogin: err || result === null ? true : false,
    }

    // console.log('res.locals.userinfo',res.locals.userinfo)
    next();
  })
  
});

var accessLogStream = fs.createWriteStream(__dirname+'/access.log',{flags:'a'});//创建一个写入流
app.use(logger('combined',{stream:accessLogStream}));//将日志写入文件

// app.use(logger('dev')); // 在开发模式控制台打印日志

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/modifyinfo', userModifyInfoRouter);
app.use('/post', postRouter);
app.use('/reg', regRouter);
app.use('/regform', regFormRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;