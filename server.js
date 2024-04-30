const express = require("express");
const app = express();
const sql = require("mssql");
const { specs, swaggerUi } = require("./swagger");

// config for your database
const config = {
  user: "v1",
  password: "1234",
  server: "VALONPC\\SQLEXPRESS",
  database: "Social-media",
  options: {
    trustServerCertificate: true,
  },
};

// Create a pool and connect to SQL Server
const pool = new sql.ConnectionPool(config);

// Export the pool and start the server only after the connection is established
pool.connect((err) => {
  if (err) {
    console.error("Error connecting to SQL Server:", err);
  } else {
    console.log("Connection to SQL Server successful!");
    // Start the server
    const server = app.listen(4200, function () {
      console.log("Server is running..");
    });
  }
});

module.exports = { app, pool };
