
var express = require('express'); //Ensure our express framework has been added
var app = express();
var multer = require('multer'); //Multer is a node.js middleware for file managment
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
const { query } = require('express');
const path = require('path');
const { auth } = require('express-openid-connect');



//fs is a node.js module for reading files
// Multer librabry to store files localy (depracated)
var upload = multer({ dest: ".tmp/" });
app.use(express.json());

app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//Create Database Connection
var pgp = require('pg-promise')();


const dev_dbConfig = {
	host: 'db',
	port: 5432,
	database: process.env.POSTGRES_DB,
	user: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD
};


const isProduction = process.env.NODE_ENV === 'production';
const dbConfig = isProduction ? process.env.DATABASE_URL : dev_dbConfig;

if (isProduction) {
	pgp.pg.defaults.ssl = {rejectUnauthorized: false};
}

let db = pgp(dbConfig);


const config = {
	authRequired: false,
	auth0Logout: true,
	secret: 'a long, randomly-generated string stored in env',
	baseURL: 'https://studyez.herokuapp.com/',
	clientID: 'fI5aHF18Bj5RYVxg104PQoNskvXzLjCv',
	clientSecret: 'YF6wOPggSziZu_Mxb8VOTfjhvvMX-NutwWlttc2NB01xsLbri0xOa3DgNc5WCnt7',   // Aubrie
	issuerBaseURL: 'https://dev-sw6uvj4u.us.auth0.com',
};

app.use(auth(config));
// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/'));//This line is necessary for us to use relative paths and access our resources directory

var currEmail;
app.use(function (req, res, next) {
	res.locals.user = req.oidc.user;
	if (res.locals.user) { //typeof req.oidc.user !== 'undefined'
		currEmail = res.locals.user.email;
		req.app.locals.user = req.oidc.user;
		var input_email = req.oidc.user.email;
		var input_name = req.oidc.user.name;
		var search_query = `select count(*) from logins where logins.email = '${input_email}';`;
		db.task('get-everything', task => {
			return task.batch([
				task.any(search_query),
			]);
		})
			.then(info => {
				if (info[0][0].count === '0') {
					console.log("INSERTING", info[0][0].count);
					var insert_query = `INSERT INTO logins(full_name, email,document_list, knowledge_levels) VALUES('${input_name}','${input_email}','{}','{}');`;
					db.query(insert_query);
				}
			})
	}
	next();
});

app.get('/', (req, res) => {

	var test = "select * from logins";
	db.task('get-everything', task => {
		return task.batch([
			task.any(test),
		]);
	})
		.then(info => {
			console.log(info);
		})
	res.render('pages/cover_page', {
		my_title: "Cover Page"
	});
});



app.get('/cover_page', function (req, res) {
	res.render('pages/cover_page', {
		my_title: "Cover Page"
	});
});

app.get('/account_recovery', function (req, res) {
	if (req.oidc.isAuthenticated()) {
		res.render('pages/account_recovery', {
			my_title: "Account Recovery",
			message: 'You are already logged in.'
		});
	}
	else {
		res.render('pages/account_recovery', {
			my_title: "Account Recovery",
			message: ''
		});
	}
});

app.post('/account_recovery', function (req, res) {   // Gustavo G
	var account_search = req.body.account_name;
	var search_statement = `select count(*) from logins where logins.email = '${account_search}';`;
	db.task('get-everything', task => {
		return task.batch([
			task.any(search_statement),
		]);
	})
		.then(info => {
			if (info[0][0].count === '0') {
				result = 'You do not have an account registered with us.';
			}
			else {
				result = `Your account ${account_search} is registered with us.`;
			}
			res.render('pages/account_recovery', {
				my_title: "Account Recovery",
				message: result
			});
		})

});


app.get('/help_about', function (req, res) {
	res.render('pages/help_about', {
		my_title: "Help and About"
	});
});

app.get('/homepage', function (req, res) {
	if (req.oidc.isAuthenticated()) {
		var account_email = app.locals.user.email
		var account_search = `select * from logins where logins.email = '${account_email}';`;
		db.task('get-everything', task => {
			return task.batch([
				task.any(account_search),
			]);
		}).then(info => {
			if (info[0][0]) {
				document_result = info[0][0].document_list
				knowledge_result = info[0][0].knowledge_levels
			}
			else {
				document_result = ''
				knowledge_result = ''
			}
			res.render('pages/homepage', {
				my_title: "Homepage",
				document_info: document_result,
				knowledge_info: knowledge_result
			});
		})
	}
	else {
		res.render('pages/cover_page', {
			my_title: "Cover Page"
		});
	}
});



