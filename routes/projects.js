var express = require("express");
var router = express.Router();

var ctrlProjects = require("../controllers/projects.controller.js");

console.log("projects route");

//router.get("/", function(req, res, next) {
//  res.render("list_certs", { title: "BPDTS Certs" });
//});

router.route("/").all(ctrlProjects.listall);
router.route("/postProject").all(ctrlProjects.postProject)

router.use(function(req, res) {
    res.send('404: Page not Found!', 404);
});

module.exports = router;