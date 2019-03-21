const pool = require('../db');

const date = require('date-and-time');

var offset = 0;
var count = 10;
var pagerStart=0;

module.exports.certsGetAll = function (request, response, next) {
    console.log("body response");


    function writedoc() {
        var JSZip = require('jszip');
var Docxtemplater = require('docxtemplater');

var fs = require('fs');
var path = require('path');

//Load the docx file as a binary
var content = fs
    .readFileSync(path.resolve(__dirname, 'template5.docx'), 'binary');

var zip = new JSZip(content);

var doc = new Docxtemplater();
doc.loadZip(zip);

//set the templateVariables
doc.setData({
    requestors_name: 'John Doe',
    application: 'Skynet',
    change_number: 'CHG00001',
    change_start_date: '04/08/2019 20:00',
    change_end_date: '08/08/2019 23:00',
    cert_type_1: 'Router',
    cert_type_2: 'CER',
    project_owner: 'Miles Dyson',
    key_role: 'Chief Scientist',
    business_unit: 'Cyberdyne',
    requestors_email: 'me@me.com',
    requestors_name: 'Miles Dyson',
    "servers": [
        {server_name: 'T800'},
        {server_name: 'T850'},
        {server_name: 'T1000'}
    ],
    common_name: 'CN100000',
    key_database: 'DB2',
    key_label: 'T-Label',
    encryption_level: 'SHA1'
});

try {
    // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
    doc.render()
}
catch (error) {
    var e = {
        message: error.message,
        name: error.name,
        stack: error.stack,
        properties: error.properties,
    }
    console.log(JSON.stringify({error: e}));
    // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
    throw error;
}

var buf = doc.getZip()
            .generate({type: 'nodebuffer'});

// buf is a nodejs buffer, you can either write it to a file or do anything else with it.
fs.writeFileSync(path.resolve(__dirname, 'tag-example2.docx'), buf);
console.log("done doc")

}

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

        squery = 'select "certs"."id" as "certId","certs"."name" as "certName", "certs"."issue_date" as "certIssueDate","certs"."expiry_date" as "certExpiryDate","certs"."cert_file" as "certFile","certs"."revoked" as "certRevoked","certs"."implemented" as "certimplemented","certs"."changeRef" as "certChangeRef","certs"."issue_date" as "certissueDate","certs"."commonName" as "certCommonName","certs"."leadTime" as "certLeadTime","certs"."type" as "certType","certs"."revokedDate" as "certRevokedDate", \
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
                            idate = date.format(res.rows[i].certIssueDate, 'DD-MM-YYYY');
                            //console.log(idate)
                            res.rows[i].certissueDate = idate;

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
        // writedoc();
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

    function inArray(target, array)
    {

    /* Caching array.length doesn't increase the performance of the for loop on V8 (and probably on most of other major engines) */

        for(var i = 0; i < array.length; i++) 
        {
            if(array[i].deviceid === target)
            {
            return true;
            }
        }

    return false; 
    }

    if (request.session.user && request.cookies.user_sid) {
        console.log("user during get cert "+username);
        
        get_project_list = 'SELECT id as projectid, name as projectname from projects';
        get_device_list = 'SELECT id as deviceid, name as devicename from devices';
        get_cert_type_list = 'SELECT id as listcertTypeId, name as listcertTypeName from cert_types';
        get_all_squery = 'select "certs"."id" as "certid","certs"."name" as "certName", "certs"."issue_date" as "certissueDate","certs"."expiry_date" as "certExpiryDate","certs"."cert_file" as "certFile","certs"."revoked" as "certRevoked","certs"."implemented" as "certimplemented","certs"."changeRef" as "certChangeRef","certs"."commonName" as "certCommonName","certs"."leadTime" as "certLeadTime","certs"."type" as "certTypeId","certs"."revokedDate" as "certRevokedDate", \
        "project"."name" as "projectname","user"."name" as "userName","user"."email" as "userEmail", \
        "certtype"."name" as "certtypename" \
        from "certs" \
        inner join "projects" as "project" on "project"."id" = "certs"."project" \
        inner join "cert_types" as "certtype" on "certtype"."id" = "certs"."type" \
        LEFT OUTER JOIN "users" AS "user" ON "project"."userId" = "user"."id" \
        WHERE "certs"."id" = '+find_cert_id
        get_devices_squery = 'select "certs"."id" as "certid","certs"."name" as "certName", "certs"."issue_date" as "certissueDate","certs"."expiry_date" as "certExpiryDate","certs"."cert_file" as "certFile","certs"."revoked" as "certRevoked","certs"."implemented" as "certimplemented","certs"."changeRef" as "certChangeRef","certs"."commonName" as "certCommonName","certs"."leadTime" as "certLeadTime","certs"."type" as "certTypeId","certs"."revokedDate" as "certRevokedDate", \
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
            projects=data[0]
            devices=data[1]
            certtypes=data[2]
            certDetails=data[3]
            certdevices=data[4]
            var certname = certDetails[0].certName;
            var today = new Date();
            var projectname = certDetails[0].projectname;
            var idate = date.format(certDetails[0].certissueDate, 'YYYY-MM-DD');
            var edate = date.format(certDetails[0].certExpiryDate, 'YYYY-MM-DD');
            var daysLeft = date.subtract(certDetails[0].certExpiryDate, today).toDays();
            var reminderDate = new Date();
            reminderDate.setDate(certDetails[0].certExpiryDate.getDate()-certDetails[0].certLeadTime);
            // var issueReminderDate = date.subtract(certDetails[0].certExpiryDate, certDetails[0].certLeadTime);
            var contact = certDetails[0].userName
            var changeref = certDetails[0].certChangeRef;
            var commonName = certDetails[0].certCommonName;
            var leadTime = certDetails[0].certLeadTime;
            var certtype = certDetails[0].certTypeId;
            var certRevoked = certDetails[0].certRevoked; 
            var implemented = certDetails[0].certimplemented;
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
            filteredDeviceList=[]
            for(var i = 0; i < devices.length; i++) 
            {
                if(inArray(devices[i].deviceid, certdevices) === false)
                { filteredDeviceList.push(devices[i])
                }
            }

            console.log("project : "+projectname);
            console.log("render one cert")
            response
                .render('getCert', { data: certDetails, certdevices: certdevices, userEmail: userEmail,certlist: certtypes, certtype: certtype,certtypename: certtypename, projectname: projectname, projects: projects,revokedVis: revokedVis,implemented: implemented,devices: filteredDeviceList, title: 'Certificate: '+certname, changeref: changeref, commonName: commonName, leadTime: leadTime,certname: certname,certRevoked: certRevoked, certRevokedDate: certRevokedDate, contact: contact, idate: idate, edate: edate, projectname: projectname, dleft: daysLeft,certfile: certfile,certid: find_cert_id,accessLvl: accessLvl });
        
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
            runsql2('SELECT id as projectid, name as projectname from projects'),
            runsql2('SELECT id as listcertTypeId, name as listcertTypeName from cert_types'),
            runsql2('SELECT id as listcertTypeId2, name as listcertTypeName2 from cert_types_2')
            
        ])
        .then((result) => response.render('addCert', { devices: result[0],userlist:result[1], projects:result[2], certlist: result[3],certlist2: result[4],title: 'Add Cert' }))
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

    function writedoc(body) {
                var JSZip = require('jszip');
        var Docxtemplater = require('docxtemplater');

        var fs = require('fs');
        var path = require('path');

        //Load the docx file as a binary
        var content = fs
            .readFileSync(path.resolve(__dirname, 'template5.docx'), 'binary');

        var zip = new JSZip(content);

        var doc = new Docxtemplater();
        doc.loadZip(zip);
        device_names=[];
get_device_name_sql = 'select * from devices where id = 18';

Promise.all([
    runsql2('SELECT id as deviceidx, name as devicenamex from devices'),
    runsql2('SELECT id as deviceidx, name as devicenamex from devices')  
])
.then(data => {
    devices=[]
    devices=data[0]
    resolve.console.log(devices)
    })
.catch((err) => console.log(err));

console.log("sone")

        Promise.all ([
        a=runsql2(get_device_name_sql)
        ]) 
            .then(a => console.log(a))
            .catch((err) => console.log(err))

        for (var i = 0; i < body.certdevice.length; i++) {

            // console.log(body.certdevice[i]);
            // get_device_name_sql = 'SELECT name as devicename from devices where id = '+body.certdevice[i]
            get_device_name_sql = 'select * from devices where id = 17'
            runsql2(get_device_name_sql)
            .then((result) => console.log(result))
            .catch((err) => console.log(err))
           };


           
console.log("sql done")

        server_list = [{
            server_name: 'T800',
        },{
            server_name: 'T850',
        },{
            server_name: 'T1000',
        }];
        //set the templateVariables
        doc.setData({
            application: 'Skynet',
            change_number: 'CHG00001',
            change_start_date: '04/08/2019 20:00',
            change_end_date: '08/08/2019 23:00',
            cert_type_1: body.certtype,
            cert_type_2: body.certtype2,
            project_owner: 'Miles Dyson',
            key_role: 'Chief Scientist',
            business_unit: 'Cyberdyne',
            requestors_email: 'me@me.com',
            requestors_name: body.reqname,
            servers: server_list,
            common_name: 'CN100000',
            key_database: 'DB2',
            key_label: 'T-Label',
            encryption_level: 'SHA1'
        });

        try {
            // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
            doc.render()
        }
        catch (error) {
            var e = {
                message: error.message,
                name: error.name,
                stack: error.stack,
                properties: error.properties,
            }
            console.log(JSON.stringify({error: e}));
            // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
            throw error;
        }

        var buf = doc.getZip()
                    .generate({type: 'nodebuffer'});

        // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
        fs.writeFileSync(path.resolve(__dirname, 'tag-example5.docx'), buf);
        console.log("done doc")

    }

    function insertcert(body) {
        console.log("insert command");
        console.log(body);
        console.log("body");
        var today = new Date();
        deviceid = body.certdevice;
        const { certname, commonname, changeref, certtype, issue_date, expiry_date, leadtime, certproj } = body;
        for (var i in deviceid) {
            console.log(deviceid[i]);
        }
        console.log("device : "+certname)
        return new Promise(function (resolve, reject) {
            pool.query('INSERT INTO certs(name,"commonName","changeRef",type, expiry_date,issue_date,cert_file,"leadTime","project") VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)',
                [certname, commonname, changeref,certtype, expiry_date, issue_date,certFileName,leadtime,certproj],
                (err, res) => {
                    if (err) return next(err);
                    resolve(certname);
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
        let certFile = request.files.newcertfile;
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
            writedoc(request.body);
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
                certpage = '/certs/record'+res.rows[0].max;
                response.redirect(certpage);
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

    //const { certid,name, created_date, expiry_date, issue_date, device,currentCertFile,certdevicejuncid } = request.body;
    const { certid,certRevoked,certtype,changeref,commonname,expiry_date,leadtime,issue_date,currentCertFile,certdevice,deldevice,implemented } = request.body;
    var usethisfilename = currentCertFile;
    if (request.body.certRevokedDate) {
        var certRevokedDate = request.body.certRevokedDate
    } else {
        var certRevokedDate = "27/12/1977"
    };
  
    console.log(certFileName+" : "+currentCertFile);

    if (certFileName) {usethisfilename = certFileName};
    tmparry=[]
    addthesedevices=tmparry.concat(certdevice)
    tmparry=[]
    delthsedevices=tmparry.concat(deldevice)

    if (certdevice) {
        tmparry=[]
        addthesedevices=tmparry.concat(certdevice)
    for (index = 0; index < addthesedevices.length; ++index) {
        pool.query('INSERT INTO device_certs("certId","deviceId") VALUES($1, $2)',
            [certid, addthesedevices[index]],
            (err, res) => {
            if (err) return next(err);
        });
        };
    };

    if (deldevice) {
        tmparry=[]
        delthsedevices=tmparry.concat(deldevice)
    for (index = 0; index < delthsedevices.length; ++index) {
        pool.query('DELETE from device_certs where "certId" = $1 and "deviceId" = $2',
            [certid, delthsedevices[index]],
            (err, res) => {
            if (err) return next(err);
        });
    };
    };

    if (certRevokedDate == "") {
        certRevokedDate="01/01/2001";
    }

    return new Promise(function (resolve, reject) {
        console.log("lets do an update ");
        console.log("file name : "+usethisfilename);
        // pool.query('UPDATE certx SET name = $2, created_date = $3, expiry_date = $4, issue_date = $5, cert_file = $6 where row_id = $1',[certid,name, created_date, expiry_date, issue_date, usethisfilename],(err, res) => {
        pool.query('UPDATE certs SET expiry_date = $7, issue_date = $9, cert_file = $10, revoked = $2, "revokedDate" = $3, type=$4,"changeRef" = $5, "commonName" = $6, "leadTime" = $8,"implemented" = $11 where certs.id = $1',[certid,certRevoked, certRevokedDate, certtype, changeref,commonname,expiry_date,leadtime,issue_date, usethisfilename,implemented],(err, res) => {
            if (err) return next(err);
            //console.log("************** cert id : "+certid);
            //console.log("************** device id : "+device);
            //console.log("************** junction row : "+certdevicejuncid);
            //console.log("insert : "+res);
            response.redirect('/certs');
        })
    });
};