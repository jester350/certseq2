var express = require("express");
var router = express.Router();

var ctrlProjects = require("../controllers/projects.controller.js");

console.log("projects route");

//router.get("/", function(req, res, next) {
//  res.render("list_certs", { title: "BPDTS Certs" });
//});

router.route("/").all(ctrlProjects.listall);

module.exports = router;