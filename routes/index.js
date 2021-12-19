var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.sendFile(process.cwd() + '/test/index.html')

});

// router.get('/verify', function(req, res, next) {
//   console.log("req params=========",req.params)
//   console.log("req params=========",req.body)
//   res.sendFile(process.cwd() + '/views/verify_email.ejs')

// });


module.exports = router;
