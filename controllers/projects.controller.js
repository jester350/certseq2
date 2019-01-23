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
    if (1 == 1) {
    console.log("user during get cert "+username);
    pool.query('SELECT id as projectid, name as projectname from projects', (err, res) => {
        if (err) return next(err);
        console.log(res.rows);
    projects=res.rows;
    })
    pool.query('SELECT id as deviceid, name as devicename from devices', (err, res) => {
        if (err) return next(err);
        console.log(res.rows);
    devices=res.rows;
    })
    pool.query('SELECT id as certTypeId, name as certTypeName from cert_types', (err, res) => {
        if (err) return next(err);
        console.log(res.rows);
    certtypes=res.rows;
    })

    squery = 'SELECT "project"."id", "project"."name", "project"."createdAt", "project"."updatedAt", "project"."userId", "devices"."id" AS "devicesId", "devices"."name" AS "devicesName", "devices"."createdAt" AS "devicesCreatedAt", "devices"."updatedAt" AS "devicesUpdatedAt", \
    "devices->project_device"."createdAt" AS "devicesProjectDeviceCreatedAt", "devices->project_device"."updatedAt" AS "devicesProjectDevicePpdatedAt", "devices->project_device"."projectId" AS "devicesProjectDeviceProjectId", "devices->project_device"."deviceId" AS "devicesProjectDeviceDeviceId", \
    "devices->certs"."id" AS "devicesCertsId", "devices->certs"."name" AS "devicesCertsName", "devices->certs"."start_date" AS "devicesCertsStartDate", "devices->certs"."expiry_date" AS "devicesCertsExpirydate", "devices->certs"."cert_file" AS "devicesCertsCertFile", "devices->certs"."revoked" AS "devicesCertsRevoked", "devices->certs"."revokedDate" AS "devicesCertsRevokedDate","devices->certs"."createdAt" AS "devicesCertsCreatedAt", "devices->certs"."updatedAt" AS "devicesCertsUpdatedAt", "devices->certs->device_cert"."createdAt" AS "devicesCertsDeviceCertCreatedAt", "devices->certs->device_cert"."updatedAt" AS "devicesCertsDeviceCertUpdatedAt", "devices->certs->device_cert"."certId" AS "devicesCertsDeviceCertCertId", "devices->certs->device_cert"."deviceId" AS "devicesCertsDeviceCertDeviceId","devices->certs"."changeRef" AS "devicesCertsDeviceCertChangeRef","devices->certs"."commonName" AS "devicesCertsDeviceCertCommonName","devices->certs"."leadTime" AS "devicesCertsDeviceCertLeadTime","devices->certs"."type" AS "devicesCertsDeviceCertType", \
    "user"."id" AS "userId", "user"."name" AS "certuserName", "user"."createdAt" AS "userCreatedAt", "user"."updatedAt" AS "userUpdatedAt", "user"."email" AS "certuserEmail", \
    "cert_types"."name" AS "certTypeId" \
    FROM "projects" AS "project" \
    LEFT OUTER JOIN ( "project_devices" AS "devices->project_device" \
    INNER JOIN "devices" AS "devices" ON "devices"."id" = "devices->project_device"."deviceId") ON "project"."id" = "devices->project_device"."projectId" \
    LEFT OUTER JOIN ( "device_certs" AS "devices->certs->device_cert" \
    INNER JOIN "certs" AS "devices->certs" ON "devices->certs"."id" = "devices->certs->device_cert"."certId") ON "devices"."id" = "devices->certs->device_cert"."deviceId" \
    LEFT OUTER JOIN "users" AS "user" ON "project"."userId" = "user"."id" \
	LEFT OUTER JOIN "cert_types" AS "cert_types" ON "devices->certs"."type" = "cert_types"."id"';
console.log(squery)
    pool.query(squery, [id], (err, res) => {
            // pool.query('SELECT * FROM cert where row_id = $1', [id], (err, res) => {
            if (err) return next(err);
            var certname = res.rows[0].devicesCertsName;
            var today = new Date();
            var projectname = res.rows[0].name;
            var devicename = res.rows[0].devicesName;
            var sdate = date.format(res.rows[0].devicesCertsStartDate, 'YYYY-MM-DD');
            var edate = date.format(res.rows[0].devicesCertsExpirydate, 'YYYY-MM-DD');
            var daysLeft = date.subtract(res.rows[0].devicesCertsExpirydate, today).toDays();
            var contact = res.rows[0].certuserName
            var certuserEmail = res.rows[0].certuserEmail
            var changeref = res.rows[0].devicesCertsDeviceCertChangeRef;
            var commonName = res.rows[0].devicesCertsDeviceCertCommonName;
            var leadTime = res.rows[0].devicesCertsDeviceCertLeadTime;
            var certtype = res.rows[0].certTypeId;
            var certRevoked = res.rows[0].devicesCertsRevoked; 
            revokedVis="hidden";
            if (res.rows[0].devicesCertsRevoked) {
                var certRevokedDate = date.format(res.rows[0].devicesCertsRevokedDate, 'YYYY-MM-DD');
                certRevoked = "checked"
                revokedVis = "visible"
            };
            // var sysname = res.rows[0].systemname;
            var certfile = res.rows[0].devicesCertsCertFile;
            console.log("project : "+projectname);
            console.log(res.rows)
            console.log("render one cert")
            response
                .render('getCert', { data: res.rows, certtype: certtype, projects: projects,revokedVis: revokedVis,devices: devices, title: 'Certificate: '+certname, changeref: changeref, commonName: commonName, leadTime: leadTime,certname: certname,certRevoked: certRevoked, certRevokedDate: certRevokedDate, contact: contact,certuserEmail: certuserEmail, sdate: sdate, edate: edate, projectname: projectname, devicename: devicename, dleft: daysLeft,certfile: certfile,certid: id,accessLvl: accessLvl });
        })
    } else {
        console.log("exit 2");
        response.redirect('/login');
    }

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