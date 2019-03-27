var express = require('express');
var router = express.Router();
console.log("index router js");
/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(__dirname + 'public/pages/login.html');
});

router.use(function(req, res) {
  res.send('404: Page not Found!', 404);
});

module.exports = router;