const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');
const usersRoutes = require('./routes/users');
const express = require("express");
const cors = require("cors");
const app = express();
const sql = require("mssql");
const { specs, swaggerUi } = require("./swagger");
const bodyParser = require('body-parser');


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

app.use(bodyParser.json());
app.use(cors());

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


// Create a pool and connect to SQL Server
const pool = new sql.ConnectionPool(config);

async function getUsers() {
  try {
    await pool.connect(); // Ensure the pool is connected

    const result = await pool.request().query("SELECT * FROM Users");

    return result.recordset;
  } catch (error) {
    throw error;
  }
}

app.get("/users", async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.use(postsRoutes);
app.use(usersRoutes);

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
app.use(authRoutes);

module.exports = { app, pool, sql,config }; // Export sql object too, if needed