app.get('/knowledge', function (req, res) {
	if (req.oidc.isAuthenticated()) {
		console.log(app.locals.user)
		var account_email = app.locals.user.email
		var account_search = `select * from logins where logins.email = '${account_email}';`;
		db.task('get-everything', task => {
			return task.batch([
				task.any(account_search),
			]);
		}).then(info => {
			res.render('pages/knowledge', {
				my_title: "Knowledge Surveys",
				document_info: info[0][0].document_list
			});
		})
	}
	else {
		res.render('pages/cover_page', {
			my_title: "Cover Page"
		});
	}
});

app.post('/knowledge', function (req, res) {
	var search_document = req.body.document_list;     // Ramy Kassam 
	var input_knowledge_level = parseInt(req.body.input_knowledge);

	if (req.oidc.isAuthenticated()) {
		var account_email = app.locals.user.email
		var account_search = `select * from logins where logins.email = '${account_email}';`;
		var document_index = `select array_position(document_list, '${search_document}') from logins where logins.email = '${account_email}';`;
		db.task('get-everything', task => {
			return task.batch([
				task.any(account_search),
				task.any(document_index)
			]);
		}).then(info => {
			var index = info[1][0].array_position;
			var update_level = `update logins set knowledge_levels[${index}] = ${input_knowledge_level}  where logins.email = '${account_email}';`;
			db.task('get-everything', task => {
				return task.batch([
					task.any(update_level),
					task.any(account_search)
				]);
			}).then(result => {
				res.render('pages/homepage', {
					my_title: "Homepage",
					document_info: result[1][0].document_list,
					knowledge_info: result[1][0].knowledge_levels
				});
			})

		})
	}
	else {
		res.render('pages/cover_page', {
			my_title: "Cover Page"
		});
	}
})

app.get('/upload', function (req, res) {
	if (req.oidc.isAuthenticated()) {
		res.render('pages/upload', {    // Ramy Kassam 
			my_title: "Upload",
			message: ''
		});
	}
	else {
		res.render('pages/cover_page', {
			my_title: "Cover Page"
		});
	}
});

var uploadfile = -1;
var storage = multer.diskStorage({
	filename: function (req, file, cb) {
		let splt = file.originalname.split(".");  // Ramy Kassam 
		cb(null, file.originalname)

		var query = `select document_list from logins where email = '${currEmail}'`;

		db.any(query)
			.then(function (data) {

				var stringData = JSON.stringify(data);
				let arr = stringData.split("\"");
				var exist = false;

				for (let i = 3; i < arr.length - 1; i++) {
					if (arr[i] != ",") {
						if (arr[i] == file.originalname) {
							exist = true;
						}
					}
				}
				if (exist == false) {
					uploadfile = 1; // true 
					var insert = `update logins set document_list = array_append(document_list, '${file.originalname}') where email = '${currEmail}';`;
					db.none(insert)
						.then(() => { })
						.catch(error => {
							console.log('ERROR:', error); // print error;
						});
					//Instert rating 
					insert = `update logins set knowledge_levels = array_append(knowledge_levels, '1') where email = '${currEmail}';`;
					db.none(insert)
						.then(() => { })
						.catch(error => {
							console.log('ERROR:', error); // print error;
						});
				}
				else {
					uploadfile = 0; //false
				}
			})
			.catch(function (err) {
				console.log('error', err);
			})
	}
})

const maxSize = 10 * 1000 * 1000;
var upload = multer({
	storage: storage,
	limits: { fileSize: maxSize }
}).array("files", 10);

app.post('/upload', function (req, res, next) {    // Alberto Espinosa 
	upload(req, res, function (err) {
		if (err) {
			res.send(err)
		}
		else {
			// SUCCESS, image successfully uploaded
			// res.send("Success, Image uploaded!")
			var msg = "";
			if (uploadfile == 1) {
				msg = "Success, Image uploaded!";
			}
			else if (uploadfile == 0) {
				msg = "Sorry, this file arealy exists"
			}
			res.render('pages/upload', {
				my_title: "Upload",
				message: msg
			});
		}
	})
});



app.get('/settings', function (req, res) {
	if (req.oidc.isAuthenticated()) {
		res.render('pages/settings', {
			my_title: "Settings"
		});
	}
	else {
		res.render('pages/cover_page', {
			my_title: "Cover Page"
		});
	}
});



app.listen(3000);
const server = app.listen(process.env.PORT || 3000, () => {
	console.log(`Express running → PORT ${server.address().port}`);
  });
