import { sql } from "mssql"; // Import the appropriate MSSQL module
import pool from "../config/database.js"; // Assuming you have a database configuration file

// Define the MSSQL table creation query
const createTableQuery = `
CREATE TABLE Likes (
    id INT IDENTITY(1,1) PRIMARY KEY,
    userId INT FOREIGN KEY REFERENCES Users(id),
    postId INT FOREIGN KEY REFERENCES Posts(id),
    author NVARCHAR(MAX) FOREIGN KEY REFERENCES Posts(id),
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE(),
);
`;

// Execute the table creation query
pool.request().query(createTableQuery).then(() => {
  console.log("Table created successfully.");
}).catch((err) => {
  console.error("Error creating table:", err);
});

// Export the Like model functions
// These functions will interact with the Likes table
export const Like = {
  // Function to create a new like
  create: async (userId, postId, author) => {
    try {
      const result = await pool
        .request()
        .input("userId", sql.Int, userId)
        .input("postId", sql.Int, postId)
        .input("author", sql.NVarChar, author)
        .query(
          "INSERT INTO Likes (userId, postId, author) VALUES (@userId, @postId, @author)"
        );
      
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  },
  // Other CRUD operations for Likes can be implemented similarly
};
