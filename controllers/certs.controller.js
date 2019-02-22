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

        squery = 'select "certs"."id" as "certId","certs"."name" as "certName", "certs"."start_date" as "certStartDate","certs"."expiry_date" as "certExpiryDate","certs"."cert_file" as "certFile","certs"."revoked" as "certRevoked","certs"."changeRef" as "certChangeRef","certs"."start_date" as "certStartDate","certs"."commonName" as "certCommonName","certs"."leadTime" as "certLeadTime","certs"."type" as "certType","certs"."revokedDate" as "certRevokedDate", \
            "project"."name" as "projectName", "project"."id" as "projectId","user"."email" as "userEmail" \
            from "certs" \
            inner join "projects" as "project" on "project"."id" = "certs"."project" \
            LEFT OUTER JOIN "users" AS "user" ON "project"."userId" = "user"."id" \
            AND UPPER("project"."name") like \'%'+projectfilter.toUpperCase()+'%\' \
            and UPPER("certs"."name") like \'%'+certfilter.toUpperCase()+'%\' \
            order by "certs"."expiry_date","certs"."name"'

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
                        //if (res.rows[i].devicesId == null) {console.log("NULL!!!")};
                        //if (res.rows[i].devicesId != null) {
                            var daysLeft = date.subtract(res.rows[i].certExpiryDate, today).toDays();
                            res.rows[i].daysLeft = daysLeft;
                            var class_type = "alert alert-success";
                            if (daysLeft < 30) {
                                class_type = "alert alert-warning";
                            }
                            if (daysLeft < 7) {
                                class_type = "alert alert-danger";
                            }
                            res.rows[i].classtype=class_type;
                            sdate = date.format(res.rows[i].certStartDate, 'DD-MM-YYYY');
                            console.log(sdate)
                            res.rows[i].certStartDate = sdate;

                            edate = date.format(res.rows[i].certExpiryDate, 'DD-MM-YYYY');
                            res.rows[i].certExpiryDate = edate;
                        //}
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
    
    if (request.session.user && request.cookies.user_sid) {
        rowcount=countrec();
        console.log("row count"+rowcount);
        readdb().then((rowid) => {
        console.log(rowid)//Value here is defined as u expect.
        });
        console.log("after db func");
    } else {
        console.log("user not logged in")
        res.redirect('/login');
    };
};



