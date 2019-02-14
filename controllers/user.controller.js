const pool = require('../db');
var path = require('path');
const date = require('date-and-time');
const appUsers = require('../constructors/users');
var User = require('../models/user');
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

module.exports.admin = function (request, response, next) {
    console.log("user admin...");
    const id = request.params.certId;
    User.findAll().then(function(users) {
        console.log(users)
        response.render('list_Users', {
          title: 'Users',
          users: users
        });
      });
    //response
    //            .render('test', { title: ': Admin'});
};

module.exports.listall = function (request, response, next) {
    console.log("device list all body response");
    console.log(response.body);
        function countrec() {
            console.log("in select db func");
            return new Promise(function (resolve, reject) {
                pool.query('SELECT count(*) as rowcount \
            FROM users', (err, res) => {
                        kev = 2;
                        if (err) return next(err);
                        console.log(res.rows);
                        console.log('render test after promise');
                    
                    return rowcount;
    
                        // resolve(res.rows[0].rowid);
                    }
                )
            })
        };
    
        function readdb() {
            console.log("in select db func "+username);
            var namefilter = "";
            var emailfilter = "";
            if (request.body.nameFilter) {
                namefilter = request.body.nameFilter;
            }
            if (request.body.emailFilter) {
                emailfilter = request.body.emailFilter;
            }
            // console.log("request query set to : "+request.query);
    
            // console.log("first query vars : "+devicefilter+" : "+request.query.devicefilter);
    
            squery = 'SELECT * from users \
            where UPPER(name) like \'%'+namefilter+'%\' \
            and UPPER(email) like \'%'+emailfilter+'%\'';
    
            console.log("squery : "+squery);
            return new Promise(function (resolve, reject) {
                pool.query(squery, (err, res) => {
                        kev = 2;
                        if (err) return next(err);
                        console.log(res.rows);
                        // console.log("second request query set to : "+request.query.devicefilter);
                        if (request.query && request.query.offset) {
                            offset = parseInt(request.query.offset, 10);
                        }
    
                        if (request.query && request.query.count) {
                            count = parseInt(request.query.count, 10);
                        }
    
                        console.log("res rows : "+res.rows);
                        // res.rows[0].rowcount = "test";
                        page_cnt=Math.ceil(res.rows.length/count);
                        console.log('render test after promise '+res.rows.length);
                        recordDetails = {totalRecords: res.rows.length,recPerPage: count,pageCount: Math.ceil(res.rows.length/count),currentPage: offset,pagerStart: pagerStart};
                        console.log(recordDetails);
                        response
                            .render('list_users', { data: res.rows.slice(offset,offset+count), recordDetails: recordDetails, title: 'Cert Database' ,uname: username, accessLvl: accessLvl,namefilter: namefilter,emailfilter: emailfilter});
    
                        // resolve(res.rows[0].rowid);
                    }
                )
            })
        };
        console.log("*********** request : "+request.body.deviceFilter);
        console.log("call db func");
        kev = "";
        rowcount=countrec();
        // console.log("row count"+rowcount);
        readdb().then((rowid) => {
            console.log(rowid)//Value here is defined as u expect.
        });
        console.log("after db func");
    };

module.exports.add = function (request, response, next) {
    console.log("user add...");
    const id = request.params.certId;
    kev = (path.join(__dirname, '/public'));
    //console.log("kev dir "+response.public);
    path.resolve(__dirname, '.../public');
    // response.sendFile('/public/pages/adduser.html', {root: appRoot});
    response
        .render('addUser', { data: response.rows, title: 'Add user',accessLvl: accessLvl });
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