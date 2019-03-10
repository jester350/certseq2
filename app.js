var express = require('express');


var path = require('path');
var fileUpload = require('express-fileupload');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');
var date = require('date-and-time');
var debug = require('debug');
var async = require('async');
var User = require('./models/user');
var AccessLvl = require('./models/accesslevels');
var schedule = require('node-schedule');
var cron = require('./bin/cron');
var fs = require('fs');
var select2 = require('select2');
var favicon = require('express-favicon');
var { body,validationResult } = require('express-validator/check');
var { sanitizeBody } = require('express-validator/filter');


// var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var certsRouter = require('./routes/certs');
var deviceRouter = require('./routes/device');
var projectsRouter = require('./routes/projects');



var offset_def = 15;

var routes = require('./routes')

var app = express();
app.use(fileUpload());
var path = require('path');
global.appDir = path.dirname(require.main.filename);
global.appRoot = path.resolve(__dirname);
console.log("root "+appRoot);

// view engine setup
app.set('public', path.join(appRoot, 'public'));
app.set('views', path.join(__dirname, 'views'));
app.set('css',path.join(appRoot, 'public/stylesheets/css'));
app.set('view engine', 'hbs');
app.use('/jquery331', express.static(__dirname + '/public/javascripts/'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/bootstrap337', express.static(__dirname + '/public/bootstrap-3.3.7/dist/'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/'));
app.use('/javascript', express.static(__dirname + '/public/javascripts/'));
app.use('/modules', express.static(__dirname + '/node_modules/'));

app.use(favicon(__dirname + '/public/favicon.png'));

var hbs = require('hbs');
hbs.registerHelper('compare', function (lvalue, operator, rvalue, options) {

    var operators, result;
    
    if (arguments.length < 3) {
        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
    }
    
    if (options === undefined) {
        options = rvalue;
        rvalue = operator;
        operator = "===";
    }
    
    operators = {
        '==': function (l, r) { return l == r; },
        '===': function (l, r) { return l === r; },
        '!=': function (l, r) { return l != r; },
        '!==': function (l, r) { return l !== r; },
        '<': function (l, r) { return l < r; },
        '>': function (l, r) { return l > r; },
        '<=': function (l, r) { return l <= r; },
        '>=': function (l, r) { return l >= r; },
        'typeof': function (l, r) { return typeof l == r; }
    };
    
    if (!operators[operator]) {
        throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
    }
    
    result = operators[operator](lvalue, rvalue);
    
    if (result) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }

});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

var JSZip = require('jszip');
var Docxtemplater = require('docxtemplater');

var fs = require('fs');
var path = require('path');

//Load the docx file as a binary
var content = fs
    .readFileSync(path.resolve(__dirname, 'doc4.docx'), 'binary');

var zip = new JSZip(content);

var doc = new Docxtemplater();
doc.loadZip(zip);

//set the templateVariables
doc.setData({
    first_name: 'John',
    last_name: 'Doe',
    phone: '0652455478',
    description: 'New Website'
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

app.use(session({
    // name: 'certdb@bpdts.com',
    key: 'user_sid',
    secret: 'The sky above the port was the color of television, tuned to a dead channel',
    resave: false,
    saveUninitialized: false,
    cookie: {
        // expires: 6
        name: "certDB",
        expires: 14 * 24 * 3600000
    }
}));

app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');        
    }
    next();
});

app.use(function(req, res,next) {
    console.log("response result :")
    console.log(res)
    //res.send('404: Page not Found', 404);
    next();
 });
 
 // Handle 500
 app.use(function(error, req, res, next) {
    res.send('500: Internal Server Error', 500);
 });
// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
    // console.log(res.cookie(cookie_name , 'cookie_value').send('Cookie is set'));
    console.log("check user : "+req.cookies.user_sid);
    if (req.session.user && req.cookies.user_sid) {
        console.log("route 1");
        res.redirect('/certs');
    } else {
        console.log("route 2");
        next();
    }  
};

// route for Home-Page
app.get('/', sessionChecker, (req, res) => {
    res.redirect('/login');
});

app.route('/sigxnup')
    .get(sessionChecker, (req, res) => {
        console.log("sign up");
        res.sendFile(__dirname + '/public/pages/3signup.html');
    })
    .post((req, res) => {
        User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            accessLvl: req.body.accessLvl
        })
        .then(user => {
            req.session.user = user.dataValues;
            res.redirect('/login');
        })
        .catch(error => {
            res.redirect('/4signup');
        });
});

app.route('/login')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/public/pages/login.html');
    })
    .post((req, res) => {
            username = req.body.username,
            password = req.body.password
            accessLvl = 0;
        console.log("find user");
        User.findOne({ where: { email: username } }).then(function (user) {
            if (!user) {
                console.log("user not found");
                res.redirect('/login');
            } else if (!user.validPassword(password)) {
                console.log("invalid password");
                res.redirect('/login');
            } else {
                kevuser => {
                    console.log("test findone 2");
                    console.log(user.get('username'));
                  }
                accessLvl = user.get('accessLvl');
                console.log("log in user..."+user.get('username')+" : "+user.get('accessLvl'));
                req.session.user = user.dataValues;
                console.log("render cert screen");
                res.redirect('/certs');
            }
        })
});

app.get('/certs/', (req, res,next) => {
    if (req.session.user && req.cookies.user_sid) {
        //res.sendFile(__dirname + '/certs');
        app.use('/certs',certsRouter);
    } else {
        res.redirect('/login');
    };
    next();
});

app.get('/devices/', (req, res,next) => {
    if (req.session.user && req.cookies.user_sid) {
        console.log("do a device thing");
        app.use('/devices',deviceRouter);
        next();
    } else {
        console.log("dont do a device thing");
        res.redirect('/login');
    }
});

app.get('/user', (req, res,next) => {
    console.log("user admin");
    if (req.session.user && req.cookies.user_sid) {
        if (accessLvl == 1) {
            // res.sendFile(__dirname + '/public/pages/signup.html');
            app.use('/users',usersRouter);
        next();
    } else {
        res.redirect('/login');
    }}
});

app.get('/projects', (req, res,next) => {
    console.log("systems");
    if (req.session.user && req.cookies.user_sid) {
        if (accessLvl == 1) {
            // res.sendFile(__dirname + '/public/pages/signup.html');
            app.use('/projects',projectsRouter);
        next();
    } else {
        res.redirect('/login');
    }}
});

// route for user logout
app.get('/logout', (req, res) => {
    res.seesioncookie = "expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    console.log("cookie name : "+req.session.cookie.name)
    console.log("logging out");
    res.clearCookie('user_sid'); 
    res.clearCookie(req.session.cookie.name,{ path: '/'});
    if (req.session.user && req.cookies.user_sid) {
        req.session.destroy(function(err) {
            // cannot access session here
          })
        console.log("exit 1");
        res.clearCookie(req.cookies.user_sid);
        console.log("expire cookie");
        res.seesioncookie = "used_sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        console.log("clear cookie");
        // res.clearCookie(req.cookie);
        
        res.redirect('/');
    } else {
        console.log("exit 2");
        res.clearCookie(req.cookies.user_sid);
        res.clearCookie(req.session.cookie.name,{ path: '/'});
        res.redirect('/login');
    }
});

//app.use(function(req, res) {
//    res.send('404: Page not Found!', 404);
//});
 
 // Handle 500
//app.use(function(error, req, res, next) {
//    res.send('500: Internal Server Error', 500);
//});

module.exports = app;
