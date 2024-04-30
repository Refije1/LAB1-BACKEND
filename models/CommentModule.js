import { sql } from "mssql"; // Import the appropriate MSSQL module
import pool from "../config/database.js"; // Assuming you have a database configuration file

// Define the MSSQL table creation query
const createTableQuery = `
CREATE TABLE Comments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    userId INT FOREIGN KEY REFERENCES Users(id),
    postId INT FOREIGN KEY REFERENCES Posts(id),
    content NVARCHAR(MAX) NOT NULL,
    author NVARCHAR(MAX) FOREIGN KEY REFERENCES Users(id),
    commenterProfilePicture NVARCHAR(MAX),
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE(),
);

CREATE TABLE Replies (
    id INT IDENTITY(1,1) PRIMARY KEY,
    commentId INT FOREIGN KEY REFERENCES Comments(id),
    userId INT FOREIGN KEY REFERENCES Users(id),
    author NVARCHAR(MAX) FOREIGN KEY REFERENCES Users(id),
    content NVARCHAR(MAX),
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE(),
);

CREATE TABLE CommentLikes (
    id INT IDENTITY(1,1) PRIMARY KEY,
    commentId INT FOREIGN KEY REFERENCES Comments(id),
    userId INT FOREIGN KEY REFERENCES Users(id),
    createdAt DATETIME DEFAULT GETDATE()
);
`;

// Execute the table creation query
pool.request().query(createTableQuery).then(() => {
  console.log("Tables created successfully.");
}).catch((err) => {
  console.error("Error creating tables:", err);
});

// Export the Comment model functions
// These functions will interact with the Comments, Replies, and CommentLikes tables
export const Comments = {
  // Function to create a new comment
  create: async (userId, postId, content, author, commenterProfilePicture) => {
    try {
      const result = await pool
        .request()
        .input("userId", sql.Int, userId)
        .input("postId", sql.Int, postId)
        .input("content", sql.NVarChar, content)
        .input("author", sql.NVarChar, author)
        .input("commenterProfilePicture", sql.NVarChar, commenterProfilePicture)
        .query(
          "INSERT INTO Comments (userId, postId, content, author, commenterProfilePicture) VALUES (@userId, @postId, @content, @author, @commenterProfilePicture)"
        );
      
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  },
  // Other CRUD operations for Comments, Replies, and CommentLikes can be implemented similarly
};
