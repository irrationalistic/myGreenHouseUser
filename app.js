var express = require('express');
var bodyParser = require('body-parser');
var indexController = require('./controllers/index.js');
var apiController = require('./controllers/api.js');

// We need database persistence
var mongoose = require('mongoose');

// Express Session allows us to use Cookies to keep track of
// a user across multiple pages. We also need to be able to load
// those cookies using the cookie parser
var session = require('express-session');
var cookieParser = require('cookie-parser');

// Flash allows us to store quick one-time-use messages
// between views that are removed once they are used.
// Useful for error messages.
var flash = require('connect-flash');

// Load in the base passport library so we can inject its hooks
// into express middleware.
var passport = require('passport');

// Load in our passport configuration that decides how passport
// actually runs and authenticates
var passportConfig = require('./config/passport');

// Pull in our two controllers...
var indexController = require('./controllers/index');
var authenticationController = require('./controllers/authentication');


// Connect to the database
mongoose.connect('mongodb://localhost/mygreenhouse-local');


// Define a base express app...
var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.urlencoded({extended: false, limit:'10mb'}));
app.use(bodyParser.json({limit:'10mb'}));

// Add in the cookieParser and flash middleware so we can
// use them later
app.use(cookieParser());
app.use(flash());

// Initialize the express session. Needs to be given a secret property.
// Also requires the resave option (will not force a resave of session if not modified)
// as well as saveUninitialized(will not automatically create empty data)
app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: false
}));

// Hook in passport to the middleware chain
app.use(passport.initialize());

// Hook in the passport session management into the middleware chain.
app.use(passport.session());


// Our get request for viewing the login page
app.get('/auth/login', authenticationController.login);

// Post received from submitting the login form
app.post('/auth/login', authenticationController.processLogin);

// Post received from submitting the signup form
app.post('/auth/signup', authenticationController.processSignup);

// Any requests to log out can be handled at this url
app.get('/auth/logout', authenticationController.logout);

// ***** IMPORTANT ***** //
// By including this middleware (defined in our config/passport.js module.exports),
// We can prevent unauthorized access to any route handler defined after this call
// to .use()
app.use(passportConfig.ensureAuthenticated);

// Because this route occurs after the ensureAuthenticated middleware, it will require
// authentication before access is allowed.
app.get('/', indexController.index);

app.get('/templates/:templateName', indexController.templates);


// api methods:
app.get('/api/garden', apiController.getAll);
app.post('/api/garden', apiController.addGarden);
app.post('/api/garden/:gardenId', apiController.updateGarden);
app.put('/api/garden/:gardenId', apiController.addImg);

//EDIT IN PLACE GARDEN POSTS
app.post('/checkLocation', apiController.checkLocation);
app.post('/checkTitle', apiController.checkTitle);
app.post('/checkSoil', apiController.checkSoil);
app.post('/checkWater', apiController.checkWater);
app.post('/checkSunlight', apiController.checkSunlight);
app.post('/checkComment', apiController.checkComment);





app.delete('/api/garden/:gardenId', apiController.deleteGarden);
app.delete('/api/garden/:gardenId', apiController.deletePlant);

var server = app.listen(3000, function() {
	console.log('Express server on listening localhost:' + server.address().port);
});
