const authRoutes = require('./routes/auth');
//const indexRoutes= require('./routes/index');
const postsRoutes= require('./routes/posts');
const usersRoutes= require('./routes/users')

var express = require("express");
var app = express();
var sql = require("mssql");
var { specs, swaggerUi } = require('./swagger');  


// config for your database
var config = {
  user: "ari_kadriu",
  password: "123456",
  server: "127.0.0.1",
  database: "SocialMedia",
  options: {
    trustServerCertificate: true,
  },
};

// Connect to SQL Server
sql.connect(config, (err) => {
  if (err) {
    throw err;
  }
  console.log("Connection Successful!");
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(function (req, res, next) {
  //Enabling CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
    next();
  });


  app.use(authRoutes);
  //app.use(indexRoutes);
  app.use(postsRoutes);
  app.use(usersRoutes);

app.get("/", function (req, res) {
  // create Request object
  var request = new sql.Request();

  // query to the database and get the records
  request.query("select * from Users", function (err, recordset) {
    if (err) console.log(err);

    // send records as a response
    res.send(recordset);
  });
});

// app.get("/posts", function (req, res) {
//   // create Request object
//   var request = new sql.Request();

//   // query to the database and get the records
//   request.query("select * from Posts", function (err, recordset) {
//     if (err) console.log(err);

//     // send records as a response
//     res.send(recordset);
//   });
// });

var server = app.listen(4200, function () {
  console.log("Server is running..");
});
