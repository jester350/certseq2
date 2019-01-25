const pool = require('../db');
var path = require('path');
const date = require('date-and-time');
// const appUsers = require('../constructors/users');
// var User = require('../models/user');
fs = require('fs');

var offset = 0;
var count = 10;
var pagerStart=0;

module.exports.admin2 = function (request, response, next) {
    console.log("user admin...");
    const id = request.params.certId;
    kev = (path.join(__dirname, '/public'));
    console.log("kev dir "+response.public);
    path.resolve(__dirname, '.../public');
    response.sendFile('/public/pages/signup.html', {root: 'F:/node_proj/cert-main/certsprebluebird/'});
    //response
    //            .render('test', { title: ': Admin'});
};

module.exports.listall = function (request, response, next) {
    console.log("list projects");

    const id = request.params.certId;
    // if (request.session.user && request.cookies.user_sid) {
    console.log("user during get cert "+username);

    function runsql2 (sqlquery) {
        return new Promise((resolve, reject) => {
            pool.query(sqlquery, (err, res) => {
            if (err) {
              return reject (err)
            }
            resolve(res.rows)
          })
        })
      }


    console.log("call sync");

    Promise.all([
        runsql2('SELECT project.id as projectid,project.name as projectname ,"user"."name" as projectuser,"user"."email","user"."id" as userid from projects as project inner JOIN "users" AS "user" ON "project"."userId" = "user"."id"'),
        runsql2('SELECT id as userid,email as useremail from users')])
        .then(function(result) {
            console.log(result);
            if (request.query && request.query.offset) {
                offset = parseInt(request.query.offset, 10);
            }

            if (request.query && request.query.count) {
                count = parseInt(request.query.count, 10);
            }
            projectfilter = ""
            console.log("results")
            console.log(result[0]);
            // res.rows[0].rowcount = "test";
            page_cnt=Math.ceil(result[0].length/count);
            console.log('render test after promise '+result[0].length);
            recordDetails = {totalRecords: result[0].length,recPerPage: count,pageCount: Math.ceil(result[0].length/count),currentPage: offset,pagerStart: pagerStart};
            console.log(recordDetails);
            response
                .render('listProjects', { data: result[0].slice(offset,offset+count),userlist: result[1], title: 'List Projects' ,uname: username, accessLvl: accessLvl,projectfilter: projectfilter});

    });

      //.then((result) => response.render('addCert', { devices: result[0],userlist:result[1], title: 'Add Cert' }))




};

module.exports.add = function (request, response, next) {
    console.log("user add...");
    const id = request.params.certId;
    kev = (path.join(__dirname, '/public'));
    //console.log("kev dir "+response.public);
    path.resolve(__dirname, '.../public');
    // response.sendFile('/public/pages/adduser.html', {root: appRoot});
    response
        .render('addUser', { data: response.rows, title: 'Add user' });
    //response
    //            .render('test', { title: ': Admin'});
};

module.exports.postUser = function (request, response, next) {
    console.log("post user : "+request);
    const id = request.params.certId;
    User.create({ username: request.body.username,email: request.body.email,password: request.body.password,accessLvl: request.body.accessLvl }).then(function() {
        response.redirect('/');
      });
};