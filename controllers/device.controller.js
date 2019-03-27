const pool = require('../db');

const date = require('date-and-time');

var offset = 0;
var count = 10;
var pagerStart=0;

module.exports.listall = function (request, response, next) {
console.log("device list all body response");
console.log(response.body);
    function countrec() {
        console.log("in select db func");
        return new Promise(function (resolve, reject) {
            pool.query('SELECT count(*) as rowcount \
        FROM devices', (err, res) => {
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
        var devicefilter = "";
        var projectfilter = "";
        if (request.body.certFilter) {
            certfilter = request.body.certFilter.toUpperCase();
        }
        if (request.body.projectFilter) {
            projectfilter = request.body.projectFilter.toUpperCase();
        }
        console.log("request query set to : "+request.query);

        console.log("first query vars : "+devicefilter+" : "+request.query.devicefilter);


        squery = 'SELECT "devices"."id" AS "devicesId", "devices"."name" AS "devicesName" FROM "devices" AS "devices" ORDER BY devices.name ASC';

        console.log("squery : "+squery);
        return new Promise(function (resolve, reject) {
            pool.query(squery, (err, res) => {
                    kev = 2;
                    if (err) return next(err);
                    console.log(res.rows);
                    console.log("second request query set to : "+request.query.devicefilter);
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
                        .render('list_devices', { data: res.rows.slice(offset,offset+count), recordDetails: recordDetails, title: 'Cert Database' ,uname: username, accessLvl: accessLvl,devicefilter: devicefilter,projectfilter: projectfilter});

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





module.exports.listAllDevices = function (request, response, next) {
    console.log("device screen"); 

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
    devicefilter=""
    projectfilter=""
    Promise.all([
        runsql2('SELECT "devices"."id" AS "devicesId", "devices"."name" AS "devicesName" FROM "devices" AS "devices" ORDER BY devices.name ASC'),
        runsql2('SELECT id as projectid,name as projectname from projects')
      ])
      .then(data => {
        devicelist=[]
        projectlist=[]
        devicelist=data[0]
        projectlist=data[1]
        if (request.query && request.query.offset) {
            offset = parseInt(request.query.offset, 10);
        }
    
        if (request.query && request.query.count) {
            count = parseInt(request.query.count, 10);
        }
    
        console.log("devices : "+devicelist);
        console.log("projects : "+projectlist)
        // res.rows[0].rowcount = "test";
        page_cnt=Math.ceil(devicelist.length/count);
        console.log('render test after promise ');
        recordDetails = {totalRecords: devicelist.length,recPerPage: count,pageCount: Math.ceil(devicelist.length/count),currentPage: offset,pagerStart: pagerStart};
        console.log(recordDetails);
        response
            .render('list_devices', { data: devicelist.slice(offset,offset+count), recordDetails: recordDetails, title: 'Cert Database : Devices' ,uname: username, accessLvl: accessLvl,devicefilter: devicefilter,projectfilter: projectfilter});
    
        console.log("Second handler", data);
      })
      .catch((err) => console.log(err))
};











module.exports.deviceGetOne = function (request, response, next) {
    console.log("running get single device...");
    const id = request.params.deviceId;
    if (request.session.user && request.cookies.user_sid) {
    console.log("user during get device "+username);
    pool.query('SELECT row_id as projectid, name as projectname from projects', (err, res) => {
        if (err) return next(err);
        console.log(res.rows);
    projects=res.rows;
    })
    squery = 'SELECT devices.row_id as rowid, devices.name as devicename,projects.name as projectname,users.email as useremail \
    FROM devices \
    INNER JOIN device_project_junc ON devices.row_id = device_project_junc.device \
    inner join projects on projects.row_id = device_project_junc.project \
    inner join users on users.id = projects.contact \
    WHERE devices.row_id = $1';

    pool.query(squery, [id], (err, res) => {
            // pool.query('SELECT * FROM cert where row_id = $1', [id], (err, res) => {
            if (err) return next(err);
            console.log(res.rows[0]);
            var devicename = "";
            var projectname = "";
            var contact = "";
            if (res.rows[0]) {
            var devicename = res.rows[0].devicename;
            var today = new Date();
            var projectname = res.rows[0].projectname;
            var contact = res.rows[0].useremail;
            };
            // console.log("project : "+projects[1].projectname);
            response
                .render('getDevice', { data: res.rows, projects: projects, title: 'Device : '+devicename, devicename: devicename,project: projectname, contact: contact,deviceid: id });
        })
    } else {
        console.log("exit 2");
        response.redirect('/login');
    }
};

module.exports.postDevicex = function (request, response, next) {
    console.log("post device : "+request.body.newdevice);
    devicename = request.body.newdevice
    console.log("###################################################")

    console.log("###################################################")

    return new Promise(function (resolve, reject) {
        pool.query('INSERT INTO devices("name") VALUES($1)',
            [devicename],
            (err, res) => {
                if (err) return next(err);
                resolve(devicename);
                response.redirect('/devices');
            }
        )
    })

};

module.exports.postDevice = function (request, response, next) {
    
        console.log("junction body");
        console.log(request.body);
        var tmparry=[];
        var adddevice=[];
        var adddevice = tmparry.concat(request.body.certdevice);
        console.log("devices")
        console.log(adddevice);
        pool.query('INSERT INTO devices(name) VALUES($1)',
                [request.body.newdevice],
                    (err, res) => {
                    if (err) return next(err);
                    response.redirect('/devices');
                });
        };