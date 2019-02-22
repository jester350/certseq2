var express = require("express");
var router = express.Router();

var ctrlUsers = require("../controllers/user.controller.js");

console.log("users route");

//router.get("/", function(req, res, next) {
//  res.render("list_certs", { title: "BPDTS Certs" });
//});

router.route("/").get(ctrlUsers.listall);
router.route("/adduser").get(ctrlUsers.add);
router.route("/postuser").post(ctrlUsers.postUser);

router.use(function(req, res) {
    res.send('404: Page not Found!', 404);
});

module.exports = router;