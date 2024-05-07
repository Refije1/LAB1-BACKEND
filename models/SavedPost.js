const sql = require("mssql");

const config = {
  user: "ari_kadriu",
  password: "123456",
  server: "127.0.0.1",
  database: "SocialMedia",
  options: {
    trustServerCertificate: true,
  },
};

const pool = new sql.ConnectionPool(config);

// Define the MSSQL table creation query
const createTableQuery = `
CREATE TABLE SavedPosts (
    id INT IDENTITY(1,1) PRIMARY KEY,
    userId INT FOREIGN KEY REFERENCES Users(id),
    postId INT FOREIGN KEY REFERENCES Posts(id),
    folderId INT FOREIGN KEY REFERENCES Folders(id),
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE()
);
`;

// Execute the table creation query
pool
  .request()
  .query(createTableQuery)
  .then(() => {
    console.log("SavedPosts table created successfully.");
  })
  .catch((err) => {
    console.error("Error creating SavedPosts table:", err);
  });

// Export the SavedPost model functions
module.exports = {
  // Function to create a new saved post entry
  create: async (userId, postId, folderId = null) => {
    try {
      const result = await pool
        .request()
        .input("userId", sql.Int, userId)
        .input("postId", sql.Int, postId)
        .input("folderId", sql.Int, folderId)
        .query(
          "INSERT INTO SavedPosts (userId, postId, folderId) VALUES (@userId, @postId, @folderId)"
        );

      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  },
};
