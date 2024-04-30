const { sql } = require("mssql");

// Define the MSSQL table creation query
const createTableQuery = `
CREATE TABLE Posts (
    id INT IDENTITY(1,1) PRIMARY KEY,
    userId INT FOREIGN KEY REFERENCES Users(id),
    author NVARCHAR(MAX),
    description NVARCHAR(MAX) NOT NULL,
    pictures NVARCHAR(MAX),
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE()
);
`;

// Execute the table creation query
pool
  .request()
  .query(createTableQuery)
  .then(() => {
    console.log("Posts table created successfully.");
  })
  .catch((err) => {
    console.error("Error creating Posts table:", err);
  });

// Export the Post model functions
// These functions will interact with the Posts table
module.exports = {
  // Function to create a new post
  create: async (userId, author, description, pictures) => {
    try {
      const result = await pool
        .request()
        .input("userId", sql.Int, userId)
        .input("author", sql.NVarChar, author)
        .input("description", sql.NVarChar, description)
        .input("pictures", sql.NVarChar, pictures)
        .query(
          "INSERT INTO Posts (userId, author, description, pictures) VALUES (@userId, @author, @description, @pictures)"
        );

      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  },
};
