const pool = require('../db');

const date = require('date-and-time');

var offset = 0;
var count = 10;
var pagerStart=0;

module.exports.certsGetAll = function (request, response, next) {
console.log("body response");
console.log(response.body);
    function countrec() {
        console.log("in select db func");
        return new Promise(function (resolve, reject) {
            pool.query('SELECT count(*) as rowcount \
        FROM certs INNER JOIN device_certs ON certs.id = "device_certs"."certId" \
        inner join devices on devices.id = "device_certs"."deviceId"', (err, res) => {
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
        console.log(request)
        var certfilter = "";
        var projectfilter = "";
        var devicefilter = "";
        if (request.body.certFilter) {
            certfilter = request.body.certFilter;
            console.log("cert filter"+certfilter)
        }
        if (request.body.projectFilter) {
            projectfilter = request.body.projectFilter;
            console.log("project filter"+projectfilter)
        }
        if (request.body.deviceFilter) {
            devicefilter = request.body.deviceFilter;
            console.log("device filter"+devicefilter)
        }

        console.log("request query set to : "+request.query);
        console.log("first query vars : "+certfilter+" : "+request.query.certfilter);
        squery = 'SELECT cert.row_id as rowid, cert.name as certname,cert.start_date as certStartDate,cert.expiry_date as certExpiryDate,d.name as projectName,cert.cert_file as certFile,b.name as devicename \
        FROM cert \
        INNER JOIN cert_device_junc ON cert.row_id = cert_device_junc.cert \
        inner join devices b on b.row_id = cert_device_junc.device \
        inner join device_project_junc c on c.device = b.row_id \
        inner join projects d on d.row_id = c.project \
        ORDER BY certExpiryDate ASC';
        squery = 'SELECT "project"."id", "project"."name", "project"."createdAt", "project"."updatedAt", "project"."userId", "devices"."id" AS "devices.id", "devices"."name" AS "devices.name", "devices"."createdAt" AS "devices.createdAt", "devices"."updatedAt" AS "devices.updatedAt", \
        "devices->project_device"."createdAt" AS "devices.project_device.createdAt", "devices->project_device"."updatedAt" AS "devices.project_device.updatedAt", "devices->project_device"."projectId" AS "devices.project_device.projectId", "devices->project_device"."deviceId" AS "devices.project_device.deviceId", \
        "devices->certs"."id" AS "devices.certs.id", "devices->certs"."name" AS "devices.certs.name", "devices->certs"."start_date" AS "devices.certs.start_date", "devices->certs"."expiry_date" AS "devicesCertsExpirydate", "devices->certs"."cert_file" AS "devices.certs.cert_file", "devices->certs"."revoked" AS "devicesCertsRevoked", "devices->certs"."createdAt" AS "devices.certs.createdAt", "devices->certs"."updatedAt" AS "devices.certs.updatedAt", "devices->certs->device_cert"."createdAt" AS "devices.certs.device_cert.createdAt", "devices->certs->device_cert"."updatedAt" AS "devices.certs.device_cert.updatedAt", "devices->certs->device_cert"."certId" AS "devices.certs.device_cert.certId", "devices->certs->device_cert"."deviceId" AS "devices.certs.device_cert.deviceId", \
        "user"."id" AS "user.id", "user"."name" AS "user.name", "user"."createdAt" AS "user.createdAt", "user"."updatedAt" AS "user.updatedAt" \
        FROM "projects" AS "project" \
        LEFT OUTER JOIN ( "project_devices" AS "devices->project_device" \
        INNER JOIN "devices" AS "devices" ON "devices"."id" = "devices->project_device"."deviceId") ON "project"."id" = "devices->project_device"."projectId" \
        LEFT OUTER JOIN ( "device_certs" AS "devices->certs->device_cert" \
        INNER JOIN "certs" AS "devices->certs" ON "devices->certs"."id" = "devices->certs->device_cert"."certId") ON "devices"."id" = "devices->certs->device_cert"."deviceId" \
        LEFT OUTER JOIN "users" AS "user" ON "project"."userId" = "user"."id" \
        order by "devicesCertsExpirydate";'

        squery = 'SELECT "project"."id", "project"."name", "project"."createdAt", "project"."updatedAt", "project"."userId", "devices"."id" AS "devicesId", "devices"."name" AS "devicesName", "devices"."createdAt" AS "devicesCreatedAt", "devices"."updatedAt" AS "devicesUpdatedAt", \
        "devices->project_device"."createdAt" AS "devicesProjectDeviceCreatedAt", "devices->project_device"."updatedAt" AS "devicesProjectDevicePpdatedAt", "devices->project_device"."projectId" AS "devicesProjectDeviceProjectId", "devices->project_device"."deviceId" AS "devicesProjectDeviceDeviceId", \
        "devices->certs"."id" AS "devicesCertsId", "devices->certs"."name" AS "devicesCertsName", "devices->certs"."start_date" AS "devicesCertsStartDate", "devices->certs"."expiry_date" AS "devicesCertsExpirydate", "devices->certs"."cert_file" AS "devicesCertsCertFile", "devices->certs"."revoked" AS "devicesCertsRevoked", "devices->certs"."createdAt" AS "devicesCertsCreatedAt", "devices->certs"."updatedAt" AS "devicesCertsUpdatedAt", "devices->certs->device_cert"."createdAt" AS "devicesCertsDeviceCertCreatedAt", "devices->certs->device_cert"."updatedAt" AS "devicesCertsDeviceCertUpdatedAt", "devices->certs->device_cert"."certId" AS "devicesCertsDeviceCertCertId", "devices->certs->device_cert"."deviceId" AS "devicesCertsDeviceCertDeviceId","devices->certs"."changeRef" AS "devicesCertsDeviceCertChangeRef","devices->certs"."commonName" AS "devicesCertsDeviceCertCommonName","devices->certs"."leadTime" AS "CertLeadTime","devices->certs"."type" AS "devicesCertsDeviceCertType", \
        "user"."id" AS "userId", "user"."name" AS "certuserName", "user"."createdAt" AS "userCreatedAt", "user"."updatedAt" AS "userUpdatedAt" \
        FROM "projects" AS "project" \
        LEFT OUTER JOIN ( "project_devices" AS "devices->project_device" \
        INNER JOIN "devices" AS "devices" ON "devices"."id" = "devices->project_device"."deviceId") ON "project"."id" = "devices->project_device"."projectId" \
        LEFT OUTER JOIN ( "device_certs" AS "devices->certs->device_cert" \
        INNER JOIN "certs" AS "devices->certs" ON "devices->certs"."id" = "devices->certs->device_cert"."certId") ON "devices"."id" = "devices->certs->device_cert"."deviceId" \
        LEFT OUTER JOIN "users" AS "user" ON "project"."userId" = "user"."id" \
        WHERE "devices->certs"."name" != \'null\' \
        AND UPPER(project.name) like \'%'+projectfilter.toUpperCase()+'%\' \
        and UPPER("devices"."name") like \'%'+devicefilter.toUpperCase()+'%\' \
        and UPPER("devices->certs"."name") like \'%'+certfilter.toUpperCase()+'%\' \
        order by "devicesCertsExpirydate","devicesCertsName" ;'

        squery = 'select "certs"."id" as "CertID","certs"."name" as "cert name", "certs"."start_date" as "Cert Start Date","certs"."expiry_date" as "Cert Expirty Date","certs"."cert_file" as "File","certs"."revoked" as "Revoked","certs"."changeRef" as "Change Ref","certs"."start_date" as "Cert Start Date","certs"."commonName" as "Common Name","certs"."leadTime" as "Lead Time","certs"."type" as "Cert Type","certs"."revokedDate" as "Revoked Date", \
        "project"."name" as "project name", "project"."id" as "project id","devices"."name" as "Device name","user"."email" as "user email" \
        from "certs" \
        inner join "projects" as "project" on "project"."id" = "certs"."project" \
        LEFT OUTER JOIN "users" AS "user" ON "project"."userId" = "user"."id" \
         LEFT OUTER JOIN ( "project_devices" AS "devices->project_device" \
            INNER JOIN "devices" AS "devices" ON "devices"."id" = "devices->project_device"."deviceId") ON "project"."id" = "devices->project_device"."projectId" \
            order by "certs"."name"'

        console.log("squery : "+squery);
        return new Promise(function (resolve, reject) {
            pool.query(squery, (err, res) => {
                    kev = 2;
                    if (err) return next(err);
                    console.log(res.rows);
                    console.log("second request query set to : "+request.query.certfilter);
                    if (request.query && request.query.offset) {
                        offset = parseInt(request.query.offset, 10);
                    }
                    if (request.query && request.query.count) {
                        count = parseInt(request.query.count, 10);
                    }
                    var today = new Date();
                    for (var i in res.rows) {
                        console.log(res.rows[i])
                        console.log("device id : "+res.rows[i].devicesId)
                        if (res.rows[i].devicesId == null) {console.log("NULL!!!")};
                        if (res.rows[i].devicesId != null) {
                            var daysLeft = date.subtract(res.rows[i].devicesCertsExpirydate, today).toDays();
                            res.rows[i].daysleft = daysLeft;
                            var class_type = "alert alert-success";
                            if (daysLeft < 30) {
                                class_type = "alert alert-warning";
                            }
                            if (daysLeft < 7) {
                                class_type = "alert alert-danger";
                            }
                            res.rows[i].classtype=class_type;
                            sdate = date.format(res.rows[i].devicesCertsStartDate, 'DD-MM-YYYY');
                            console.log(sdate)
                            res.rows[i].devicesCertsStartDate = sdate;

                            edate = date.format(res.rows[i].devicesCertsExpirydate, 'DD-MM-YYYY');
                            res.rows[i].devicesCertsExpirydate = edate;
                        }
                    }
                    console.log("res rows : "+res.rows);
                    // res.rows[0].rowcount = "test";
                    page_cnt=Math.ceil(res.rows.length/count);
                    console.log('render test after promise '+res.rows.length);
                    recordDetails = {totalRecords: res.rows.length,recPerPage: count,pageCount: Math.ceil(res.rows.length/count),currentPage: offset,pagerStart: pagerStart};
                    console.log("record details")
                    console.log(recordDetails);
                    console.log(res.rows)
                    response
                        .render('list_certs', { data: res.rows.slice(offset,offset+count), recordDetails: recordDetails, title: 'Cert Database' ,uname: username, accessLvl: accessLvl,certfilter: certfilter,devicefilter: devicefilter, projectfilter: projectfilter});

                    // resolve(res.rows[0].rowid);
                }
            )
        })
    };
    console.log("*********** request : "+request.body.certFilter);
    console.log("call db func");
    kev = "";
    rowcount=countrec();
    console.log("row count"+rowcount);
    readdb().then((rowid) => {
        console.log(rowid)//Value here is defined as u expect.
    });
    console.log("after db func");
};



module.exports.certsGetOne = function (request, response, next) {
    console.log("running get single cert...");
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

    squery = 'select "certs"."id" as "certid","certs"."name" as "certName", "certs"."start_date" as "certStartDate","certs"."expiry_date" as "certExpiryDate","certs"."cert_file" as "certFile","certs"."revoked" as "certRevoked","certs"."changeRef" as "certChangeRef","certs"."commonName" as "certCommonName","certs"."leadTime" as "certLeadTime","certs"."type" as "certTypeId","certs"."revokedDate" as "certRevokedDate", \
    "project"."name" as "projectname","user"."name" as "userName","user"."email" as "userEmail" \
    from "certs" \
    inner join "projects" as "project" on "project"."id" = "certs"."project" \
    LEFT OUTER JOIN "users" AS "user" ON "project"."userId" = "user"."id" \
    WHERE "certs"."id" = $1'

    squery1 = 'select "devices"."id" as "deviceId","devices"."name" as "deviceName" \
    from "certs" \
    inner join "projects" as "project" on "project"."id" = "certs"."project" \
    LEFT OUTER JOIN "users" AS "user" ON "project"."userId" = "user"."id" \
    LEFT OUTER JOIN ( "project_devices" AS "devices->project_device" \
    INNER JOIN "devices" AS "devices" ON "devices"."id" = "devices->project_device"."deviceId") ON "project"."id" = "devices->project_device"."projectId" \
    WHERE "certs"."id" = $1'

    pool.query(squery, [id], (err, res) => {
            // pool.query('SELECT * FROM cert where row_id = $1', [id], (err, res) => {
            if (err) return next(err);
            var certname = res.rows[0].certName;
            var today = new Date();
            var projectname = res.rows[0].projectname;
            var devicename = res.rows[0].devicesName;
            var sdate = date.format(res.rows[0].certStartDate, 'YYYY-MM-DD');
            var edate = date.format(res.rows[0].certExpiryDate, 'YYYY-MM-DD');
            var daysLeft = date.subtract(res.rows[0].certExpiryDate, today).toDays();
            var contact = res.rows[0].userName
            var certuserEmail = res.rows[0].userEmail
            var changeref = res.rows[0].certChangeRef;
            var commonName = res.rows[0].certCommonName;
            var leadTime = res.rows[0].certLeadTime;
            var certtype = res.rows[0].certTypeId;
            var certRevoked = res.rows[0].certsRevoked; 
            revokedVis="hidden";
            if (res.rows[0].certsRevoked) {
                var certRevokedDate = date.format(res.rows[0].certRevokedDate, 'YYYY-MM-DD');
                certRevoked = "checked"
                revokedVis = "visible"
            };
            // var sysname = res.rows[0].systemname;
            var certfile = res.rows[0].certFile;
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

module.exports.certAddOne = function (request, response, next) {
    console.log("POST new cert"); 

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
        runsql2('SELECT id as deviceid, name as devicename from devices'),
        runsql2('SELECT id as Id,email as userEmail from users'),
        runsql2('SELECT id as projectid, name as projectname from projects')
      ])
      .then((result) => response.render('addCert', { devices: result[0],userlist:result[1], projects:result[2], title: 'Add Cert' }))
      .catch((err) => console.log(err))
};



module.exports.certPost_upload_working = function(req,res,next){
    console.log("upload section");
    function insertcert(body) {
        console.log("upload : "+body);
    }
   
    // console.log('FIRST TEST: ' + JSON.stringify(req.files));
    console.log('second TEST: ' +req.files.theFile.name);
    next();
  };


module.exports.certPost = function (request, response, next) {
    certFileName="";
    let certFile = request.files.theFile;
    if (certFile) {console.log("file upload details : "+certFile.name)
    certFile.mv(appRoot+'/uploads/'+certFile.name, function(err) {
        if (err)
          console.log("file upload failed "+err);
          console.log("file upload done");
        var fileUploaded = true;
      })
    certFileName=certFile.name};
    function insertcert(body) {
        console.log("insert command");
        console.log(body);
        console.log("body");
        var today = new Date();
        deviceid = body.certdevice;
        const { name, commonname, changeref, certtype, start_date, expiry_date, leadtime } = body;
        for (var i in deviceid) {
            console.log(deviceid[i]);
        }
        console.log("device : "+name)
        return new Promise(function (resolve, reject) {
            pool.query('INSERT INTO certs(name,"commonName","changeRef",type, expiry_date,start_date,cert_file,"leadTime") VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
                [name, commonname, changeref,certtype, expiry_date, start_date,certFileName,leadtime],
                (err, res) => {
                    if (err) return next(err);
                    resolve(name);
                    // response.redirect('/certs');
                }
            )
        })
    };

    function getmax() {
        console.log("get max");
        return new Promise(function (resolve, reject) {
            pool.query('select max(id) as max from certs', (err, res) => {
                if (err) return next(err);
                max = res.rows.max;
                resolve(res.rows.max);
                // response.redirect('/certs');
            }
            )
        })
    };

    insertcert(request.body).then((certdevice) => {
        console.log("junction body");
        console.log(request.body);
        var tmparry=[];
        var adddevice=[];
        var adddevice = tmparry.concat(request.body.certdevice);
        console.log("devices")
        console.log(adddevice);
        pool.query('select max(id) from certs', (err, res) => {
            if (err) return next(err);
            // console.log("max::");
            console.log("max row : "+res.rows[0].max);
            // console.log("done max 2" + system + ":" + res.rows[0].max)//Value here is defined as u expect.
            console.log("list devices") 
            // for (var entry in device) {
            // device.forEach(function(entry) {
            var index;
            for (index = 0; index < adddevice.length; ++index) {
                console.log(index+"device : "+adddevice[index])
                pool.query('INSERT INTO device_certs("certId","deviceId") VALUES($1, $2)',
                    [res.rows[0].max, adddevice[index]],
                    (err, res) => {
                    if (err) return next(err);
                });
            };
        })

        pool.query('select max(id) from certs', (err, res) => {
            if (err) return next(err);
            response.redirect('/certs');
        })
    });
    // response.redirect('/certs');
};



module.exports.certUpdatetest = function (req, res, next) {
    // let certFile = req.files.theFile;
    console.log("lefts do this");
    console.log(req.body);
};



module.exports.certUpdate = function (request, response, next) {
    var certFileName= "";
    let certFile = request.files.newcertfile;
    console.log("check for a new file "+request.files.newcertfile);
    if (certFile) {console.log("file upload details : "+certFile.name)
    certFileName=certFile.name;
    certFile.mv(appRoot+'/uploads/'+certFile.name, function(err) {
        if (err)
          console.log("file upload failed "+err);
          console.log("file upload done");
        var fileUploaded = true;
      })};

        console.log("insert command");
        console.log(request.body);
        console.log(request.files);
        
        console.log("body");
        var today = new Date();
        const { certid,name, created_date, expiry_date, start_date, device,currentCertFile,certdevicejuncid } = request.body;
        var usethisfilename = currentCertFile;
        console.log(certFileName+" : "+currentCertFile);

        if (certFileName) {usethisfilename = certFileName};

        return new Promise(function (resolve, reject) {
        console.log("lets do an update ");
        console.log("file name : "+usethisfilename);
            pool.query('UPDATE cert SET name = $2, created_date = $3, expiry_date = $4, start_date = $5, cert_file = $6 where row_id = $1',[certid,name, created_date, expiry_date, start_date, usethisfilename],(err, res) => {
            if (err) return next(err);
            console.log("************** cert id : "+certid);
            console.log("************** device id : "+device);
            console.log("************** junction row : "+certdevicejuncid);
            pool.query('UPDATE cert_device_junc SET cert = certid, device = device WHERE row_id = certdevicejuncid',
            (err, res) => {
                if (err) return next(err);
            })
            console.log("insert : "+res);
            response.redirect('/certs');
        })});
};