const bcrypt = require("bcrypt");
const sql = require("mssql");
const jwt = require("jsonwebtoken");
// const createJWT = require("../utils/helpers")
//const { pool } = require('../server');
//const config = require('../server').config;
// Create a pool and connect to SQL Server

const config = {
  user: "new",
  password: "1234",
  server: "DESKTOP-4LCJAUE\\SQLEXPRESS01",
  database: "SocialMedia",
  options: {
    trustServerCertificate: true,
  },
};
const pool = new sql.ConnectionPool(config);

// Ensure the pool is connectend before exporting the functions
pool.connect(err => {
  if (err) {
    console.error("Failed to connect to the database:", err);
    process.exit(1);
  }
});


async function register(req, res) {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      gender,
      birthday,
    } = req.body;

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ error: "Password confirmation does not match the password." });
    }
   

    // Check if user with the same email exists
    const existingUser = await pool
      .request()
      .input("email", sql.NVarChar, email)
      .query("SELECT * FROM Users WHERE email = @email");

    if (existingUser.recordset.length > 0) {
      return res.status(400).json({ error: "User exists!" });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert new user into the database
    const newUser = await pool
      .request()
      .input("firstName", sql.NVarChar, firstName)
      .input("lastName", sql.NVarChar, lastName)
      .input("email", sql.NVarChar, email)
      .input("password", sql.NVarChar, passwordHash)
      .input("confirmPassword", sql.NVarChar, passwordHash)
      .input("gender", sql.NVarChar, gender)
      .input("birthday", sql.Date, birthday)
      .query(
        "INSERT INTO Users (firstName, lastName, email, password, confirmPassword, gender, birthday) VALUES (@firstName, @lastName, @email, @password, @confirmPassword, @gender, @birthday)"
      );
      

    // Email verification
    // You'll need to implement this based on your email provider and verification process

    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

async function login(req, res) {
  const { email, password } = req.body;

  try {
    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: "Please provide user credentials" });
    }

    // Find user by email
    const user = await pool
      .request()
      .input("email", sql.NVarChar, email)
      .query("SELECT * FROM Users WHERE email = @email");

    if (user.recordset.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const userData = user.recordset[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, userData.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Remove password from user data
    delete userData.password;
    
    const createJWT = (id) => {
      return jwt.sign({ userId: id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
    };
    // Generate JWT token
    const token = createJWT(userData._id);

    res.status(200).json({ success: true, message: "Login successful", user: userData, token });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


module.exports = { register, login };
