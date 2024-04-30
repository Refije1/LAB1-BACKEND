const { sql } = require("mssql");
const pool = require("../server");

// Function to create the Users table
const createUsersTable = async () => {
  try {
    const query = `
      CREATE TABLE Users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        username NVARCHAR(255),
        email NVARCHAR(255),
        password NVARCHAR(255),
        createdAt DATETIME DEFAULT GETDATE(),
        updatedAt DATETIME DEFAULT GETDATE()
      );
    `;
    await pool.request().query(query);
    console.log("Users table created successfully.");
  } catch (error) {
    console.error("Error creating Users table:", error);
    throw error;
  }
};

// Function to insert a new user
const createUser = async (username, email, password) => {
  try {
    const query = `
      INSERT INTO Users (username, email, password)
      OUTPUT INSERTED.id
      VALUES (@username, @email, @password);
    `;
    const result = await pool
      .request()
      .input("username", sql.NVarChar, username)
      .input("email", sql.NVarChar, email)
      .input("password", sql.NVarChar, password)
      .query(query);
    return result.recordset[0].id;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// Function to find a user by ID
const findUserById = async (userId) => {
  try {
    const query = "SELECT * FROM Users WHERE id = @userId;";
    const result = await pool
      .request()
      .input("userId", sql.Int, userId)
      .query(query);
    return result.recordset[0];
  } catch (error) {
    console.error("Error finding user by ID:", error);
    throw error;
  }
};

// Function to find a user by email
const findUserByEmail = async (email) => {
  try {
    const query = "SELECT * FROM Users WHERE email = @email;";
    const result = await pool
      .request()
      .input("email", sql.NVarChar, email)
      .query(query);
    return result.recordset[0];
  } catch (error) {
    console.error("Error finding user by email:", error);
    throw error;
  }
};

// Function to update a user by ID
const updateUserById = async (userId, updates) => {
  try {
    const { username, email, password } = updates;
    const query = `
      UPDATE Users
      SET
        username = @username,
        email = @email,
        password = @password,
        updatedAt = GETDATE()
      WHERE id = @userId;
    `;
    await pool
      .request()
      .input("username", sql.NVarChar, username)
      .input("email", sql.NVarChar, email)
      .input("password", sql.NVarChar, password)
      .input("userId", sql.Int, userId)
      .query(query);
    console.log("User updated successfully.");
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// Function to delete a user by ID
const deleteUserById = async (userId) => {
  try {
    const query = "DELETE FROM Users WHERE id = @userId;";
    await pool.request().input("userId", sql.Int, userId).query(query);
    console.log("User deleted successfully.");
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

module.exports = {
  createUsersTable,
  createUser,
  findUserById,
  findUserByEmail,
  updateUserById,
  deleteUserById,
};
