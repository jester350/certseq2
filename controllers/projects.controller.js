const pool = require('../db');
var path = require('path');
const date = require('date-and-time');
// const appUsers = require('../constructors/users');
// var User = require('../models/user');
fs = require('fs');



module.exports.listall = function (request, response, next) {
    console.log("list projects");
    var offset = 0;
    var count = 10;
    var pagerStart=0;
    const id = request.params.certId;
    // if (request.session.user && request.cookies.user_sid) {
    console.log("user during get cert "+username);
    console.log(request.body)

    function runsql2 (sqlquery) {
        return new Promise((resolve, reject) => {
            pool.query(sqlquery, (err, res) => {
            if (err) {
              return reject (err)
            }
            resolve(res.rows)
          })
        })
      };

        var emailfilter = "";
        var projectfilter = "";
        if (request.body.emailfilter) {
            emailfilter = request.body.emailfilter.toUpperCase();
        };
        if (request.body.projectfilter) {
          projectfilter = request.body.projectfilter.toUpperCase();
          console.log("project filter"+projectfilter)
        };

        console.log("call sync");
        squery='SELECT project.id as projectid,UPPER(project.name) as projectname ,"user"."name" as projectuser,"user"."email","user"."id" as userid \
        from projects as project inner JOIN "users" AS "user" ON "project"."userId" = "user"."id" \
        where UPPER(project.name) like \'%'+projectfilter+'%\' \
        and UPPER("user"."email") like \'%'+emailfilter+'%\''
        console.log(squery)
        Promise.all([
            runsql2('SELECT project.id as projectid,UPPER(project.name) as projectname ,"user"."name" as projectuser,"user"."email","user"."id" as userid \
                from projects as project inner JOIN "users" AS "user" ON "project"."userId" = "user"."id" \
                where UPPER(project.name) like \'%'+projectfilter+'%\' \
                and UPPER("user"."email") like \'%'+emailfilter+'%\''),
            runsql2('SELECT id as userid,email as useremail from users'),
            runsql2('SELECT count(*) as rowcount FROM projects')])
        .then(function(result) {
            console.log(result);
            count = 10
            offset=0

            if (request.query && request.query.offset) {
                offset = parseInt(request.query.offset, 10);
            };

            if (request.query && request.query.count) {
                count = parseInt(request.query.count, 10);
            };
            // projectfilter = ""
            console.log(squery)
            console.log(result[0]);
            // res.rows[0].rowcount = "test";
            page_cnt=Math.ceil(result[0].length/count);
            console.log('render test after promise '+result[0].length);
            recordDetails = {totalRecords: result[0].length,recPerPage: count,pageCount: Math.ceil(result[0].length/count),currentPage: offset,pagerStart: pagerStart};
            console.log(recordDetails);
            response
                .render('listProjects', { data: result[0].slice(offset,offset+count),recordDetails: recordDetails,userlist: result[1], title: 'List Projects' ,uname: username, accessLvl: accessLvl,projectfilter: projectfilter,emailfilter: emailfilter});

        })
};


module.exports.postProject = function (request, response, next) {
    console.log("post project : "+request.body.newproject);
    projectname = request.body.newproject
    projectuser = request.body.newprojectuser
    console.log("###################################################")
    console.log(projectname)
    console.log(projectuser)
    console.log("###################################################")

    return new Promise(function (resolve, reject) {
        pool.query('INSERT INTO projects("name", "userId") VALUES($1, $2)',
            [projectname, projectuser],
            (err, res) => {
                if (err) return next(err);
                resolve(projectname);
                response.redirect('/projects');
            }
        )
    })

};