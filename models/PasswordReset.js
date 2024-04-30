const { sql } = require("mssql");

// Define the MSSQL table creation query
const createTableQuery = `
CREATE TABLE PasswordReset (
    id INT IDENTITY(1,1) PRIMARY KEY,
    userId NVARCHAR(255) UNIQUE,
    email NVARCHAR(255) UNIQUE,
    token NVARCHAR(MAX),
    createdAt DATETIME,
    expiresAt DATETIME
);
`;

// Execute the table creation query
pool
  .request()
  .query(createTableQuery)
  .then(() => {
    console.log("PasswordReset table created successfully.");
  })
  .catch((err) => {
    console.error("Error creating PasswordReset table:", err);
  });

// Export the PasswordReset model functions
// These functions will interact with the PasswordReset table
module.exports = {
  // Function to create a new password reset entry
  create: async (userId, email, token, createdAt, expiresAt) => {
    try {
      const result = await pool
        .request()
        .input("userId", sql.NVarChar, userId)
        .input("email", sql.NVarChar, email)
        .input("token", sql.NVarChar, token)
        .input("createdAt", sql.DateTime, createdAt)
        .input("expiresAt", sql.DateTime, expiresAt)
        .query(
          "INSERT INTO PasswordReset (userId, email, token, createdAt, expiresAt) VALUES (@userId, @email, @token, @createdAt, @expiresAt)"
        );

      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  },
};