module.exports.certsGetOne = function (request, response, next) {
    console.log("running get single cert...");
    const find_cert_id = request.params.certId;

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

    if (request.session.user && request.cookies.user_sid) {
        console.log("user during get cert "+username);
        
        get_project_list = 'SELECT id as projectid, name as projectname from projects';
        get_device_list = 'SELECT id as deviceid, name as devicename from devices';
        get_cert_type_list = 'SELECT id as certTypeId, name as certTypeName from cert_types';
        get_all_squery = 'select "certs"."id" as "certid","certs"."name" as "certName", "certs"."start_date" as "certStartDate","certs"."expiry_date" as "certExpiryDate","certs"."cert_file" as "certFile","certs"."revoked" as "certRevoked","certs"."changeRef" as "certChangeRef","certs"."commonName" as "certCommonName","certs"."leadTime" as "certLeadTime","certs"."type" as "certTypeId","certs"."revokedDate" as "certRevokedDate", \
        "project"."name" as "projectname","user"."name" as "userName","user"."email" as "userEmail", \
        "certtype"."name" as "certtypename" \
        from "certs" \
        inner join "projects" as "project" on "project"."id" = "certs"."project" \
        inner join "cert_types" as "certtype" on "certtype"."id" = "certs"."type" \
        LEFT OUTER JOIN "users" AS "user" ON "project"."userId" = "user"."id" \
        WHERE "certs"."id" = '+find_cert_id
        get_devices_squery = 'select "certs"."id" as "certid","certs"."name" as "certName", "certs"."start_date" as "certStartDate","certs"."expiry_date" as "certExpiryDate","certs"."cert_file" as "certFile","certs"."revoked" as \ "certRevoked","certs"."changeRef" as "certChangeRef","certs"."commonName" as "certCommonName","certs"."leadTime" as "certLeadTime","certs"."type" as "certTypeId","certs"."revokedDate" as "certRevokedDate", \
        "project"."name" as "projectname","user"."name" as "userName","user"."email" as "userEmail", \
        "certtype"."name" as "certtypename", \
        "devices"."name" as "deviceName", "devices"."id" as "deviceid" \
        from "certs" \
        inner join "projects" as "project" on "project"."id" = "certs"."project" \
        inner join "cert_types" as "certtype" on "certtype"."id" = "certs"."type" \
        LEFT OUTER JOIN "users" AS "user" ON "project"."userId" = "user"."id" \
        inner join device_certs as junc  on certs.id = junc."certId" \
        inner join devices  on devices.id = junc."deviceId" \
        WHERE "certs"."id" = '+find_cert_id

        console.log(get_all_squery);

        Promise.all([
            runsql2(get_project_list),
            runsql2(get_device_list),
            runsql2(get_cert_type_list),
            runsql2(get_all_squery),
            runsql2(get_devices_squery)
        ])
        .then(data => {
            projects=[]
            devices=[]
            certtypes=[]
            certdevices=[]
            certdetails=[]
            proects=data[0]
            devices=data[1]
            certtypes=data[2]
            certDetails=data[3]
            certdevices=data[4]
            var certname = certDetails[0].certName;
            var today = new Date();
            var projectname = certDetails[0].projectname;
            var sdate = date.format(certDetails[0].certStartDate, 'YYYY-MM-DD');
            var edate = date.format(certDetails[0].certExpiryDate, 'YYYY-MM-DD');
            var daysLeft = date.subtract(certDetails[0].certExpiryDate, today).toDays();
            var contact = certDetails[0].userName
            var changeref = certDetails[0].certChangeRef;
            var commonName = certDetails[0].certCommonName;
            var leadTime = certDetails[0].certLeadTime;
            var certtype = certDetails[0].certTypeId;
            var certRevoked = certDetails[0].certRevoked; 
            var projectname = certDetails[0].projectname;
            var certtypename = certDetails[0].certtypename
            var userEmail = certDetails[0].userEmail
            revokedVis="hidden";
            if (certDetails[0].certRevoked) {
                var certRevokedDate = date.format(certDetails[0].certRevokedDate, 'YYYY-MM-DD');
                certRevoked = "checked"
                revokedVis = "visible"
            };
            var certfile = certDetails[0].certFile;
            console.log("project : "+projectname);
            console.log("render one cert")
            response
                .render('getCert', { data: certDetails, certdevices: certdevices, userEmail: userEmail, certtype: certtype,certtypename: certtypename, projectname: projectname, projects: projects,revokedVis: revokedVis,devices: devices, title: 'Certificate: '+certname, changeref: changeref, commonName: commonName, leadTime: leadTime,certname: certname,certRevoked: certRevoked, certRevokedDate: certRevokedDate, contact: contact, sdate: sdate, edate: edate, projectname: projectname, dleft: daysLeft,certfile: certfile,certid: find_cert_id,accessLvl: accessLvl });
        
            console.log("Second handler", data);
        })
        .catch((err) => console.log(err))
    } else {
        console.log("user not logged in")
        response.redirect('/login');
    };
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

    if (request.session.user && request.cookies.user_sid) {   
        console.log("call sync");
        Promise.all([
            runsql2('SELECT id as deviceid, name as devicename from devices'),
            runsql2('SELECT id as Id,email as userEmail from users'),
            runsql2('SELECT id as projectid, name as projectname from projects')
        ])
        .then((result) => response.render('addCert', { devices: result[0],userlist:result[1], projects:result[2], title: 'Add Cert' }))
        .catch((err) => console.log(err))
    } else {
        console.log("user not logged in")
        response.redirect('/login');
    };
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

    function insertcert(body) {
        console.log("insert command");
        console.log(body);
        console.log("body");
        var today = new Date();
        deviceid = body.certdevice;
        const { name, commonname, changeref, certtype, start_date, expiry_date, leadtime, certproj } = body;
        for (var i in deviceid) {
            console.log(deviceid[i]);
        }
        console.log("device : "+name)
        return new Promise(function (resolve, reject) {
            pool.query('INSERT INTO certs(name,"commonName","changeRef",type, expiry_date,start_date,cert_file,"leadTime","project") VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)',
                [name, commonname, changeref,certtype, expiry_date, start_date,certFileName,leadtime,certproj],
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

    if (request.session.user && request.cookies.user_sid) {
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

        insertcert(request.body).then((certdevice) => {
            console.log("junction body");
            console.log(request.body);
            var tmparry=[];
            var adddevice=[];
            var adddevice = tmparry.concat(request.body.certdevice);
            var projectId = request.body.certproj;
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
                    pool.query('INSERT INTO project_devices("projectId","deviceId") VALUES($1, $2)',
                        [projectId, res.rows[0].max],
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
    } else {
        console.log("user not logged in")
        res.redirect('/login');
    };
};

module.exports.certUpdate = function (request, response, next) {
    var certFileName= "";
    let certFile = request.files.newcertfile;
    console.log("check for a new file "+request.files.newcertfile);
    if (certFile) {console.log("file upload details : "+certFile.name)
        certFileName=certFile.name;
        certFile.mv(appRoot+'/uploads/'+certFile.name, function(err) {
            if (err) {
                console.log("file upload failed "+err);
                console.log("file upload done");
                var fileUploaded = true;
            };
        })
    };

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
        })
    });
};