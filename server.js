var express = require("express");
var app = express();
var sql = require("mssql");

// config for your database
var config = {
  user: "new",
  password: "1234",
  server: "VALONPC\\SQLEXPRESS",
  database: "Social-media",
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

app.get("/posts", function (req, res) {
  // create Request object
  var request = new sql.Request();

  // query to the database and get the records
  request.query("select * from Posts", function (err, recordset) {
    if (err) console.log(err);

    // send records as a response
    res.send(recordset);
  });
});

var server = app.listen(3000, function () {
  console.log("Server is running..");
});
